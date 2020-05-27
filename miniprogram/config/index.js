const isDev = false;

module.exports = {
  env: isDev ? 's-c7930' : 'prod-eeurh',
  collection: 'money', // 数据库表
  modelList: ['iPhone X', 'iPhone 11', 'iPhone 12'], // iPhone 底部黑条适配
}