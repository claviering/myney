const {
  OPER_LIST,
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    operList: OPER_LIST,
    pageNumber: 1
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
        default:
          break;
      }
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
    upload: async function () {
      let pageNumber = this.data.pageNumber;
      let {result} = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'upload',
          params: {
            pageNumber: pageNumber
          }
        }
      });
      this.setData({
        pageNumber: pageNumber + 1
      })
      console.log('result', result);
    }
  },
  ready() {
  },
  attached() {
  },
})