import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import { scrollBehavior } from './utils'
import { setTrackingKey, checkAppToken, auth, dispatchAction, resetSearchWordInfo } from './hooks'
// import { analytics, appLogin, auth, dispatchAction, resetSearchWordInfo, mobilewebCheck } from './hooks'
import routes from './routes'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  mode: 'history',
  scrollBehavior,
  routes
})

router.beforeEach(setTrackingKey)
// router.beforeEach(mobilewebCheck)
router.beforeEach(checkAppToken)
router.beforeEach(auth)
router.beforeEach(dispatchAction)
router.afterEach(resetSearchWordInfo)
export default router
