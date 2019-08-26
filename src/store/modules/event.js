import { createNcpApiStore } from '@/api'
import Vue from 'vue'

const apiStore = createNcpApiStore([
  {
    action: 'fetch',
    property: 'event',
    path: 'display/events/{eventNo}?saleStatus=ONSALE&order=ADMIN_SETTING',
    pathParams: ['eventNo']
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async fetchEventDetail ({ state, commit, dispatch }, eventNo) {
      await dispatch('fetch', { params: { eventNo } })
      await commit('FORMAT_DATAS')
    }
  },
  mutations: {
    FORMAT_DATAS (state) {
      if (state.event) {
        const slickMenu = []
        let tempPage = []
        if (state.event.section && state.event.section.length > 0) {
          state.event.section.forEach((item, index) => {
            const slickItem = {}
            slickItem.label = item.label
            slickItem.to = '#section' + index
            if (item.products && item.products.length > 0) {
              tempPage.push(slickItem)
            }
            if (tempPage.length === 6) {
              tempPage.index = slickMenu.length
              slickMenu.push(tempPage)
              tempPage = []
            }

            if (item.products && item.products.length > 0) {
              item.products.forEach(product => {
                const tempSticker = []
                if (product.stickerLabels) {
                  if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
                    tempSticker.push('기부천사')
                  }
                  if (product.hasCoupons.event) {
                    tempSticker.push('쿠폰')
                  }
                  if (product.deliveryConditionType === 'FREE') {
                    tempSticker.push('무료배송')
                  }
                } else {
                  if (product.hasCoupons.event) {
                    tempSticker.push('쿠폰')
                  }
                  if (product.deliveryConditionType === 'FREE') {
                    tempSticker.push('무료배송')
                  }
                }
                if (tempSticker.length === 4) {
                  tempSticker.pop()
                  tempSticker.pop()
                }
                if (tempSticker.length === 3) {
                  tempSticker.pop()
                }
                Vue.set(product, 'newStickers', tempSticker)
              })
            }
          })
          if (tempPage.length > 0) {
            tempPage.index = slickMenu.length
            slickMenu.push(tempPage)
          }
          Vue.set(state.event, 'slickMenu', slickMenu)
        }
      }
    },
    CLEAR_EVENT (state) {
      state.event = null
    }
  }
}
