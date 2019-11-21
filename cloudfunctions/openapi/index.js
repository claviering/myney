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
  console.log('event', event)
  console.log('context', context)

  const { OPENID } = cloud.getWXContext()
  event.params._openid = OPENID // 给全部参数插入 _openid
  const action = event.action
  if (ACTIONC_MAP[action]) {
    let res = await ACTIONC_MAP[action](event.params, context)
    return res
  } else {
    return false
  }
}

const ACTIONC_MAP = {
  add: async function (params, context) {
    let result = await db.collection(CONFIG.collection).add({data: params})
    return result
  },
  get: async function (params, context) {
    let {from, to} = params
    let result = await db.collection(CONFIG.collection).where({
      date: _.gte(new Date(from)).and(_.lte(new Date(to)))
    }).get()
    if (result && result.data && result.data.length) {
      result.data.forEach(item => {
        item.dateText = UTILS.timer(item.date)
        return item
      })
    }
    return result
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
