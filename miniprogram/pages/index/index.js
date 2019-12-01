const timer = require('./../../utils/time.js');
const app = getApp()

Page({
  data: {
    showLeftMenu: false,
    showRightMenu: false,
    dataObject: {},
    timeType: ''
  },
  toggleLeftMenu: function () {
    this.setData({
      showLeftMenu: !this.data.showLeftMenu
    })
  },
  toggleRightMenu: function () {
    this.setData({
      showRightMenu: !this.data.showRightMenu
    })
  },
  onLoad: function() {
    this.get()
  },
  get: async function (from, to, timeType) {
    let res = await wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'get',
        params: {
          timeType,
          from: timer.formatDate(from) + ' 00:00:00',
          to: timer.formatDate(to) + ' 23:59:59'
        }
      }
    })
    if (res && res.result && res.result.data) {
      this.setData({
        dataObject: res.result.data
      })
    }
  },
  selectTime: function (myEventDetail) {
    this.toggleLeftMenu()
    let timeType = myEventDetail.detail
    // 相同时间范围直接返回
    if (timeType === this.data.timeType) return
    let timeMap = {
      day: [new Date, new Date],
      week: timer.getWeekTime(),
      month: timer.getMonthTime(),
      year: timer.getYearTime(),
    }
    let [from, to] = timeMap[timeType]
    this.get(from, to, timeType)
    this.setData({timeType})
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
