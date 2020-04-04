const {
  OPERATE,
} = require('./../../constant/index.js');
const utils = require('../../utils/index');

Component({
  properties: {
    dataObject: Object,
    summary: Object,
  },
  data: {
    startX: '',
    startY: '',
    _id: '',
    operateMap: {},
    toggleDetailMap: {}, // 控制各种类别是否展示
  },
  methods: {
    /**
     * 展开隐藏明细
     */
    toggleDetail: function (event) {
      let key = event.currentTarget.dataset.key;
      console.log('key', key);
      let toggleDetailMap = this.data.toggleDetailMap;
      toggleDetailMap[key] = !!!toggleDetailMap[key];
      console.log('toggleDetailMap', toggleDetailMap);
      this.setData({toggleDetailMap});
    },
    /**
     * 点击明细 查看或者删除
     * @param {event} event 点击明细操作
     */
    tapMoneyDetail: function (event) {
      let id = event.currentTarget.dataset.id
      let category = event.currentTarget.dataset.category
      let curItem = utils.get(this.data.dataObject[category], '_id', id);
      this.writebackData(curItem)
    },
    /**
     * 页面跳转
     * @param {Object} params 回写的数据
     */
    writebackData: function (params) {
      let {money, date, remark, _id} = params;
      let operCode = money > 0 ? 'positive' : 'negative';
      let option = utils.objectToQueryString({money, date, remark, _id, operCode});
      let url = '/pages/updateMoney/updateMoney?' + option
      wx.navigateTo({
        url: url
      });
    }
  },
  ready() {
    this.setData({
      operateMap: OPERATE
    })
  }
})