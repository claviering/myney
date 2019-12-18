const utils = require('../../utils/index');

Component({
  properties: {
    timeTo: String
  },
  data: {},
  methods: {
    goToUpdateMoney: function (event) {
      let operCode = event.currentTarget.dataset.oper;
      let date = this.properties.timeTo;
      let option = utils.objectToQueryString({date, operCode});
      let url = '/pages/updateMoney/updateMoney?' + option;
      wx.navigateTo({
        url: url
      });
    }
  },
})