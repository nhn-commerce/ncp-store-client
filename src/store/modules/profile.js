import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'
import {getStrYMDHMSS, getStrDate} from '@/utils/dateUtils'

const apiStore = createNcpApiStore([
  {
    action: '_signUp',
    property: 'profile',
    path: 'profile',
    method: 'post'
  },
  {
    action: '_fetch',
    property: 'profile',
    path: 'profile',
    method: 'get'
  },
  {
    action: '_signUpOpenid',
    property: 'profile',
    path: 'profile/openid',
    method: 'post'
  },
  {
    action: '_delProfile',
    property: 'delResult',
    path: 'profile',
    method: 'delete'
  },
  {
    action: '_syncProfile',
    property: 'sync',
    path: 'profile/payco/sync',
    method: 'put'
  },
  {
    action: '_updateProfile',
    property: 'profile',
    path: 'profile',
    method: 'put'
  },
  {
    action: '_paycoSync',
    property: 'profile',
    path: 'profile/payco/sync',
    method: 'put'
  },
  {
    action: '_fetchAccumulations',
    property: 'accumulations',
    path: 'profile/accumulations',
    method: 'get'
  },
  {
    action: '_fetchAccumulationsSummary',
    property: 'accumulationsSummary',
    path: 'profile/accumulations/summary',
    method: 'get'
  },
  {
    action: '_fetchAccumulationsSummary30',
    property: 'accumulationsSummary30',
    path: 'profile/accumulations/summary',
    method: 'get'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async signUp ({ commit, dispatch, rootState }, payload) {
      await dispatch('_signUp', payload)
      location.href = '/SignIn'
    },
    async fetchAccumulations ({ commit, dispatch, rootState }, prams) {
      await dispatch('_fetchAccumulations', { params: prams }).then(ret => {
        if (ret) {
          if (ret.data.items.length > 0) {
            ret.data.items.forEach(item => {
              item.registerYmdt = getStrDate(item.registerYmdt, '.')
            })
          }
        }
      })
    },
    async fetchAccumulationsSummary ({ commit, dispatch, rootState }) {
      await dispatch('_fetchAccumulationsSummary')
    },
    async fetchAccumulationsSummary30 ({ commit, dispatch, rootState }) {
      let current = new Date()
      let date = getStrYMDHMSS(current)
      let oneDay = 1000 * 24 * 60 * 60
      let date30 = getStrYMDHMSS(new Date(current.getTime() + oneDay * 30))
      await dispatch('_fetchAccumulationsSummary30', { params: {expireStartYmdt: date, expireEndYmdt: date30} })
    },
    async memberStatusChange ({ commit, dispatch, state, rootState }, shopAdChecked) {
      if (rootState.memberStatus !== 'ACTIVE') {
        const requestBody = shopAdChecked ? {
          directMailAgreed: true,
          smsAgreed: true
        } : { nodata: '' }
        await dispatch('_signUpOpenid', { data: requestBody })
      }
      await dispatch('_syncProfile')
      await dispatch('memberFetch')
    },
    async memberFetch ({ commit, dispatch, state, route, rootGetters }) {
      if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
        await dispatch('_fetch')
        if (state.profile.additionalInfo) {
          const additionalInfo = JSON.parse(state.profile.additionalInfo)
          cookies.set('oldOrder', additionalInfo.old_order)
        }
        cookies.set('ncpMemberId', state.profile.memberId)
        cookies.set('ncpOauthIdNo', state.profile.oauthIdNo)
        cookies.set('memberStatus', state.profile.memberStatus)
        cookies.set('ncpCertificated', state.profile.principalCertificated)
        cookies.set('ncpAdultCertificated', state.profile.adultCertificated)
        return state.profile
      }
    },
    async delProfile ({ commit, dispatch, state }) {
      await dispatch('_delProfile', { params: { reason: '회원 탈퇴' } })
    },
    async updateProfile ({ commit, dispatch, state }, { smsAgreed, directMailAgreed }) {
      await dispatch('_updateProfile', { data: { smsAgreed, directMailAgreed } })
    },
    async paycoSync ({ commit, dispatch, state }) {
      await dispatch('_paycoSync')
      return dispatch('memberFetch')
    },
    async getProfileForAceTM ({ commit, dispatch, state }) {
      let ace = {
        uID: '',
        uAge: 0,
        uGender: ''
      }
      if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
        await dispatch('_fetch')
        ace.uID = state.profile.oauthIdNo
        ace.uAge = state.profile.birthday ? new Date().getFullYear() - state.profile.birthday.substr(0, 4) : 0
        if (state.profile.sex === 'M') {
          ace.uGender = 'man'
        } else {
          ace.uGender = 'woman'
        }
      }
      return ace
    }
  },
  getters: {
    boardInquireInfo (state) {
      if (state.profile) {
        const memberInfo = {}
        let memberId = state.profile.memberId
        let telephoneNo = state.profile.mobileNo
        let email = state.profile.email
        if (memberId) {
          memberInfo.memberId = memberId
        }
        if (email) {
          memberInfo.email = email
        }
        if (telephoneNo) {
          if (telephoneNo.indexOf('-') > -1) {
            let telephoneArry = telephoneNo.split('-')
            memberInfo.telephoneNo1 = telephoneArry[0]
            memberInfo.telephoneNo2 = telephoneArry[1]
            memberInfo.telephoneNo3 = telephoneArry[2]
            memberInfo.telephoneNoflg = true
          }
        } else {
          memberInfo.telephoneNoflg = false
        }
        return memberInfo
      }
    }
  }
}
