module.exports = {
  /**
   * 时间转 YYYY-MM-DD HH:mm:ss
   * @param {String} date 日期 YYYY-MM-DD
   */
  time: function (date) {
    let curDate = this.formatDate(date)
    return curDate + ' ' + this.formatTime(date)
  },
  /**
   * 格式化日期为 YYYY-MM-DD
   * @param {Date} date 日期
   */
  formatDate: function (date) {
    let d = date ? new Date(date) : new Date()
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()
    if (month.length < 2)
      month = '0' + month
    if (day.length < 2)
      day = '0' + day
    return [year, month, day].join('/')
  },
  /**
   * 获取 HH:mm:ss
   */
  formatTime: function (date) {
    date = date ? new Date(date) : new Date();
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds();
    if (hours < 10)
        hours = '0' + hours;
    if (minutes < 10)
        minutes = '0' + minutes;
    if (seconds < 10)
        seconds = '0' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  },
  /**
   * 
   * @param {String} curDay 日期
   * @param {Number} number 当前日期的前或者后多少周
   * @return {Array} 周的开始日期(周日)和周的结束日期(周一)
   */
  getWeekTime: function (curDay, number = 0) {
    let curr = curDay ? new Date(curDay) : new Date;
    let weekStep = number * 7;
    let firstday = new Date(curr.setDate(curr.getDate() - curr.getDay() + weekStep));
    let lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 6));
    return [firstday, lastday]
  },
  /**
   * 
   * @param {String} curDay 日期
   * @param {Number} number 当前日期的前或者后多少个月
   * @return {Array} 月的开始日期和结束日期
   */
  getMonthTime: function (curDay, number = 0) {
    let curr = curDay ? new Date(curDay) : new Date;
    let firstday = new Date(curr.getFullYear(), curr.getMonth() + number, 1);
    let lastday = new Date(curr.getFullYear(), curr.getMonth() + 1 + number, 0);
    return [firstday, lastday]
  },
  /**
   * 
   * @param {String} curDay 日期
   * @param {Number} number 当前日期的前或者后多少个年
   * @return {Array} 年的开始日期和的结束日期
   */
  getYearTime: function (curDay, number = 0) {
    let curr = curDay ? new Date(curDay) : new Date;
    let firstday = new Date(curr.getFullYear() + number, 0, 1);
    let lastday = new Date(curr.getFullYear() + number, 11, 31);
    return [firstday, lastday]
  },
  /**
   * 当前日期的前多少天
   * @param {String|Date} curDay 日期
   * @param {Number} number 前多少天
   * @return {Date} 计算后的日期
   */
  beforeDays: function (curDay, number) {
    if (!curDay || !number) return curDay;
    curDay = new Date(curDay);
    curDay.setDate(curDay.getDate() + number);
    return curDay;
  }
}