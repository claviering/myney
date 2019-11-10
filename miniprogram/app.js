const utils = require('/utils/index')
const i18nFileName = utils.getI18nSync()
const config = require('/config/index.js');

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.env,
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo: {}, // 用户信息
      i18n: i18nFileName // 用户语言
    }
  },
  onShow: function () {
    // utils.getUserInfo(this)
    // utils.onGetOpenid(this)
  }
})
