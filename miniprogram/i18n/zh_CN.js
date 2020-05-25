const LanguageMap = {
  MONTH: {
    0: '一月',
    1: '二月',
    2: '三月',
    3: '四月',
    4: '五月',
    5: '六月',
    6: '七月',
    7: '八月',
    8: '九月',
    9: '十月',
    10: '十一月',
    11: '十二月',
  },
  WEEK: {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
  },
  // 分类 TODO: 用户自定义
  EXPEND_CATEGORY_LIST: [
    {
      key: '书',
      value: '书',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/book.svg',
    },
    {
      key: '衣服',
      value: '衣服',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/clothes.svg',
    },
    {
      key: '通信',
      value: '通信',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/phone.svg',
    },
    {
      key: '娱乐',
      value: '娱乐',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/movie.svg',
    },
    {
      key: '金融',
      value: '金融',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/financial.svg',
    },
    {
      key: '食物',
      value: '食物',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/food.svg',
    },
    {
      key: '游戏',
      value: '游戏',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/game.svg',
    },
    {
      key: '礼物',
      value: '礼物',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/gifts.svg',
    },
    {
      key: '家庭',
      value: '家庭',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/home.svg',
    },
    {
      key: '运动',
      value: '运动',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/Sports.svg',
    },
    {
      key: '交通',
      value: '交通',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/Transport.svg',
    },
    {
      key: '化妆品',
      value: '化妆品',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/cosmetic.svg',
    },
    {
      key: '医院',
      value: '医院',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/hospital.svg',
    },
  ],
  INCOME_CATEGORY_LIST: [
    {
      key: 'Wage',
      value: '工资',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/wage.svg',
    },
    {
      key: 'Game',
      value: '游戏',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/game.svg',
    },
    {
      key: 'Living expenses',
      value: '生活费',
      image: 'cloud://prod-eeurh.7072-prod-eeurh-1258641125/home.svg',

    },
  ],
  TIME_RANGE: [
    {
      key: 'day',
      value: '天'
    },
    {
      key: 'week',
      value: '周'
    },
    {
      key: 'month',
      value: '月'
    },
    {
      key: 'year',
      value: '年'
    },
  ],
  OPER_LIST: [
    {
      key: 'count',
      value: '统计'
    },
    // {
    //   key: 'download',
    //   value: '导出'
    // },
    // {
    //   key: 'upload',
    //   value: '导入'
    // },
  ],
  OPERATE: {
    delete: '删除',
    edit: '编辑',
  },
}

module.exports = LanguageMap