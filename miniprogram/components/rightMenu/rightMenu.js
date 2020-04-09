const {
  OPER_LIST,
} = require('./../../constant/index.js');
const utils = require('../../utils/index');

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
        default:
          break;
      }
    },
    count: function (params) {
      
      this.triggerEvent('closeRightMenu');
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
        console.log('downloadResult', downloadResult);
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
      console.log('result', result);
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