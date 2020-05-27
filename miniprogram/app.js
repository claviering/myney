// 不可以再初始化 globalData 前引入 /constant/index.js 会拿不到实例
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
      i18n: '', // 用户语言
      isiPhone: false, // 判断 iPhone 是否有底部的黑条
    }
    let info = this.initSetting();
    this.globalData = Object.assign(this.globalData, info)
  },
  onShow: function () {
    // utils.getUserInfo(this)
    // utils.onGetOpenid(this)
  },
  /**
   * 初始化用户配置
   * 语言设置，手机类型
   * @return {Object}
   */
  initSetting: function () {
    let isiPhone = false;
    let i18n = '';
    const res = wx.getSystemInfoSync();
    if (!res) return;
    // 手机类型设置
    if (res.model) {
      config.modelList.forEach(item => {
        let index = res.model.indexOf(item)
        isiPhone = isiPhone || (index > -1 ? true : false);
      });
    }
    // 语言设置
    if (res.language) {
      i18n = res.language;
      if (i18n === 'zh') {
        i18n = 'zh_CN';
      }
      i18n = wx.getStorageSync('i18n') || i18n;
    }
    return {isiPhone, i18n};
  },
  /**
   * 生成多语言映射
   */
  getlanguageMap: function () {
    const {
      EXPEND_CATEGORY_LIST,
      INCOME_CATEGORY_LIST,
    } = require('/constant/index.js');
    let languageMap = {};
    EXPEND_CATEGORY_LIST.forEach(element => {
      languageMap[element.key] = element.value;
    });
    INCOME_CATEGORY_LIST.forEach(element => {
      languageMap[element.key] = element.value;
    });
    return languageMap;
  }
})
