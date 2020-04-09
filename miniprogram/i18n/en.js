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
      value: 'Book',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/book.svg',
    },
    {
      key: 'Clothes',
      value: 'Clothes',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/clothes.svg',
    },
    {
      key: 'Communications',
      value: 'Communications',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/phone.svg',
    },
    {
      key: 'Entertainment',
      value: 'Entertainment',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/movie.svg',
    },
    {
      key: 'Financial',
      value: 'Financial',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/financial.svg',
    },
    {
      key: 'Food',
      value: 'Food',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/food.svg',
    },
    {
      key: 'Game',
      value: 'Game',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/game.svg',
    },
    {
      key: 'Gifts',
      value: 'Gifts',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/gifts.svg',
    },
    {
      key: 'Home',
      value: 'Home',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/home.svg',
    },
    {
      key: 'Sports',
      value: 'Sports',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/Sports.svg',
    },
    {
      key: 'Transport',
      value: 'Transport',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/Transport.svg',
    },
    {
      key: 'Cosmetic',
      value: 'Cosmetic',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/cosmetic.svg',
    },
  ],
  INCOME_CATEGORY_LIST: [
    {
      key: 'Wage',
      value: 'Wage',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/wage.svg',
    },
    {
      key: 'Game',
      value: 'Game',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/game.svg',
    },
    {
      key: 'Living expenses',
      value: 'Living expenses',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/home.svg',

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
      key: 'count',
      value: 'Count'
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
}

module.exports = LanguageMap