import axios from 'axios'
import cookies from 'js-cookie'
import config from '@/config'
import applyUrlTemplate from './applyUrlTemplate'
import applyDefaultParams from './applyDefaultParams'
import { applyCacheResuest, applyCacheResponse } from './cache'
import store from '@/store'

import normalizeAxiosError, {
  SERVER_ERROR,
  TIMEOUT_ERROR,
  NETWORK_ERROR,
  CLIENT_ERROR,
  UNAUTH_ERROR
} from './normalizeAxiosError'
import router from '@/router'
import { logoutRemoveCookie } from '@/utils/utils'
// import { compareAppVersion } from '@/utils/StringUtils'

const API_TIMEOUT = 30000 // 30s

const ncpApi = axios.create({
  baseURL: getBaseUrl(),
  timeout: API_TIMEOUT,
  headers: {
    'accessToken': cookies.get('ncpAccessToken') || '',
    'clientId': config.ncpClientId,
    'Version': '1.0',
    'platform': config.platform(),
    'guestToken': cookies.get('guestToken') || ''
  }
})

function getBaseUrl () {
  return config.ncpApiBaseUrl
}

ncpApi.interceptors.request.use(applyCacheResuest)
ncpApi.interceptors.request.use(applyUrlTemplate)
ncpApi.interceptors.request.use(applyDefaultParams)

ncpApi.interceptors.response.use(applyCacheResponse)
ncpApi.interceptors.response.use(null, normalizeAxiosError)
ncpApi.interceptors.response.use(null, function (err) {
  if (err.code === TIMEOUT_ERROR || err.code === NETWORK_ERROR) {
    // soter.commit('error...', err)
  }
  if (err.code === UNAUTH_ERROR) {
    logoutRemoveCookie()
    store.dispatch('authentication/callUnauthUrlScheme')
  }
  if (err.code === SERVER_ERROR) {
    // soter.commit('error...', err)
    if (router.app._route.query.isDebug !== 'true') {
      if (!window.location.href.includes('/etc/dataerror')) {
        window.location.href = '/etc/dataerror'
      }
    }
  }
  if (err.code === CLIENT_ERROR) {
    const noalert = ['E0005', 'M0013', 'O0009', 'E9001', 'CL904']
    const customCode = {
      'E0009': '선택하신 상품은 찜하기 불가능한 상품입니다.'
    }
    if (!noalert.some(item => item === err.data.code)) {
      if (customCode[err.data.code]) {
        alert(customCode[err.data.code])
      } else {
        alert(err.data.message)
      }
    }
    switch (err.data.code) {
      case 'M0013': // AccessToken 검증에 실패하였습니다.
        logoutRemoveCookie()
        store.dispatch('authentication/callUnauthUrlScheme')
        break
      case 'M0030':
        router.push({
          path: '/member/agreement',
          query: {
            nxturl: `${location.protocol}//${location.host}${router.app._route.fullPath}`
          }
        })
        break
      case 'PNR001':
        window.location.href = '/'
        break
      case 'E9001':
        if (router.app._route.name !== 'PwSearch') {
          router.push({
            path: '/pagenotfound'
          })
        }
        break
      default:
        break
    }
  }
  return Promise.reject(err)
})

export default ncpApi
