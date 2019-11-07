Component({
  properties: {},
  data: {},
  methods: {
    goToUpdateMoney: function (event) {
      let option = event.currentTarget.dataset.option
      console.log('option', option)
      let url = '/pages/updateMoney/updateMoney?option=' + option
      console.log('url', url)
      wx.navigateTo({
        url: url
      });
    }
  },
  ready() {
    
  }
})