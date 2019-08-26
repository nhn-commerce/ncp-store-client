import cookies from 'js-cookie'
import platform from 'platform'
import web2app from './web2app'
import { getStrYMDHMSS, getTodayTime } from '@/utils/dateUtils'
import config from '@/config'

export function hasClass (elem, cls) {
  cls = cls || ''
  if (cls.replace(/\s/g, '').length === 0) return false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ')
}

export function addClass (elem, cls) {
  if (!hasClass(elem, cls)) {
    elem.className = elem.className === '' ? cls : elem.className + ' ' + cls
  }
}

export function removeClass (elem, cls) {
  if (hasClass(elem, cls)) {
    let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' '
    while (newClass.indexOf(' ' + cls + ' ') >= 0) {
      newClass = newClass.replace(' ' + cls + ' ', ' ')
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '')
  }
}

export function miliFormat (num) {
  return num && num.toString().replace(/(?=(?!^)(\d{3})+$)/g, ',')
}

export function logoutRemoveCookie () {
  cookies.remove('memberStatus')
  cookies.remove('ncpAccessToken')
  cookies.remove('APP-TOKEN')
  cookies.remove('oldAccessToken')
  cookies.remove('accessToken')
  cookies.remove('ncpMemberId')
  cookies.remove('ncpOauthIdNo')
  cookies.remove('ncpCertificated')
  cookies.remove('ncpMemberAgree')
  cookies.remove('oldOrder')
  cookies.remove('ncpAdultCertificated')
}

export function scriptLoader (url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.async = true
    script.addEventListener('load', resolve)
    script.addEventListener('error', reject)
    document.body.appendChild(script)
  })
}

export function gotoOutLink (url) {
  if (process.env.BUILD_TARGET === 'webview') {
    window.location.href = `${config.urlScheme}://newBrowser?url=` + encodeURIComponent(url)
  } else {
    window.open(url)
  }
}

export function formatBanners (banners) {
  if (banners) {
    return banners.filter(banner => getStrYMDHMSS(banner.displayStartYmdt) <= getTodayTime() && getTodayTime() <= getStrYMDHMSS(banner.displayEndYmdt))
  }
}

export function hasAccessToken () {
  return hasAppToken() && hasNcpAccessToken()
}

export function hasNcpAccessToken () {
  return (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0)
}

export function hasAppToken () {
  return (cookies.get('APP-TOKEN') && cookies.get('APP-TOKEN').length > 0)
}

export function getAccessToken () {
  if (cookies.get('ncpAccessToken') && cookies.get('ncpAccessToken').length > 0) {
    return cookies.get('ncpAccessToken')
  } else {
    return ''
  }
}
export function shareAndLoadScript (shareObj) {
  if ((shareObj.shareType === 'KT' || shareObj.shareType === 'KS') && !window.Kakao) {
    scriptLoader('https://developers.kakao.com/sdk/js/kakao.min.js').then(() => {
      share(shareObj)
    })
  } else {
    share(shareObj)
  }
}

/* global Kakao */
export function share ({ shareType, msg, link, imageUrl, regularPrice, discountPrice, discountRate }) {
  const kakaoKey = config.kakaoKey
  if (shareType === 'KT') {
    const obj = {}
    obj.objectType = 'commerce'
    obj.content = {
      title: msg,
      imageUrl: imageUrl,
      link: {
        mobileWebUrl: link
      }
    }
    obj.commerce = {
      regularPrice: regularPrice,
      discountPrice: discountPrice,
      discountRate: discountRate
    }

    Kakao.cleanup()
    Kakao.init(kakaoKey)
    Kakao.Link.sendDefault(obj)
  } else if (shareType === 'FB') {
    const fbShareUrl = 'https://m.facebook.com/sharer.php?u=' + encodeURIComponent(link)
    location.href = fbShareUrl
  } else if (shareType === 'BD') {
    const storeURL = platform.os.family === 'iOS' ? 'itms-apps://itunes.apple.com/app/id542613198' : 'market://details?id=com.nhn.android.band'
    web2app({
      urlScheme: `bandapp://create/post?text=${msg}${link}&route=`,
      storeURL
    })
  } else if (shareType === 'SMS') {
    if (platform.os.family === 'iOS') {
      location.href = `sms:&body=${msg}${link}`
    } else {
      location.href = `sms:?body=${msg}${link}`
    }
  } else if (shareType === 'KS') {
    Kakao.init(kakaoKey)
    Kakao.Story.cleanup()
    Kakao.Story.open({
      url: link,
      text: msg
    })
  }
}
