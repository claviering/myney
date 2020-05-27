const timer = require('./../../utils/time.js');
const utils = require('./../../utils/index.js');
const app = getApp();

Page({
  data: {
    showLeftMenu: false,
    showRightMenu: false,
    dataObject: {},
    timeType: 'day',
    from: '',
    to: '',
    curTimeText: '',
    touchStartX: 0,
    touchStartY: 0,
    summary: {}, // 数据汇总
    hasFooter: false, // 是否有权限添加数据
  },
  toggleLeftMenu: function () {
    this.setData({
      showLeftMenu: !this.data.showLeftMenu
    })
  },
  /**
   * 
   * @param {String} url 关闭右边菜单然后跳转的 url
   */
  closeRightMenu: function (eventDetail) {
    this.toggleRightMenu();
    if (eventDetail && eventDetail.detail) {
      let option = utils.objectToQueryString(this.data.summary);
      let url = eventDetail.detail + '?' + option;
      wx.navigateTo({
        url: url
      });
    }
  },
  toggleRightMenu: function () {
    this.setData({
      showRightMenu: !this.data.showRightMenu
    })
  },
  onLoad: function() {
    this.getPower();
  },
  /**
   * 获取权限，显示操作
   */
  getPower: async function () {
    let res = await wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getPower',
      }
    });
    console.log('getPower res', res);
    this.setData({hasFooter: res.result.error ? false : res.result});
  },
  onShow: function() {
    let {from, to, timeType} = this.data;
    this.get(from, to, timeType);
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
    from = timer.formatDate(from);
    to = timer.formatDate(to);
    this.setData({
      timeType,
      from,
      to
    });
    let params = {
      timeType,
      from: from + ' 00:00:00',
      to: to + ' 23:59:59'
    };
    wx.showLoading({title: '加载中',});
    let res = await wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'get',
        params
      }
    });
    wx.hideLoading();
    this.setCurTimeText(params.from, params.to, params.timeType);
    if (res && res.result && res.result.data) {
      this.setData({
        dataObject: res.result.data,
        summary: res.result.summary,
        params,
      });
    }
  },
  selectTime: function (myEventDetail) {
    this.toggleLeftMenu();
    // 点击时间范围同时关闭菜单 Icon
    this.selectComponent('#header').closeMenuIcon('LEFT');
    let timeType = myEventDetail.detail;
    // 相同时间范围直接返回
    if (timeType === this.data.timeType) return;
    let timeMap = {
      day: [new Date, new Date],
      week: timer.getWeekTime(),
      month: timer.getMonthTime(),
      year: timer.getYearTime(),
    };
    let [from, to] = timeMap[timeType];
    this.get(from, to, timeType);
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
  touchStart: function (e) {
    this.setData({
      touchStartX: e.changedTouches[0] && e.changedTouches[0].clientX,
      touchStartY: e.changedTouches[0] && e.changedTouches[0].clientY
    });
  },
  touchEnd: function (e) {
    let x = e.changedTouches[0] && e.changedTouches[0].clientX;
    let y = e.changedTouches[0] && e.changedTouches[0].clientY;
    let startX = this.data.touchStartX;
    let startY = this.data.touchStartY;
    let direction = utils.getTouchData(x, y, startX, startY);
    this.changeTime(direction);
  },
  /**
   * 
   * @param {String} direction 左滑或者右滑
   */
  changeTime: function (direction) {
    let {timeType, from, to} = this.data.params;
    let calcStep = 0;
    if (direction === 'RIGHT') {
      calcStep = 1;
    } else if (direction === 'LEFT') {
      calcStep = -1;
    } else {
      return;
    }
    let timeMap = {
      day: [timer.beforeDays(from, calcStep), timer.beforeDays(from, calcStep)],
      week: timer.getWeekTime(from, calcStep),
      month: timer.getMonthTime(from, calcStep),
      year: timer.getYearTime(from, calcStep),
    };
    [from, to] = timeMap[timeType];
    this.get(from, to, timeType);
  },
})
