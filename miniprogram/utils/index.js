const config = require('./../config/index.js');

module.exports = {
  // 设置语言到手机存储
  setI18n: function (i18n) {
    wx.setStorage({
      key: 'i18n',
      data: i18n
    })
  },
  // 从手机存储中读取语言配置
  getI18nSync: function () {
    try {
      var i18n = wx.getStorageSync('i18n')
      return i18n || config.i18n
    } catch (e) {
      return config.i18n
    }
  }
}