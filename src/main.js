import 'babel-polyfill'
import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App'
import router from './router'
import store from './store'
import './filters'
import VueLazyload from 'vue-lazyload'
import VueClipboard from 'vue-clipboard2'
import Toasted from 'vue-toasted'
import iosAlertView from 'vue-ios-alertview'
import ClickOutside from 'vue-click-outside'

Vue.use(VueLazyload, {
  throttleWait: 50
})

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)

Vue.use(Toasted)
Vue.use(iosAlertView)

Vue.config.productionTip = false

sync(store, router)
Vue.directive('click-outside', ClickOutside)
function bootstrap () {
  return new Vue({
    el: '#wrap',
    router,
    store,
    render: h => h(App)
  })
}

if (process.env.NODE_ENV === 'production') {
  bootstrap()
} else {
  setTimeout(() => bootstrap(), 500) // await vue-devtools...
}
