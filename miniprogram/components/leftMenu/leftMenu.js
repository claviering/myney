const {
  TIME_RANGE,
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    timeRange: TIME_RANGE,
    timeKey: '',
  },
  methods: {
    selectTime: function (event) {
      let timeKey = event.target.dataset.key
      this.data.timeRange.forEach(item => {
        item.active = item.key ===  timeKey;
      })
      this.setData({
        timeRange: this.data.timeRange,
        timeKey
      })
      this.triggerEvent('selectTime', timeKey)
    }
  },
  ready() {
  },
  attached() {
    // 高亮第一个时间
    TIME_RANGE[0].active = this.data.timeKey ? false : true;
    let timeRange = TIME_RANGE
    this.setData({
      timeRange
    })
  },
})