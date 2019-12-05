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
      let res = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'download'
        }
      })
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