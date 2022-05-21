const {
  WEEK,
  MONTH,
  OPERATE,
  COMMON_TEXT
} = require('./../../constant/index.js');
const timer = require('./../../utils/time.js');
const utils = require('./../../utils/index.js');
const app = getApp()
const i18nFileName = app.globalData.i18n


Component({
  properties: {
    option: Object,
  },
  data: {
    dataText: '',
    money: '',
    remark: '',
    date: '',
    operCode: '',
    _id: '',
    categoryList: [],
    deleteText: '',
    displayDelete: false,
    invaild: false,
    loading: false, // 防止网络不好的时候多次添加
    isiPhone: app.globalData.isiPhone, // 判断手机类型
    COMMON_TEXT: COMMON_TEXT, // 判断手机类型
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
          params: params
        }
      })
    },
    /**
     * 跟新数据
     * @param {Object} params  保存到数据库的参数
     */
    update: async function (params) {
      let res = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'update',
          params: params
        }
      })
    },
    /**
     * 用户选择日期
     * @param {event} e 点击时间事件
     */
    bindDateChange: function(e) {
      this.showTime(e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    remove: async function () {
      let params = {
        _id: this.data._id
      }
      this.triggerEvent('goBackHome')
      let res = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'remove',
          params: params
        }
      })
    },
    /**
     * 用户选择分类，然后请求接口保存到数据库
     * @param {event} e 点击选择分类事件
     */
    selectCateGory: async function (e) {
      if (!e || !e.target || !e.target.dataset || !e.target.dataset.key || this.data.loading) {
        return;
      }
      let category = e.target.dataset.key;
      if (!this.data.money || !this.data.date) return;
      let money = this.formatMoney(this.data.money, this.data.operCode);
      let testMoneyResult = utils.testMoney(money);
      if (!testMoneyResult) {
        this.showInvaild(true);
        return;
      }
      let params = {
        category,
        money,
        remark: this.data.remark || '',
        date: timer.time(this.data.date), // 保存为 Date 对象 才可以用于进行日期比较
      }
      let _id = this.data._id
      this.setData({
        loading: true
      })
      this.triggerEvent('goBackHome')
      if (_id) {
        params._id = _id;
        await this.update(params);
      } else {
        await this.add(params);
      }
      this.setData({
        loading: false
      })
    },
    /**
     * 根据 operCode 格式化金钱的正负数
     * @param {String | Number} money 金额
     * @param {String} operCode negative 或者是 positive
     */
    formatMoney: function(money, operCode) {
      switch (operCode) {
        case 'negative':
            money = Number.parseFloat('-' + money)
          break;
          case 'positive':
            money = Number.parseFloat(money)
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
      let money = e.detail.value;
      let testMoneyResult = utils.testMoney(money);
      if (!testMoneyResult) {
        this.showInvaild(true);
      } else {
        this.showInvaild(false);
        this.setData({
          money: e.detail.value
        });
      }
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
    /**
     * 显示错误信息
     */
    showInvaild: function (invaild) {
      this.setData({
        invaild: invaild
      });
    },
  },
  attached() {
    this.showTime();
  },
  ready() {
    if (!this.properties.option) return;
    this.showTime(this.properties.option.date);
    const CATEGORY_TYPE = {
      negative: app.globalData.EXPEND_CATEGORY_LIST,
      positive: app.globalData.INCOME_CATEGORY_LIST,
    }
    // 设置分类类别
    this.setData({
      categoryList: CATEGORY_TYPE[this.properties.option.operCode],
      money: Math.abs(this.properties.option.money),
      remark: this.properties.option.remark,
      date: this.properties.option.date || new Date(),
      _id: this.properties.option._id,
      operCode: this.properties.option.operCode,
      deleteText: OPERATE.delete,
      displayDelete: this.properties.option._id ? true : false
    })
  }
})