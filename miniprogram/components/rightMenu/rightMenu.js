const {
  OPER_LIST,
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    operList: OPER_LIST
  },
  methods: {
    selectOper: async function (event) {
      let operKey = event.target.dataset.key
      let operFunctionMap = {
        download: this.download,
        upload: this.upload,
      }
      operFunctionMap[operKey]();
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
      let downloadSetting = {
        url: result.file_url
      };
      let downloadResult = await wx.downloadFile(downloadSetting);
      console.log('downloadResult', downloadResult);
      // this.triggerEvent('closeRightMenu');
    },
    upload: function () {
      
    }
  },
  ready() {
  },
  attached() {
  },
})