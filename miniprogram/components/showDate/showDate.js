const CONSTANT = require('./../../constant/index.js');

Component({
  properties: {},
  data: {

  },
  methods: {
    showTime: function (params) {
      let date = new Date()
      let week = data.getDay();
      let month = data.getMonth();
      let day = date.getDate();

    }
  },
  created() {
    console.log('created CONSTANT', CONSTANT);
  }
})