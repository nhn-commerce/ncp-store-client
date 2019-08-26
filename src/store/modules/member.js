import { createNcpApiStore } from '@/api'
// import { clearRepeatNum } from '@/utils/StringUtils'
const apiStore = createNcpApiStore([
  {
    action: '_memberInformation',
    property: 'member',
    path: 'profile',
    pathParams: ['get']
  },
  {
    action: '_mySummary',
    property: 'mySummary',
    path: 'profile/summary',
    pathParams: ['get']
  }

  // {
  //   action: '_ordersStatus',
  //   property: 'ordersStatus',
  //   path: 'profile/orders/summary/status',
  //   method: 'get'
  // },
  // {
  //   action: '_myCoupons',
  //   property: 'myCoupons',
  //   path: 'coupons',
  //   method: 'get'
  // },
  // {
  //   action: '_myReview',
  //   property: 'myReview',
  //   path: 'profile/order-options/product-reviewable',
  //   method: 'get'
  // },
  // {
  //   action: '_myLike',
  //   property: 'myLike',
  //   path: 'profile/like-products',
  //   method: 'get'
  // }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    memberInformation ({ state, commit, dispatch }) {
      return dispatch('_memberInformation')
    },
    mySummary ({ state, commit, dispatch }) {
      return dispatch('_mySummary')
    }
    // ordersStatus ({ state, commit, dispatch }) {
    //   return dispatch('_ordersStatus')
    // },
    // myCoupons ({ state, commit, dispatch, rootGetters }) {
    //   // if (!rootGetters.isLogined) {
    //   //   return
    //   // }
    //   return dispatch('_myCoupons', { params: { usable: true, hasTotalCount: true, pageNumber: 1, pageSize: 300 } })
    // },
    // myReview ({ state, commit, dispatch }) {
    //   return dispatch('_myReview')
    // },
    // myLike ({ state, commit, dispatch }) {
    //   return dispatch('_myLike')
    // }
  },
  getters: {
    // getMyCoupons (state) {
    //   if (state.myCoupons) {
    //     state.coup = clearRepeatNum(state.myCoupons.items.map(item => {
    //       return item.couponNo
    //     }))
    //     return state
    //   }
    // }
  }
}
