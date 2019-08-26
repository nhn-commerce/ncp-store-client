import { createNcpApiStore } from '@/api'
import Vue from 'vue'
import { loadNCPSearchScript } from '@/store'

/* global NCPSearch */
const defaultParams = {
  'filter.discountedPrices': null,
  'filter.discountedComparison': null,
  'filter.familyMalls': false,
  'order.by': null,
  'order.direction': null,
  'pageNumber': 1,
  'pageSize': 30,
  'hasTotalCount': true,
  'categoryNos': null,
  'brandNos': null
}

const apiStore = createNcpApiStore([
  {
    action: 'fetchList',
    property: 'list',
    path: 'products/search',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.list = [...state.list || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
      state.pageCount = payload.data.pageCount
      state.clickUrlPrefix = payload.data.clickUrlPrefix
      state.depth1Categories = payload.data.depth1Categories
      state.depth2Categories = payload.data.depth2Categories
    },
    cacheable: true,
    cacheMaxAge: 1000 * 30
  },
  {
    action: 'fetchBestList',
    property: 'bestList',
    path: 'products/search',
    method: 'get'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalCount: null,
    pageCount: 0,
    depth1Categories: null,
    depth2Categories: null
  },
  actions: {
    async fetchBestByCategory ({ state, dispatch, commit, rootState }, to) {
      await loadNCPSearchScript()
      let categoryNo = to.params.subCategoryNo || to.params.rootCategoryNo
      categoryNo = categoryNo || null
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'categoryNos': categoryNo,
        'pageSize': 30,
        'pageNumber': 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      if (to.name === 'MainBest') {
        const clickUrlPrefix = state.clickUrlPrefix
        if (clickUrlPrefix) {
          NCPSearch.setSearchInfo({ clickUrlPrefix })
        }
      }
      commit('SET_STICKER')
    },

    async fetchListByCategory ({ state, dispatch, commit, rootState }, to) {
      let categoryNo = to.params.subFoCategoryNo || to.params.subThCategoryNo || to.params.subCategoryNo || to.params.rootCategoryNo
      categoryNo = categoryNo || null
      await loadNCPSearchScript()
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': to.query.sortBy ? to.query.sortBy.split(':')[0] : 'POPULAR',
        'order.direction': to.query.sortBy ? to.query.sortBy.split(':')[1] : 'DESC',
        'categoryNos': categoryNo,
        'pageSize': 30,
        'pageNumber': 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      const clickUrlPrefix = state.clickUrlPrefix
      if (clickUrlPrefix) {
        NCPSearch.setSearchInfo({ clickUrlPrefix })
      }
      commit('SET_STICKER')
    },

    async fetchListByBrand ({ state, dispatch, commit, rootState }, { to }) {
      let brandNo = rootState.route.params.brandNo || to.params.brandNo
      let categoryNo = to.query.categoryNo
      categoryNo = categoryNo || null
      await loadNCPSearchScript()
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': to.query.sortBy ? to.query.sortBy.split(':')[0] : 'POPULAR',
        'order.direction': to.query.sortBy ? to.query.sortBy.split(':')[1] : 'DESC',
        'brandNos': brandNo,
        'categoryNos': categoryNo,
        'pageSize': 30,
        'pageNumber': 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      const clickUrlPrefix = state.clickUrlPrefix
      if (clickUrlPrefix) {
        NCPSearch.setSearchInfo({ clickUrlPrefix })
      }
      commit('SET_STICKER')
    },
    async search ({ state, dispatch, commit, rootState }, { to }) {
      let keyword = rootState.route.query.q || to.query.q || ''
      let categoryNo = to.query.categoryNo
      categoryNo = categoryNo || null
      if (state.list && keyword.trim() === '') {
        return
      }
      await loadNCPSearchScript()
      commit('CLEAR_LIST')
      commit('RESET_PARAMS')
      commit('SET_PARAMS', {
        'order.by': to.query.sortBy ? to.query.sortBy.split(':')[0] : 'POPULAR',
        'order.direction': to.query.sortBy ? to.query.sortBy.split(':')[1] : 'DESC',
        'filter.keywords': keyword,
        'categoryNos': categoryNo,
        'pageSize': 30,
        'pageNumber': 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      const clickUrlPrefix = state.clickUrlPrefix
      if (clickUrlPrefix) {
        NCPSearch.setSearchInfo({ clickUrlPrefix })
      }
      commit('SET_STICKER')
      if (state.totalCount === 0) {
        await dispatch('fetchBestBySearch')
      }
    },

    async fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('fetchList', { params: state.fetchListParams })
      commit('SET_STICKER')
    },

    async fetchMoreBest ({ state, dispatch, commit, rootState }, payload) {
      if (state.fetchListParams.pageNumber < 3) {
        commit('SET_PARAMS', {
          pageNumber: state.fetchListParams.pageNumber + 1
        })
      } else {
        commit('SET_PARAMS', {
          pageNumber: 10,
          pageSize: 10
        })
      }
      await dispatch('fetchList', { params: state.fetchListParams })
      commit('SET_STICKER')
    },

    async fetchBestBySearch ({ state, dispatch, commit, rootState }) {
      const params = {
        'order.by': 'POPULAR',
        'order.direction': 'DESC',
        'filter.familyMalls': false,
        'pageSize': 12,
        'pageNumber': 1
      }
      await loadNCPSearchScript()
      params.clientKey = NCPSearch.getClientKey()
      await dispatch('fetchBestList', { params })
      commit('SET_STICKER')
    }
  },
  mutations: {
    CLEAR_LIST (state) {
      state.list = null
      state.totalCount = null
    },
    RESET_PARAMS (state) {
      state.fetchListParams = defaultParams
      state.fetchListParams.clientKey = NCPSearch.getClientKey()
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    SET_STICKER (state) {
      if (state.list) {
        state.list.forEach(product => {
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
          Vue.set(product, 'newStickers', tempSticker)
        })
      }
    }
  },
  getters: {
    depthCategories (state, getters, rootState) {
      if (state.depth1Categories) {
        const checkCategory = state.fetchListParams.categoryNos
        const depthCategories = state.depth1Categories.filter(categorie => categorie.count > 0)
        if (depthCategories.length > 0 && state.depth2Categories && state.depth2Categories.length > 0) {
          depthCategories.forEach(depth1 => {
            Vue.set(depth1, 'checked', depth1.categoryNo === checkCategory)
            depth1.depth2Cates = []
            state.depth2Categories.forEach(depth2 => {
              if (depth2.categoryNo === Number(rootState.route.query.categoryNo) || depth2.categoryNo === checkCategory) {
                depth1.checked = true
                depth2.checked = true
              }
              if (depth2.count > 0 && depth1.categoryNo === depth2.parentCategoryNo) {
                depth1.depth2Cates.push(depth2)
              }
            })
            depth1.noDepth = depth1.depth2Cates.length === 0
          })
        }
        return depthCategories
      }
    }
  },
  mixins: [apiStore]
}
