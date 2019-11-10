Component({
  options: {
    addGlobalClass: true,
  },
  properties: {},
  data: {
    isOpenMenu: false,
  },
  methods: {
    openMenu: function () {
      this.setData({
        isOpenMenu: !this.data.isOpenMenu
      })
      this.triggerEvent('toggleLeftMenu')
    }
  },
  ready() {
    
  }
})