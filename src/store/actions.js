import router from '@/router'
import cookies from 'js-cookie'
// import config from '@/config/index'
// import { compareAppVersion } from '@/utils/StringUtils'
// import { hasAccessToken, getAccessToken } from '@/utils/utils'

window.setAppAccessToken = function (token) {
  cookies.set('APP-TOKEN', token)
  const nxturl = cookies.get('nxturl')
  if (nxturl && nxturl.length > 0) {
    window.location.href = decodeURIComponent(nxturl)
  }
}

export default {
  backOrClose () {
    router.back() // TODO: back or close or to main....
  },
  // saveLogin ({ dispatch, state }, { code, token, nxturl }) {
  //   dispatch('ncpstoreLoginForAPP', { nxturl })
  // },
  // ncpstoreLoginForAPP ({ dispatch, state }, { nxturl }) {
  //   if (!hasAccessToken()) {
  //     dispatch('login')
  //   } else {
  //     dispatch('authentication/appToken2AccessToken', { accessToken: getAccessToken() }).then(function () {
  //       dispatch('afterLogined', { nxturl })
  //     })
  //   }
  // },
  afterLogined ({ dispatch, state }, { nxturl }) {
    if (!nxturl || nxturl === '' || nxturl === 'undefined') {
      nxturl = '/'
    }
    dispatch('profile/memberFetch').then(res => {
      const memberstatus = res.memberStatus
      if (memberstatus !== 'ACTIVE') {
        location.href = ('/member/agreement?nxturl=' + nxturl)
      } else {
        dispatch('authentication/fetchShopAgreement').then(() => {
          if (opener) {
            opener.location.replace(nxturl)
            self.close()
          } else {
            location.replace(nxturl)
          }
        })
      }
    })
  },
  paycoCertify ({ dispatch, state }, { nxturl }) {
    dispatch('profile/paycoSync').then(() => {
      window.location.href = nxturl
    })
  }
  // loginBridge ({ dispatch, state }, { trackingKey, redirect }) {
  //   if (trackingKey) {
  //     cookies.set('trackingKey', trackingKey)
  //   }
  //   cookies.set('fromPayco', 'Y')
  //   window.location.replace(config.paycoLoginUrl(redirect))
  // }
}
