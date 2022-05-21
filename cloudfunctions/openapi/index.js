const axios = require('axios');
const UTILS = require('utils.js');
const cloud = require('wx-server-sdk');
const CONFIG = require('config.json');
cloud.init({
  env: CONFIG.prod_env,
})
const db = cloud.database();
const _ = db.command;
const baseUrl = CONFIG.weixin;


// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  if (event.params) {
    event.params._openid = OPENID // 给全部参数插入 _openid
  } else {
    event.params = {
      _openid: OPENID // 给全部参数插入 _openid
    };
  }
  const action = event.action
  if (ACTIONC_MAP[action]) {
    try {
      let res = await ACTIONC_MAP[action](event.params, context)
      return res
    } catch (error) {
      return {
        error,
        message: '程序错误, 触发异常',
      }
    }
  } else {
    return false
  }
}

const ACTIONC_MAP = {
  /**
   * 获取图标菜单
   * @param {Object} params 
   */
  getExpendCategoryList: async function (params) {
    const data = await db.collection('expend_category').where({
      deleted: 0
    }).orderBy('order', 'asc').field({ deleted: false, order: false, _id: false}).get();
    return data;
  },
  getIncomeCategoryList: async function (params) {
    const data = await db.collection('income_category').where({
      deleted: 0
    }).orderBy('order', 'asc').field({ deleted: false, order: false, _id: false}).get();
    return data;
  },
  /**
   * 获取小程序权限
   * @param {Object} params 
   */
  getPower: async function (params) {
    let hasPower = false;
    let resultList = await getAllData(CONFIG.power_collection, {vaild: true}, {vaild: false, _id: false});
    let powerOpenIdList = [];
    resultList.forEach(item => {
      if (item.data && item.data.length) {
        powerOpenIdList = [...powerOpenIdList, ...item.data];
      }
    });
    let openIdList = powerOpenIdList.map(item => item.openid);
    hasPower = openIdList.includes(params._openid);
    // return true;
    return hasPower;
  },
  /**
   * 添加一条数据
   * @param {Object} data 
   * @param {*} context 
   */
  add: async function (data, context) {
    data.date = new Date(data.date);
    let result = await db.collection(CONFIG.collection).add({data: data})
    return result
  },
  /**
   * 查询数据
   * @param {Object} params 
   * @param {*} context 
   */
  get: async function (params, context) {
    let {from, to, timeType} = params;
    let whereParams = {
      _openid: params._openid,
      date: _.gte(new Date(from)).and(_.lte(new Date(to)))
    }
    let resultList = await getAllData(CONFIG.collection, whereParams, {_openid: false});
    let result = {
      summary: {},
      data: [],
    };
    if (!resultList || !resultList.length) return result;
    resultList.forEach(item => {
      result.data = [...result.data, ...item.data];
    });
    if (!result || !result.data || !result.data.length) {
      result.summary = {};
      return result;
    }
    // 显示格式处理
    result.data.forEach(item => {
      item.dateText = timeType === 'year' ? UTILS.formatDate(item.date) : UTILS.formatMonthDay(item.date);
      item.moneyText = item.money && item.money.toLocaleString();
      return item;
    })
    // 数据分类
    result.data = UTILS.groupBy(result.data, 'category');
    let summary = {};
    let totalExpenditure = 0 // 总支出
    let totalIncome = 0 // 总收入
    let balance = 0 // 收支平衡
    for (const [key, value] of Object.entries(result.data)) {
      if (!value || !value.length) return;
      value.forEach(item => {
        let itemMoney = item.money;
        typeof summary[key] === 'undefined' ? (summary[key] = itemMoney) : (summary[key] += itemMoney);
        itemMoney > 0 ? (totalIncome += itemMoney) : (totalExpenditure += itemMoney);
      });
      summary[key] = Number.parseFloat(summary[key].toFixed(2));
    }
    totalExpenditure = totalExpenditure.toFixed(2);
    totalIncome = totalIncome.toFixed(2);
    balance = Number.parseFloat(totalExpenditure) + Number.parseFloat(totalIncome);
    balance = balance.toFixed(2);
    // 数据汇总
    summary.totalExpenditure = totalExpenditure;
    summary.totalIncome = totalIncome;
    summary.balance = balance;
    result.summary = summary;
    return result;
  },
  /**
   * 更新数据
   * @param {Object} data
   */
  update: async function (data) {
    data.date = new Date(data.date);
    let _id = data._id;
    delete data._id;
    let result = await db.collection(CONFIG.collection).doc(_id).update({data: data});
    return result;
  },
  /**
   * 删除数据
   * @param {Object} params 
   */
  remove: async function (params) {
    let {_id} = params;
    let result = await db.collection(CONFIG.collection).doc(_id).remove();
    return result;
  },
  /**
   * 获取小程序全局唯一后台接口调用凭据（access_token）
   */
  getAccessToken: async function () {
    const {APPID} = cloud.getWXContext()
    const APPSECRET = CONFIG.secret;
    const url = `${baseUrl}/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
    const {data} = await axios.get(url)
    return data && data.access_token;
  },
  /**
   * 1. 数据库导出
   * @return job_id 导出数据库生成的任务 id
   */
  download: async function () {
    const {ENV, OPENID} = cloud.getWXContext()
    let accessToken = await this.getAccessToken();
    if (!accessToken) return false;
    let filePath = getFilePath();
    let collection = CONFIG.collection;
    let url = `${baseUrl}/tcb/databasemigrateexport?access_token=${accessToken}`;
    let params = {
      env: ENV,
      file_path: filePath,
      file_type: CONFIG.file_type, // 1: JSON, 2: CSV
      query: `db.collection('${collection}').where({_openid: ${OPENID}}).field({category:true,date:true,money:true,remark:true,_id:false}).get()`,
    };
    let {data} = await axios({
      url,
      method: 'post',
      headers: {'content-type': 'application/json'},
      params: {access_token: accessToken},
      data: params,
    });
    let downloadOnfo = {
      errmsg: 'ok',
      status: 'waiting'
    };
    // 不断查询, 知道导出完成
    while (downloadOnfo.errmsg === 'ok' &&  downloadOnfo.status !== 'success') {
      downloadOnfo = await databaseMigrateQueryInfo(data && data.job_id, accessToken);
    }
    return downloadOnfo;
  },
  upload: async function (params) {
    // 洗数
    let res = await setStringToDate(params);
    return res;
  },
}

function getFilePath() {
  const { OPENID } = cloud.getWXContext();
  let curTime = UTILS.timer();
  let filePath = `${OPENID}/${curTime}`;
  return filePath;
}

/**
 * 2. 根据 jobId 查询导出是否完成
 * @param {Number} jobId 迁移任务ID
 * @param {String} accessToken access_tken
 * @return 文件导出信息
 */
async function databaseMigrateQueryInfo(jobId, accessToken) {
  if (!jobId) return false;
  const {ENV} = cloud.getWXContext()
  let url = `${baseUrl}/tcb/databasemigratequeryinfo?access_token=${accessToken}`;
  let params = {
    env: ENV,
    job_id: jobId,
  };
  let {data} = await axios({
    url,
    method: 'post',
    headers: {'content-type': 'application/json'},
    params: {access_token: accessToken},
    data: params,
  });
  return data;
}

/**
 * 洗数
 * 导入数据处理, 把 date 字段的 String 类型转 Date 类型
 */
async function setStringToDate(params) {
  const MAX_LIMIT = 100;
  let {pageNumber} = params;
  let dataResult = await db.collection(CONFIG.collection).where({
    _openid: params._openid,
  }).skip(pageNumber * MAX_LIMIT).limit(MAX_LIMIT).get();
  if (!dataResult || !dataResult.data || !dataResult.data.length) {
    return false;
  }
  let result = true;
  for (let index = 0; index < dataResult.data.length; index++) {
    const element = dataResult.data[index];
    if (typeof element.date !== 'string' && typeof element.money !== 'string') continue;
    let formatDateString = UTILS.convertDateString(element.date);
    let formatMoney = UTILS.convertMoneyNuber(element.money);
    let res = await db.collection(CONFIG.collection).doc(element._id).update({data: {
      date: new Date(formatDateString),
      money: formatMoney
    }});
    result = result && res;
  }
  return result;
}

// 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用
async function getWXACode(event) {
  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}

/**
 * 查表表的全部数据
 * @param {*} params
 * @param {String} collection 表名
 * @param {Object} whereParams 查询条件
 * @param {Object} fieldParams 返回字段条件
 * @return {List} 数据的列表
 */
async function getAllData(collection, whereParams, fieldParams) {
  const MAX_LIMIT = 100;
  // 先取出集合记录总数
  const countResult = await db.collection(collection).where({}).count();
  const total = countResult.total;
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  // 承载所有读操作的 promise 的数组
  const tasks = [];
  for (let pageNumber = 0; pageNumber < batchTimes; pageNumber++) {
    const promise = db.collection(collection).where(whereParams).skip(pageNumber * MAX_LIMIT).limit(MAX_LIMIT).field(fieldParams).get();
    tasks.push(promise);
  }
  let resultList = await Promise.all(tasks);
  return resultList;
}