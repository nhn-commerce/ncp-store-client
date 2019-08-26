import { createNcpApiStore } from '@/api'
// import { clearRepeatNum } from '@/utils/StringUtils'
const defaultParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}
const apiStore = createNcpApiStore([
  {
    action: '_getValidCoupons',
    property: 'getValidCoupons',
    path: 'coupons',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.getValidCoupons = [...state.getValidCoupons || [], ...payload.data.items]
      state.getValidCoupons.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_registCoupon',
    property: 'registCoupon',
    path: 'coupons/register-code/{promotionCode}',
    pathParams: ['promotionCode'],
    method: 'post'
  },
  {
    action: '_getNoValidCoupons',
    property: 'getNoValidCoupons',
    path: 'coupons',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.getNoValidCoupons = [...state.getNoValidCoupons || [], ...payload.data.items]
      state.getNoValidCoupons.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    fetchListParams: {},
    // totalCount: null,
    loading: true,
    noListParams: {},
    // totalCount: null,
    noLoading: true
  },
  actions: {
    getValidCoupons ({ state, commit, dispatch, rootGetters }) {
      commit('RESET_LIST')
      commit('SET_PARAMS')
      state.fetchListParams.usable = true
      return dispatch('_getValidCoupons', { params: state.fetchListParams })
    },
    async moreCoupons ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      await dispatch('_getValidCoupons', { params: state.fetchListParams }).then(() => {
        if (state.getValidCoupons.length >= state.getValidCoupons.totalCount) {
          state.loading = false
        }
      })
    },
    registCoupon ({ state, dispatch, commit, rootState }, promotionCode) {
      return dispatch('_registCoupon', { data: { nodata: '' }, params: { promotionCode } })
    },
    async getNoValidCoupons ({ state, commit, dispatch, rootGetters }) {
      commit('RESET_NOLIST')
      commit('SET_NOPARAMS')
      state.noListParams.usable = false
      await dispatch('_getNoValidCoupons', { params: state.noListParams })
    },
    async moreNoCoupons ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_NOPARAMS', {
        pageNumber: (state.noListParams.pageNumber + 1)
      })
      await dispatch('_getNoValidCoupons', { params: state.noListParams }).then(() => {
        if (state.getNoValidCoupons.length >= state.getNoValidCoupons.totalCount) {
          state.noLoading = false
        }
      })
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
      state.getValidCoupons = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_NOPARAMS (state, params) {
      state.noListParams = {
        ...state.noListParams,
        ...params
      }
    },
    RESET_NOLIST (state) {
      state.getNoValidCoupons = null
      state.totalCount = 0
      state.noLoading = true
      state.noListParams = defaultParams
    }
  }
}
