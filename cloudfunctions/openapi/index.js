const axios = require('axios');
const UTILS = require('utils.js');
const cloud = require('wx-server-sdk');
const CONFIG = require('config.json');
cloud.init({
  env: CONFIG.dev_env,
})
const db = cloud.database();
const _ = db.command;
const baseUrl = CONFIG.weixin;


// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  if (event.params) {
    event.params._openid = OPENID // 给全部参数插入 _openid
  }
  const action = event.action
  if (ACTIONC_MAP[action]) {
    try {
      let res = await ACTIONC_MAP[action](event.params, context)
      return res
    } catch (error) {
      return {
        error,
        message: '请求错误， 触发异常',
      }
    }
  } else {
    return false
  }
}

const ACTIONC_MAP = {
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
    let {from, to, timeType} = params
    let result = await db.collection(CONFIG.collection).where({
      date: _.gte(new Date(from)).and(_.lte(new Date(to)))
    }).get()
    if (!result || !result.data || !result.data.length) {
      return result;
    }
    result.data.forEach(item => {
      item.dateText = timeType === 'year' ? UTILS.formatDate(item.date) : UTILS.formatMonthDay(item.date);
      return item;
    })
    result.data = UTILS.groupBy(result.data, 'category');
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
    const {ENV} = cloud.getWXContext()
    let accessToken = await this.getAccessToken();
    if (!accessToken) return false;
    let filePath = getFilePath();
    let collection = CONFIG.collection;
    let url = `${baseUrl}/tcb/databasemigrateexport?access_token=${accessToken}`;
    let params = {
      env: ENV,
      file_path: filePath,
      file_type: CONFIG.file_type, // 1: JSON, 2: CSV
      query: `db.collection('${collection}').field({category:true,date:true,money:true,remark:true,_id:false}).get()`,
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
    // let res = await setStringToDate(params);
    return true;
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
    console.log('pageNumber', pageNumber);
    let dataResult = await db.collection(CONFIG.collection).skip(pageNumber * MAX_LIMIT).limit(MAX_LIMIT).get();
    if (!dataResult || !dataResult.data || !dataResult.data.length) {
      return false;
    }
    for (let index = 0; index < dataResult.data.length; index++) {
      const element = dataResult.data[index];
      if (typeof element.date !== 'string') continue;
      let formatDateString = UTILS.convertDateString(element.date);
      let res = await db.collection(CONFIG.collection).doc(element._id).update({data: {
        date: new Date(formatDateString)
      }});
    }
    return true;
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
