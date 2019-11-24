Page({
  data: {
    option: {},
  },
  goBackHome: function () {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },
  onLoad: function(option) {
    this.setData({option});
  }
})