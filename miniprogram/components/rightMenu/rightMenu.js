const {
  OPER_LIST,
} = require('./../../constant/index.js');

Component({
  options: {
  },
  properties: {},
  data: {
    operList: OPER_LIST
  },
  methods: {
    selectOper: function (event) {
      let operKey = event.target.dataset.key
      console.log('operKey', operKey);
    }
  },
  ready() {
  },
  attached() {
  },
})