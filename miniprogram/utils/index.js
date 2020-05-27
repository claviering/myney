const REG = /^\d+(\.\d{1,2})?$/; // 两位小数

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
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              if (res && res.userInfo) {
                app.userInfo = res.userInfo
              }
            }
          })
        }
      }
    })
  },
  onGetOpenid: function (app) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  /**
   * 根据 key 给数据对象分类
   * @param {Arrya} dataList 数组对象
   * @param {String} key 获取数据的 key
   * @param {String} value 获取这个值的数据
   * @return {Object}
   */
  get: function (dataList, key, value) {
    if (!dataList || !dataList.length || !Array.isArray(dataList) || typeof key !== 'string') {
      throw '参数错误';
    }
    let dataMap = {};
    dataList.forEach(item => {
      let mapValue = item[key];
      dataMap[mapValue] = item;
    });
    return dataMap[value];
  },
  /**
   * JS 对象转 url 查询字符串
   * @param {Object} obj 
   */
  objectToQueryString: (obj) => Object.keys(obj).map((key) => `${key}=${obj[key]}`).join('&'),
  /**
   * 判断用户滑动左滑还是右滑
   */
  getTouchData: (endX, endY, startX, startY) => {
    if (endX - startX > 50 && Math.abs(endY - startY) < 50) { // 右滑
      return "LEFT";
    } else if (endX - startX < -50 && Math.abs(endY - startY) < 50) { // 左滑
      return "RIGHT";
    }
  },
  /**
   * 判断输入是否正确，两位小数的正整数
   * @param {String | Numebr} number 数字
   * @return {Boolean} true | false
   */
  testMoney: (number) => {
    if (!number) return false;
    if (typeof number === 'number') {
      number = Math.abs(number);
      number = number.toString();
    }
    let testResult = REG.test(number);
    return testResult;
  }
}