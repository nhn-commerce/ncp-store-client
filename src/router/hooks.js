import store, { loadNCPSearchScript } from '@/store'
import { removeClass, hasAccessToken } from '@/utils/utils'
import cookies from 'js-cookie'
import queryString from 'query-string'

/* global NCPSearch */

export function setTrackingKey (to, from, next) {
  if (to.query.trackingKey) {
    cookies.set('trackingKey', to.query.trackingKey)
  }
  next()
}

export function auth (to, from, next) {
  if (to.matched.some(record => record.meta.needAuth)) { // auth가 필요한 부분인데
    if (!hasAccessToken()) { // accessToken이 없는 경우
      store.dispatch('authentication/callUnauthUrlScheme')
      return false
    } else if (cookies.get('memberStatus') !== 'ACTIVE') {
      next({
        path: '/member/agreement',
        query: {
          nxturl: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

export function dispatchAction (to, from, next) {
  next()
  if (document.getElementById('loader')) {
    document.getElementById('loader').style.display = 'none'
    removeClass(document.body, 'no_scroll')
    removeClass(document.body, 'floating_bottom')
  }
  if (to.meta.action) {
    store.dispatch(`beforeEnter${to.name}`, { to, from })
  }
}

export function resetSearchWordInfo (to, from, next) {
  const showLog = ['MainHome', 'Cart', 'Event', 'LikeProducts']
  if (showLog.some(item => item === to.name)) {
    loadNCPSearchScript().then(() => {
      NCPSearch.resetSearchWordInfo()
    })
  }
}

export function mobilewebCheck (to, from, next) {
  if (process.env.BUILD_TARGET === 'webview' && !cookies.get('appVersion')) {
    alert('모바일 전용페이지로 이동합니다')
    if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'alpha') {
      window.location.href = `${location.protocol}//alpha-m.buywow.co.kr`
    } else {
      window.location.href = `${location.protocol}//m.buywow.co.kr`
    }
  } else {
    next()
  }
}

// ncpAccessToken 체크 -> APP-TOKEN으로 /oauth/openId API 호출
export function checkAppToken (to, from, next) {
  let appToken = cookies.get('APP-TOKEN')

  // ncpAccessToken 없는 경우
  if (appToken !== undefined && !hasAccessToken()) {
    // cookie에서 APP-TOKEN을 가져옴
    // 1. login
    store.dispatch('authentication/appToken2AccessToken', { appToken: appToken }).then(() => {
      store.dispatch('profile/memberFetch').then(() => {
        store.dispatch('authentication/fetchShopAgreement').then(() => {
          next()
        })
      })
    })
  } else { // else -> accesstoken 있는 경우
    next()
  }
}

// 리얼 환경이 아닌 경우 token 쿼리 스트링으로 APP-TOKEN이 들어오는 경우 이걸로 accesstoken
export function alphaCheckAppToken (to, from, next) {
  let qs = queryString.parse(window.location.search)
  let cookiesToken = cookies.get('APP-TOKEN')
  if (process.env.BUILD_ENV !== 'prod' && qs && Object.keys(qs).includes('token') && cookiesToken === undefined) {
    let appToken = qs['token']
    if (appToken !== undefined && !hasAccessToken()) {
      // cookie에서 APP-TOKEN을 가져옴
      // 1. login
      cookies.set('APP-TOKEN', appToken)
      store.dispatch('authentication/appToken2AccessToken', { appToken: appToken }).then(() => {
        store.dispatch('profile/memberFetch').then(() => {
          store.dispatch('authentication/fetchShopAgreement').then(() => {
            next()
          })
        })
      })
    } else { // else -> accesstoken 있는 경우
      next()
    }
  } else {
    next()
  }
}
