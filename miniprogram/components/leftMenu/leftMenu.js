const {
  TIME_RANGE,
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    timeRange: TIME_RANGE
  },
  methods: {
    selectTime: function (event) {
      let timeKey = event.target.dataset.key
      console.log('timeKey', timeKey);
      this.data.timeRange.forEach(item => {
        item.active = item.key ===  timeKey;
      })
      this.setData({
        timeRange: this.data.timeRange
      })
      this.triggerEvent('selectTime', timeKey)
    }
  },
  ready() {
  },
  attached() {
    TIME_RANGE[0].active = true
    let timeRange = TIME_RANGE
    this.setData({
      timeRange
    })
    console.log('this.data', this.data);
  },
})