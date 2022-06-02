const LanguageMap = {
  MONTH: {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  },
  WEEK: {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  },
  TIME_RANGE: [
    {
      key: 'day',
      value: 'Day'
    },
    {
      key: 'week',
      value: 'Week'
    },
    {
      key: 'month',
      value: 'Month'
    },
    {
      key: 'year',
      value: 'Year'
    },
  ],
  OPER_LIST: [
    {
      key: 'zh_CN',
      value: '中文'
    },
    {
      key: 'en',
      value: 'English'
    },
    // {
    //   key: 'download',
    //   value: 'Download'
    // },
    // {
    //   key: 'upload',
    //   value: 'Upload'
    // },
  ],
  OPERATE: {
    delete: 'Delete',
    edit: 'Edit',
  },
  // 提示语言
  SHOW_TOAST_TEXT: {
    CHANGE_LANG: 'success, reload me'
  },
  COMMON_TEXT: {
    setMoneyPlaceholder: 'input money',
    setRemarkPlaceholder: 'input remark',
  },
}

module.exports = LanguageMap