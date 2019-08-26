
import { addClass, removeClass } from '@/utils/utils'

export default {
  namespaced: true,
  state: {
    showSearchLayer: false,
    showAsideView: false,
    showFilterView: false,
    currCursorIndex: -1
  },
  mutations: {
    show_search_layer (state, index) {
      if (index === undefined) {
        state.currCursorIndex = -1
      } else {
        state.currCursorIndex = index
      }
      state.showSearchLayer = true
      addClass(document.body, 'no_scroll')
    },
    hide_search_layer (state) {
      state.showSearchLayer = false
      state.showFilterView = false
      state.showAsideView = false
      removeClass(document.body, 'no_scroll')
    },
    hide_filter_view (state) {
      state.showFilterView = false
    },
    toggle_filter_view (state) {
      state.showFilterView = !state.showFilterView
    },
    show_aside_view (state) {
      state.showAsideView = true
    },
    hide_aside_view (state) {
      state.showAsideView = false
    }
  }
}
