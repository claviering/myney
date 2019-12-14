const timer = require('./../../utils/time.js');
const app = getApp()

Page({
  data: {
    showLeftMenu: false,
    showRightMenu: false,
    dataObject: {},
    timeType: '',
    curTimeText: '',
  },
  toggleLeftMenu: function () {
    this.setData({
      showLeftMenu: !this.data.showLeftMenu
    })
  },
  closeRightMenu: function () {
    this.toggleRightMenu();
  },
  toggleRightMenu: function () {
    // TODO: 导入导出未开发完成
    // return;
    this.setData({
      showRightMenu: !this.data.showRightMenu
    })
  },
  onLoad: function() {
    this.get()
  },
  setCurTimeText: function (from, to, timeType) {
    if (!from || !to) return;
    let curTimeText = '';
    if (timeType === 'day') {
      curTimeText = from.split(' ')[0];
    } else {
      curTimeText = from.split(' ')[0] + ' - ' + to.split(' ')[0];
    }
    this.setData({
      curTimeText: curTimeText
    })
  },
  get: async function (from, to, timeType = 'day') {
    let params = {
      timeType,
      from: timer.formatDate(from) + ' 00:00:00',
      to: timer.formatDate(to) + ' 23:59:59'
    }
    let res = await wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'get',
        params
      }
    })
    this.setCurTimeText(params.from, params.to, params.timeType);
    if (res && res.result && res.result.data) {
      this.setData({
        dataObject: res.result.data,
        summary: res.result.summary,
      })
    }
  },
  selectTime: function (myEventDetail) {
    this.toggleLeftMenu();
    this.selectComponent('#header').closeMenuIcon('LEFT');
    let timeType = myEventDetail.detail;
    // 相同时间范围直接返回
    if (timeType === this.data.timeType) return;
    let timeMap = {
      day: [new Date, new Date],
      week: timer.getWeekTime(),
      month: timer.getMonthTime(),
      year: timer.getYearTime(),
    }
    let [from, to] = timeMap[timeType]
    this.get(from, to, timeType)
    this.setData({
      timeType
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
