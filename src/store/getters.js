import { isMobileTerminal } from '@/utils/flexible'

export default {
  currentCategory: (state) => state.app.currentCategory,
  searchText: (state) => state.app.searchText,
  currentCategoryIndex: (state, getters) => {
    return getters.categorys.findIndex((item) => item.id === getters.currentCategory.id)
  },

  categorys: (state) => state.category.categorys,
  historys: (state) => state.search.historys,

  userInfo: (state) => state.user.userInfo,
  token: (state) => state.user.token,

  themeType: (state) => state.theme.themeType,

  // 路由跳转方式
  routerType: (state) => {
    // 在 PC 端下，永远为 none
    if (!isMobileTerminal.value) {
      return 'none'
    }
    return state.app.routerType
  }
}
