Component({
  properties: {},
  data: {},
  methods: {
    goToUpdateMoney: function (event) {
      let option = event.currentTarget.dataset.option
      let url = '/pages/updateMoney/updateMoney?operCode=' + option
      wx.navigateTo({
        url: url
      });
    }
  },
  ready() {
    
  }
})