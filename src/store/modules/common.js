import { createNcpApiStore } from '@/api'
import { getToday } from '@/utils/dateUtils'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true
}

const apiStore = createNcpApiStore([
  {
    action: '_uploadImages',
    property: 'uploadImagesData',
    path: 'files/images',
    method: 'post'
  },
  {
    action: '_mallsPartners',
    property: 'mallsPartners',
    path: 'malls/partners'
  },
  {
    action: '_malls',
    property: 'malls',
    path: 'malls'
  },
  {
    action: '_fetchAddresses',
    property: 'addresses',
    path: 'addresses/search',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.addresses = [...state.addresses || [], ...payload.data.items]
      state.addresses.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  }
])

export default {
  namespaced: true,
  state: {
    fetchListParams: {},
    totalCount: null,
    loading: true
  },
  mixins: [apiStore],
  actions: {
    uploadImages ({ state, dispatch, commit }, data) {
      return dispatch('_uploadImages', { data })
    },
    async fetchMalls ({ state, dispatch }) {
      let mallInfo = JSON.parse(window.localStorage.mallInfo || null)
      let expiredTime = JSON.parse(window.localStorage.expiredTime || null)
      if (mallInfo && expiredTime && expiredTime === getToday()) {
        state.malls = mallInfo
      } else {
        await dispatch('_malls')
        window.localStorage.mallInfo = JSON.stringify(state.malls)
        window.localStorage.expiredTime = JSON.stringify(getToday())
      }
      return state.malls
    },
    fetchMallsPartners ({ state, commit, dispatch }) {
      return dispatch('_mallsPartners')
    },
    fetchAddresses ({ state, dispatch, commit }, params) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'keyword': params.keyword
      })
      return dispatch('_fetchAddresses', { params: state.fetchListParams })
    },
    fetchAddressesMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: (state.fetchListParams.pageNumber + 1)
      })
      return dispatch('_fetchAddresses', { params: state.fetchListParams }).then(() => {
        if (state.addresses.length >= state.addresses.totalCount) {
          state.loading = false
        }
      })
    }
  },
  getters: {
    flatCategories (state) {
      if (state.malls) {
        const result = state.malls.categories.flatCategories
        result.forEach(item => {
          item.iconColor = 'color' // 색이 있는지 유무만 파악
        })
        return result
      }
    },
    productInquiryTypes (state) {
      if (state.malls) {
        return state.malls.productInquiryType
      }
      return null
    },
    productReviewReportTypes (state) {
      if (state.malls) {
        return state.malls.productReviewReportType.reverse()
      }
      return null
    },
    inquiryTypes (state) {
      if (state.malls) {
        return state.malls.inquiryType
      }
      return null
    },
    claimReasonTypes (state) {
      if (state.malls) {
        return state.malls.claimReasonType
      }
      return null
    },
    orderStatusTypes (state) {
      if (state.malls) {
        return state.malls.orderStatusType
      }
      return null
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
      state.addresses = null
      state.totalCount = 0
      state.loading = true
      state.fetchListParams = defaultParams
    }
  }
}
