const app = getApp()
const i18nFileName = app.globalData.i18n
const I18N = require(`./../i18n/${i18nFileName}`)
const CONSTANT = {}

module.exports = {
  ...CONSTANT,
  ...I18N,
}