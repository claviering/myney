const {
  WEEK,
  MONTH,
  EXPEND_CATEGORY_LIST,
  INCOME_CATEGORY_LIST,
} = require('./../../constant/index.js');
const config = require('./../../config/index.js');
const timer = require('./../../utils/time.js');
const db = wx.cloud.database()
const app = getApp()
const i18nFileName = app.globalData.i18n
const CATEGORY_TYPE = {
  negative: EXPEND_CATEGORY_LIST,
  positive: INCOME_CATEGORY_LIST,
}

Component({
  properties: {
    option: String,
  },
  data: {
    dataText: '',
    money: '',
    remark: '',
    date: '',
    categoryList: []
  },
  methods: {
    add: async function (params) {
      let res = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'add',
          params
        }
      })
      console.log('add res', res);
      this.triggerEvent('goBackHome')
    },
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.showTime(e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    selectCateGory: function (e) {
      if (!e || !e.target || !e.target.dataset || !e.target.dataset.key) {
        console.error('选择类别时候出错');
        return;
      }
      let category = e.target.dataset.key
      if (!this.data.money) {
        console.error('money 必填');
        return
      }
      let params = {
        category,
        money: this.data.money,
        remark: this.data.remark || '',
        date: timer.dateToTime(this.data.date),
        operCode: this.properties.option,
      }
      console.log('params', params);
      this.add(params)
    },
    showTime: function (selectDate) {
      let date = selectDate ? new Date(selectDate) :  new Date()
      let week = date.getDay();
      let month = date.getMonth();
      let day = date.getDate();
      if (i18nFileName === 'zh_CN') day = day + ' 号'
      let dataText = WEEK[week] + ' ' + MONTH[month] + ' ' + day
      this.setData({
        dataText
      })
    },
    setMoney: function (e) {
      this.setData({
        money: e.detail.value
      })
    },
    setRemark: function (e) {
      this.setData({
        remark: e.detail.value
      })
    },
  },
  attached() {
    console.log('CATEGORY_TYPE', CATEGORY_TYPE);
    this.showTime()
  },
  ready() {
    this.setData({
      categoryList: CATEGORY_TYPE[this.properties.option]
    })
  }
})