import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'js-cookie'
import { applyMixin } from './storeMixin'
import actions from './actions'
import getters from './getters'
import config from '@/config'
import { scriptLoader, hasAccessToken } from '@/utils/utils'

// Add the script to the window object
export function loadNCPSearchScript () {
  if (window.NCPSearch) {
    return Promise.resolve()
  } else {
    return scriptLoader(config.ncpApiBaseUrl + 'search/' + config.searchJs)
  }
}

export function loadNCPPayScript () {
  if (window.NCPPay) {
    return Promise.resolve()
  } else {
    return scriptLoader(config.ncpApiBaseUrl + 'payments/' + config.payJs)
  }
}

loadNCPSearchScript()
loadNCPPayScript()

Vue.use(Vuex)

const requireModules = require.context('./modules', false, /\.js$/)
const modules = requireModules.keys().reduce((modules, fileName) => {
  const name = fileName.match(/([^./]+)\.js$/)[1]
  modules[name] = requireModules(fileName).default
  return modules
}, {})

export default new Vuex.Store(applyMixin({
  state: {
    ncpAccessToken: cookies.get('ncpAccessToken'),
    memberStatus: cookies.get('memberStatus'),
    ncpCertificated: cookies.get('ncpCertificated') === 'true',
    ncpMemberAgree: cookies.get('ncpMemberAgree') === 'Y',
    appVersion: cookies.get('appVersion'),
    memberIsLogin: function () {
      if (process.env.BUILD_TARGET !== 'webview') {
        return cookies.get('ncpAccessToken') !== undefined &&
          cookies.get('ncpAccessToken').length > 0
      } else {
        return hasAccessToken() &&
          cookies.get('ncpAccessToken') !== undefined &&
          cookies.get('ncpAccessToken').length > 0
      }
    },
    osType: function () {
      if (process.env.BUILD_TARGET !== 'webview') {
        return 'WEB'
      }
      const ostype = cookies.get('osType')
      if (ostype === 'aos') {
        return 'AOS'
      }
      return 'IOS'
    }
  },
  actions,
  getters,
  modules
}))
