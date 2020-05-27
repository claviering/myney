import * as echarts from '../../components/ec-canvas/echarts';
const app = getApp();

function setOption(chart, data) {
  var option = {
    backgroundColor: "#ffffff",
    color: ["#60acfc", "#32d3eb", "#5bc49f", "#feb64d", "#ff7c7c", "#9287e7"],
    series: [{
      label: {
        show: true,
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['25%', '40%'],
      data: data,
    }]
  };
  chart.setOption(option);
}

Page({
  data: {
    dataList: [],
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
  },
  onLoad: function(option) {
    let dataList = [];
    let unUseKey = ['balance', 'totalExpenditure', 'totalIncome'];
    let languageMap = app.getlanguageMap();
    for (const [key, value] of Object.entries(option)) {
      if (!unUseKey.includes(key) && value < 0) {
        let val = Math.abs(value) / Math.abs(option.totalExpenditure) * 100;
        val = Number.parseInt(val);
        dataList.push({
          value: val,
          name: languageMap[key] + '\n' + val + '%'
        })
      }
    }
    this.setData({dataList})
  },
  onReady() {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-pie');
    this.init();
  },
  /**
   * 点击按钮后初始化图表
   * @param {Array} data 渲染数据
   */
  init: function () {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      setOption(chart, this.data.dataList);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
});
