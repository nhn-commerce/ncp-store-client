import { createNcpApiStore } from '@/api'
import { getStrYMDHM } from '@/utils/dateUtils'
import { maskingMemberId } from '@/utils/StringUtils'
import Vue from 'vue'
import config from '@/config'

const defaultParams = {
  'productNo': null,
  'pageNumber': 1,
  'pageSize': 10,
  'isMyInquiries': false,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const defaultMemberParams = {
  'productNo': null,
  'pageNumber': 1,
  'pageSize': 10,
  'isMyInquiries': true,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const defaultMyInquiryParams = {
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_fetchProductInquiry',
    property: 'inquiryList',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.inquiryList = [...state.inquiryList || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_fetchMemberInquiry',
    property: 'memberInquiry',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.memberInquiry = [...state.memberInquiry || [], ...payload.data.items]
      state.memberTotalCount = payload.data.totalCount
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_postProductInquiry',
    path: 'products/{productNo}/inquiries',
    pathParams: ['productNo'],
    method: 'post'
  },
  {
    action: '_putProductInquiry',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'put'
  },
  {
    action: '_deleteProductInquiry',
    path: 'products/inquiries/{inquiryNo}',
    pathParams: ['inquiryNo'],
    method: 'delete'
  },
  {
    action: '_fetchProductInquiries',
    property: 'productInquiries',
    path: 'profile/product-inquiries',
    method: 'get',
    onSuccess (state, payload) {
      state.productInquiries = [...state.productInquiries || [], ...payload.data.items]
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
    fetchMemberListParams: {},
    totalCount: null,
    memberTotalCount: null,
    loading: true,
    memberLoading: true
  },
  actions: {
    async fetchProductInquiry ({ state, dispatch, commit, rootState }, productNo) {
      commit('RESET_LIST')
      commit('SET_PARAMS', {
        'productNo': productNo
      })
      await dispatch('_fetchProductInquiry', { params: state.fetchListParams })
      await commit('FORMAT_INQUIRY_DATAS', state.inquiryList)
    },
    async fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchProductInquiry', { params: state.fetchListParams })
      if (state.inquiryList.length >= state.totalCount) {
        state.loading = false
      }
      await commit('FORMAT_INQUIRY_DATAS', state.inquiryList)
    },

    async fetchMemberInquiry ({ state, dispatch, commit, rootState }, productNo) {
      commit('RESET_MEMBER_LIST')
      commit('SET_MEMBER_PARAMS', {
        'productNo': productNo
      })
      await dispatch('_fetchMemberInquiry', { params: state.fetchMemberListParams })
      await commit('FORMAT_INQUIRY_DATAS', state.memberInquiry)
    },
    async fetchMemberMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_MEMBER_PARAMS', {
        pageNumber: state.fetchMemberListParams.pageNumber + 1
      })
      await dispatch('_fetchMemberInquiry', { params: state.fetchMemberListParams })
      if (state.memberInquiry.length >= state.memberTotalCount) {
        state.memberLoading = false
      }
      await commit('FORMAT_INQUIRY_DATAS', state.memberInquiry)
    },

    async postProductInquiry ({ state, dispatch, commit }, inquiry) {
      await dispatch('_postProductInquiry', { data: inquiry, params: { productNo: inquiry.productNo } })
      await dispatch('fetchProductInquiry', inquiry.productNo)
      await dispatch('fetchMemberInquiry', inquiry.productNo)
    },
    async putProductInquiry ({ state, dispatch, commit, rootState }, updateparams) {
      await dispatch('_putProductInquiry', { data: updateparams, params: { inquiryNo: updateparams.inquiryNo } })
      await dispatch('fetchProductInquiry', updateparams.productNo)
      await dispatch('fetchMemberInquiry', updateparams.productNo)
    },
    async deleteProductInquiry ({ state, dispatch, commit, rootState }, deleteparams) {
      await dispatch('_deleteProductInquiry', { data: deleteparams, params: { inquiryNo: deleteparams.inquiryNo } })
      await dispatch('fetchProductInquiry', deleteparams.productNo)
      await dispatch('fetchMemberInquiry', deleteparams.productNo)
    },

    async fetchProductInquiries ({ state, dispatch, commit, rootState }) {
      commit('MY_INQUIRY_RESET_LIST')
      commit('MY_INQUIRY_SET_PARAMS')
      await dispatch('_fetchProductInquiries', { params: state.fetchListParams })
      await commit('FORMAT_INQUIRY_DATAS', state.productInquiries)
    },
    async fetchProductInquiriesMore ({ state, dispatch, commit, rootState }, payload) {
      commit('MY_INQUIRY_SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_fetchProductInquiries', { params: state.fetchListParams })
      if (state.productInquiries.length >= state.totalCount) {
        state.loading = false
      }
      await commit('FORMAT_INQUIRY_DATAS', state.productInquiries)
    },
    async putMyProductInquiry ({ state, dispatch, commit, rootState }, updateparams) {
      await dispatch('_putProductInquiry', { data: updateparams, params: { inquiryNo: updateparams.inquiryNo } })
      await dispatch('fetchProductInquiries')
    },
    async deleteMyProductInquiry ({ state, dispatch, commit, rootState }, deleteparams) {
      await dispatch('_deleteProductInquiry', { data: deleteparams, params: { inquiryNo: deleteparams.inquiryNo } })
      await dispatch('fetchProductInquiries')
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.inquiryList = null
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
    RESET_MEMBER_LIST (state) {
      state.memberInquiry = null
      state.memberTotalCount = null
      state.memberLoading = true
      state.fetchMemberListParams = defaultMemberParams
    },
    SET_MEMBER_PARAMS (state, params) {
      state.fetchMemberListParams = {
        ...state.fetchMemberListParams,
        ...params
      }
    },
    MY_INQUIRY_RESET_LIST (state) {
      state.productInquiries = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultMyInquiryParams
    },
    MY_INQUIRY_SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    FORMAT_INQUIRY_DATAS (state, inquirys) {
      if (!inquirys || inquirys.length === 0) {
        return
      }
      inquirys.forEach(item => {
        item.showDate = getStrYMDHM(item.registerYmdt, '.')
        Vue.set(item, 'showMemberId', maskingMemberId(item.memberId))
        if (item.answers) {
          item.answers.forEach(answer => {
            answer.showAnswersYmdt = getStrYMDHM(answer.updateYmdt, '.')
            answer.showRespondentName = (answer.partnerName && answer.partnerName !== '') ? answer.partnerName : config.mallName
          })
        }
      })
    }
  },
  mixins: [apiStore]
}
