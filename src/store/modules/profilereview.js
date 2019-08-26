import { createNcpApiStore } from '@/api'
import { getshowOptions } from '@/utils/StringUtils'
import { getStrDate, addMonth, getToday } from '@/utils/dateUtils'
import Vue from 'vue'
const defaultReviewableParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}

const defaultReviewsParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductReviewable',
    property: 'productReviewable',
    path: 'profile/order-options/product-reviewable',
    method: 'get',
    onSuccess (state, payload) {
      state.productReviewable = [...state.productReviewable || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchProfileProductReviews',
    property: 'profileProductReviews',
    path: 'profile/product-reviews',
    method: 'get',
    onSuccess (state, payload) {
      state.profileProductReviews = [...state.profileProductReviews || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postProductReviews',
    path: 'products/{productNo}/product-reviews',
    pathParams: ['productNo'],
    method: 'post'
  },
  {
    action: '_putProductReviews',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'put'
  },
  {
    action: '_deleteProductReviews',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'delete'
  },
  {
    action: '_fetchProductReviewDetail',
    property: 'productReviewDetail',
    path: 'products/{productNo}/product-reviews/{reviewNo}',
    pathParams: ['productNo', 'reviewNo'],
    method: 'get'
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalCount: null,
    reviewsLoading: true,
    reviewableLoading: true
  },
  mixins: [apiStore],
  actions: {
    async fetchProductReviewable ({ state, dispatch, commit }, params) {
      commit('REVIEWABLE_RESET_LIST')
      commit('REVIEWABLE_SET_PARAMS')
      await dispatch('_fetchProductReviewable', { params: state.fetchListParams })
      commit('PRODUCT_REVIEWABLE')
    },
    postProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_postProductReviews', { data: paramsReview, params: { productNo: paramsReview.productNo } })
    },
    async fetchProfileProductReviews ({ state, dispatch, commit }, params) {
      commit('REVIEWS_RESET_LIST')
      commit('REVIEWS_SET_PARAMS', {
        startYmd: addMonth(new Date(), -6),
        endYmd: getToday()
      })
      await dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
      commit('PROFILE_PRODUCT_REVIEWS')
    },
    putProductReviews ({ state, dispatch, commit }, paramsReview) {
      return dispatch('_putProductReviews', { data: paramsReview, params: { reviewNo: paramsReview.reviewNo, productNo: paramsReview.productNo } })
    },
    async deleteProductReviews ({ state, dispatch, commit }, paramsReview) {
      await dispatch('_deleteProductReviews', { params: { reviewNo: paramsReview.reviewNo, productNo: paramsReview.productNo } })
      await dispatch('fetchProfileProductReviews', state.fetchListParams)
    },
    async fetchReviewableMore ({ state, dispatch, commit, rootState }, payload) {
      commit('REVIEWABLE_SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_fetchProductReviewable', { params: state.fetchListParams })
      if (state.productReviewable.length >= state.totalCount) {
        state.reviewableLoading = false
      }
      commit('PRODUCT_REVIEWABLE')
    },
    async fetchReviewsMore ({ state, dispatch, commit, rootState }, payload) {
      commit('REVIEWS_SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_fetchProfileProductReviews', { params: state.fetchListParams })
      if (state.profileProductReviews.length >= state.totalCount) {
        state.reviewsLoading = false
      }
      commit('PROFILE_PRODUCT_REVIEWS')
    },
    fetchProductReviewDetail ({ state, commit, dispatch }, { editParams }) {
      dispatch('_fetchProductReviewDetail', { params: { reviewNo: editParams.reviewNo, productNo: editParams.productNo } })
    }

  },
  getters: {
  },
  mutations: {
    REVIEWABLE_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    REVIEWABLE_RESET_LIST (state) {
      state.productReviewable = null
      state.totalCount = 0
      state.reviewableLoading = true
      state.fetchListParams = defaultReviewableParams
    },
    REVIEWS_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    REVIEWS_RESET_LIST (state) {
      state.profileProductReviews = null
      state.totalCount = 0
      state.reviewsLoading = true
      state.fetchListParams = defaultReviewsParams
    },
    PRODUCT_REVIEWABLE (state) {
      if (state.productReviewable) {
        state.productReviewable.forEach(item => {
          const showOptions = getshowOptions(item.optionUsed, item.optionType, item.optionName, item.optionValue, item.inputs, item.price.addPrice, item.orderCnt)
          Vue.set(item, 'showOptions', showOptions)
        })
      }
    },
    PROFILE_PRODUCT_REVIEWS (state) {
      if (state.profileProductReviews) {
        state.profileProductReviews.forEach(item => {
          if (item.registerYmdt) {
            Vue.set(item, 'showRegisterYmdt', getStrDate(item.registerYmdt, '.'))
          }
          const option = item.orderedOption
          const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.addPrice, option.orderCnt)
          Vue.set(item, 'showOptions', showOptions)
        })
      }
    }
  }
}
