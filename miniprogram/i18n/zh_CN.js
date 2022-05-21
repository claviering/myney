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
      key: 'zh_CN',
      value: '中文'
    },
    {
      key: 'en',
      value: 'English'
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
  SHOW_TOAST_TEXT: {
    CHANGE_LANG: '切换成功, 需要重新打开'
  },
  COMMON_TEXT: {
    setMoneyPlaceholder: '金额',
    setRemarkPlaceholder: '备注',
  },
}

module.exports = LanguageMap