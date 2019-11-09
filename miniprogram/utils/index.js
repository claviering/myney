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
  },
  getUserInfo: function (app) {
    if (!wx.cloud) {
      console.error('云函数错误');
      return
    }
    wx.getSetting({
      success: res => {
        console.log('用户信息 res', res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('用户信息 res', res);
              if (res && res.userInfo) {
                app.userInfo = res.userInfo
              }
            }
          })
        }
      }
    })
  },
  onGetOpenid: function(app) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
}