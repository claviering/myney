const app = getApp();
const {
  OPER_LIST,
  SHOW_TOAST_TEXT
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    operList: OPER_LIST,
  },
  methods: {
    selectOper: async function (event) {
      let operKey = event.target.dataset.key
      switch (operKey) {
        case 'download':
          this.download();
          break;
        case 'upload':
          this.upload();
          break;
        case 'count':
          this.count();
          break;
        case 'zh_CN':
          this.changeLanguage('zh_CN');
          break;
        case 'en':
          this.changeLanguage('en');
          break;
        default:
          break;
      }
    },
    /**
     * 更换小程序语言
     * @param {String} language 
     */
    changeLanguage: function (language) {
      if (!language) return;
      wx.setStorageSync('i18n', language);
      this.triggerEvent('closeRightMenu');
      wx.showToast({
        title: SHOW_TOAST_TEXT.CHANGE_LANG,
        icon: 'none',
        duration: 2000
      })
    },
    count: function () {
      this.triggerEvent('closeRightMenu', '/pages/pie/index');
    },
    download: async function () {
      let {result} = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'download'
        }
      })
      if (!result || result.errmsg !== 'ok') {
        return;
      }
      let  url = result.file_url;
      wx.downloadFile({url, success (downloadResult) {
      }});
      // this.triggerEvent('closeRightMenu');
    },
    upload: function () {
      this.setStringToDate(0);
    },
    /**
     * 洗数接口, 把 string 类型的日期转 data 类型
     * @param {Number} pageNumber 页数
     */
    setStringToDate: async function (pageNumber) {
      let {result} = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'upload',
          params: {
            pageNumber: pageNumber
          }
        }
      });
      if (result) {
        this.setStringToDate(pageNumber + 1);
      }
    },
  },
  ready() {
  },
  attached() {
  },
})