import { createNcpApiStore } from '@/api'
import cookies from 'js-cookie'
import ncpApi from '@/api/ncpApi'
import { logoutRemoveCookie } from '@/utils/utils'
import router from '@/router'
import config from '@/config'

const apiStore = createNcpApiStore([
  {
    action: 'openid',
    property: 'openid',
    path: 'oauth/openid'
  },
  {
    action: '_paycoToken',
    property: 'payToken',
    path: 'openid/token'
  },
  {
    action: 'delToken',
    property: 'result',
    path: 'oauth/token',
    method: 'delete'
  },
  {
    action: '_delOnlyBuywow',
    property: 'delOnlyBuywow',
    path: 'profile',
    method: 'delete'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    isAvailableMember: false
  },
  actions: {
    async logout ({ state, commit, dispatch }) {
      await dispatch('delToken')
      logoutRemoveCookie()
      window.location.href = '/'
    },
    async fetchShopAgreement ({ state, commit, dispatch }) {
      await cookies.set('ncpMemberAgree', 'Y')
    },
    async setShopAgreementY ({ state, commit, dispatch }) {
      cookies.set('ncpMemberAgree', 'Y')
    },
    async setShopAgreementN ({ state, commit, dispatch }) {
      cookies.set('ncpMemberAgree', 'N')
    },
    async appToken2AccessToken ({ state, commit, dispatch, rootState }, { appToken }) {
      const osType = rootState.osType()
      ncpApi.defaults.headers.accessToken = ''
      await dispatch('openid', { params: { openAccessToken: appToken, provider: 'ncpstore', platformType: osType } })
      cookies.set('ncpAccessToken', state.openid.accessToken, { 'max-age': state.openid.expireIn })
      // cookies.set('oldAccessToken', appToken)
      ncpApi.defaults.headers.accessToken = state.openid.accessToken
    },
    checkLoginAndMemberStatus ({ state, commit, rootGetters }) {
      if (!rootGetters.isLogined) {
        state.isAvailableMember = false
        this.callUnauthUrlScheme()
        return false
      }
      if (rootGetters.isLogined && rootGetters.memberStatus !== 'ACTIVE') {
        state.isAvailableMember = false
        router.push({
          path: '/member/agreement',
          query: {
            redirect: `${location.protocol}//${location.host}${router.fullPath}`
          }
        })
        return false
      }
      state.isAvailableMember = true
    },
    delOnlyBuywow ({ state, commit, dispatch, rootState }, reasonData) {
      return dispatch('_delOnlyBuywow', { params: { reason: reasonData } })
    },
    callUnauthUrlScheme ({ state, commit, dispatch }) {
      // alert('로그인이 필요합니다.')
      window.location.href = `${config.urlScheme}://${config.unauthUrlScheme}`
    }
  },
  getters: {
    isAvailableMember (state) {
      return state.isAvailableMember
    }
  },
  mutations: {
  }
}
