module.exports = {
  /**
   * YYYY-MM-DD 转 YYYY-MM-DD HH:mm:ss
   * @param {String} date 日期 YYYY-MM-DD
   */
  timer: function (date) {
    return this.formatDate(date) + ' ' + this.formatTime(date)
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
    return [year, month, day].join('-')
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
  }
}