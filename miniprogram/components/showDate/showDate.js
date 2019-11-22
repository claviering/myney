const {
  WEEK,
  MONTH,
  EXPEND_CATEGORY_LIST,
  INCOME_CATEGORY_LIST,
} = require('./../../constant/index.js');
const timer = require('./../../utils/time.js');
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
    /**
     * 保存数据
     * @param {Object} params  保存到数据库的参数
     */
    add: async function (params) {
      let res = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'add',
          params
        }
      })
      this.triggerEvent('goBackHome')
    },
    /**
     * 用户选择日期
     * @param {event} e 点击时间事件
     */
    bindDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.showTime(e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    /**
     * 用户选择分类，然后请求接口保存到数据库
     * @param {event} e 点击选择分类事件
     */
    selectCateGory: function (e) {
      if (!e || !e.target || !e.target.dataset || !e.target.dataset.key) {
        return;
      }
      let category = e.target.dataset.key
      if (!this.data.money) {
        return
      }
      let params = {
        category,
        money: this.formatMoney(this.data.money),
        remark: this.data.remark || '',
        date: new Date(timer.dateToTime(this.data.date)), // 保存为 Date 对象 才可以用于进行日期比较
        // operCode: this.properties.option,
      }
      this.add(params)
    },
    /**
     * 根据 operCode 格式化金钱的正负数
     * @param {String | Number} money 金额
     * @param {String} operCode negative 或者是 positive
     */
    formatMoney: function(money, operCode) {
      switch (operCode) {
        case 'negative':
          money = Number.parseFloat(money)
          break;
        case 'positive':
          money = Number.parseFloat('-' + money)
          break;
        default:
          money = Number.parseFloat(money)
          break;
      }
      return money
    },
    /**
     * 格式化日期输出到屏幕, 支持中英文
     * @param {Date} selectDate 选中的日期
     */
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
    /**
     * 获取用户输入的金额
     * @param {event} e 用户输入金额事件
     */
    setMoney: function (e) {
      this.setData({
        money: e.detail.value
      })
    },
    /**
     * 获取用户输入的备注
     * @param {event} e 用户输入备注事件
     */
    setRemark: function (e) {
      this.setData({
        remark: e.detail.value
      })
    },
  },
  attached() {
    this.showTime()
  },
  ready() {
    // 设置分类类别
    this.setData({
      categoryList: CATEGORY_TYPE[this.properties.option]
    })
  }
})