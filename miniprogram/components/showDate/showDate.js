const {WEEK, MONTH} = require('./../../constant/index.js');
const app = getApp()
const i18nFileName = app.globalData.i18n
Component({
  properties: {},
  data: {
    dataText: '',
  },
  methods: {
    showTime: function (params) {
      let date = new Date()
      let week = date.getDay();
      let month = date.getMonth();
      let day = date.getDate();
      if (i18nFileName === 'zh_CN') day = day + ' 号'
      let dataText = WEEK[week] + ' ' + MONTH[month] + ' ' + day
      this.setData({
        dataText
      })
    }
  },
  attached() {
    this.showTime()
  }
})