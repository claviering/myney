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
  // 分类 TODO: 用户自定义
  EXPEND_CATEGORY_LIST: [
    {
      key: 'Book',
      value: 'Book'
    },
    {
      key: 'Clothes',
      value: 'Clothes'
    },
    {
      key: 'Communications',
      value: 'Communications'
    },
    {
      key: 'Entertainment',
      value: 'Entertainment'
    },
    {
      key: 'Financial',
      value: 'Financial'
    },
    {
      key: 'Food',
      value: 'Food'
    },
    {
      key: 'Game',
      value: 'Game'
    },
    {
      key: 'Gifts',
      value: 'Gifts'
    },
    {
      key: 'Home',
      value: 'Home'
    },
    {
      key: 'Sports',
      value: 'Sports'
    },
    {
      key: 'Transport',
      value: 'Transport'
    },
  ],
  INCOME_CATEGORY_LIST: [
    {
      key: 'Wage',
      value: 'Wage'
    },
    {
      key: 'Game',
      value: 'Game'
    },
  ],
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
      key: 'download',
      value: 'Download'
    },
    {
      key: 'upload',
      value: 'Upload'
    },
  ],
  OPERATE: {
    delete: 'Delete',
    edit: 'Edit',
  },
}

module.exports = LanguageMap