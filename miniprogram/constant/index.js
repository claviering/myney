const utils = require('./../utils/index')
const i18nFileName = utils.getI18nSync()
console.log('i18nFileName', i18nFileName);
const I18N = require(`./../i18n/${i18nFileName}`)
console.log('I18N', I18N);
const CONSTANT = {}

module.exports = {
  ...CONSTANT,
  ...I18N,
}