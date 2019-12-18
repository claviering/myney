Page({
  data: {
    option: {},
  },
  goBackHome: function () {
    wx.navigateBack();
  },
  onLoad: function(option) {
    this.setData({option});
  }
})