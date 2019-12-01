const cloud = require('wx-server-sdk')
const CONFIG = require('config.json')
const UTILS = require('utils.js')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  event.params._openid = OPENID // 给全部参数插入 _openid
  const action = event.action
  if (ACTIONC_MAP[action]) {
    try {
      let res = await ACTIONC_MAP[action](event.params, context)
      return res
    } catch (error) {
      return {
        error,
        message: '请求错误， 触发异常'
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
    const accessToken = await auth.getAccessToken({
      grant_type: 'client_credential',
      appid: APPID,
      secret: CONFIG.secret,
    })
    return accessToken;
  }
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
