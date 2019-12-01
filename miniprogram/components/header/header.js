Component({
  options: {
    addGlobalClass: true,
  },
  properties: {},
  data: {
    isOpenLeftMenu: false,
    isOpenRightMenu: false,
  },
  methods: {
    openLeftMenu: function () {
      this.setData({
        isOpenLeftMenu: !this.data.isOpenLeftMenu
      })
      this.triggerEvent('toggleLeftMenu')
    },
    openRightMenu: function () {
      this.setData({
        isOpenRightMenu: !this.data.isOpenRightMenu
      })
      this.triggerEvent('toggleRightMenu')
    },
  },
  ready() {
    
  }
})