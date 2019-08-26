import { createNcpApiStore } from '@/api'
import { getStrYMDHM } from '@/utils/dateUtils'
import Vue from 'vue'
import config from '@/config'

const defaultParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_signInInquiries',
    property: 'profile',
    path: 'inquiries',
    method: 'post'
  },
  {
    action: '_fetchInquiries',
    property: 'inquiries',
    path: 'inquiries',
    method: 'get',
    onSuccess (state, payload) {
      state.inquiries = [...state.inquiries || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
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
    async signInInquiries ({ commit, dispatch, rootState }, iparam) {
      await dispatch('_signInInquiries', { data: iparam, params: {} })
    },
    async fetchInquiries ({ state, dispatch, commit, rootState }, productNo) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'productNo': productNo
      })
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
      commit('CS_QNA_INQUIRIES')
    },
    async fetchInquiriesMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchInquiries', { params: state.fetchListParams })
      if (state.inquiries.length >= state.totalCount) {
        state.loading = false
      }
      commit('CS_QNA_INQUIRIES')
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.inquiries = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    CS_QNA_INQUIRIES (state) {
      if (state.inquiries) {
        state.inquiries.forEach(item => {
          Vue.set(item, 'showDate', getStrYMDHM(item.registerYmdt, '.'))
          if (item.answer) {
            Vue.set(item.answer, 'showAnswersYmdt', getStrYMDHM(item.answer.answerRegisterYmdt, '.'))
            Vue.set(item.answer, 'showRespondentName', (item.answer.partnerName && item.answer.partnerName !== '') ? item.answer.partnerName : config.mallName)
          }
        })
      }
    }
  },
  getters: {
  }
}
