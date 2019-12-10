Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    closeHeadMenuType: String
  },
  data: {
    isOpenLeftMenu: false,
    isOpenRightMenu: false,
  },
  methods: {
    closeMenuIcon: function (params) {
      if (params === 'LEFT') {
        this.setData({
          isOpenLeftMenu: false
        })
      } else if (params === 'RIGHT') {
        this.setData({
          isOpenRightMenu: false
        })
      }
    },
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
})