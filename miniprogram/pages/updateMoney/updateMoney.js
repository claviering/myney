Page({
  data: {
    option: '',
  },
  goBackHome: function () {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },
  onLoad: function(option) {
    console.log('option', option)
    this.setData(option);
  }
})