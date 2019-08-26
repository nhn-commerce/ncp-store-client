import { createNcpApiStore } from '@/api'
import { getDateFormatYMDHM } from '@/utils/dateUtils'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchLikeProducts',
    property: 'likeProducts',
    path: 'profile/like-products',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      payload.data.items.forEach(element => {
        element.saleStartYmdt = getDateFormatYMDHM(element.saleStartYmdt)
      })
      state.likeProducts = [...state.likeProducts || [], ...payload.data.items]
      state.likeProducts.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postLikeProducts',
    property: 'result',
    path: 'profile/like-products',
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    // totalCount: null,
    loading: true
  },
  mixins: [apiStore],
  actions: {
    async fetchLikeProducts ({ state, dispatch, commit, rootGetters }) {
      if (!rootGetters.isLogined) {
        return
      }
      commit('RESET_LIST')
      commit('SET_PARAMS')
      await dispatch('_fetchLikeProducts', { params: state.fetchListParams })
    },
    async postLikeProducts ({ state, dispatch, commit, rootGetters }, productNos) {
      if (!rootGetters.isLogined) {
        return
      }
      await dispatch('_postLikeProducts', { data: { productNos } })
    },
    async pageLikeProducts ({ state, dispatch, commit, rootGetters }, productNos) {
      if (!rootGetters.isLogined) {
        return
      }
      await dispatch('_postLikeProducts', { data: { productNos } })
      commit('RESET_LIST')
      commit('SET_PARAMS')
      await dispatch('_fetchLikeProducts', { params: state.fetchListParams })
    },
    getLikeProductsMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      return dispatch('_fetchLikeProducts', { params: state.fetchListParams }).then(() => {
        if (state.likeProducts.length >= state.likeProducts.totalCount) {
          state.loading = false
        }
      })
    }
  },
  getters: {
    likeProductNos (state) {
      if (state.likeProducts && state.likeProducts.items) {
        return state.likeProducts.items.map((item) => item.productNo)
      }
      return []
    },
    getLikeProducts (state) {
      if (state.likeProducts) {
        // let likeArr = state.likeProducts
        state.likeProducts.forEach(product => {
          const tempSticker = []
          if (product.stickerLabels) {
            if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
              tempSticker.push('기부천사')
            }
            if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
              tempSticker.push('쿠폰')
            }
            if (product.deliveryConditionType === 'FREE') {
              tempSticker.push('무료배송')
            }
          } else {
            if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
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
          product.newStickers = tempSticker
        })
        return state.likeProducts
      }
    }
  },
  mutations: {
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    RESET_LIST (state) {
      state.likeProducts = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    }
  }
}
