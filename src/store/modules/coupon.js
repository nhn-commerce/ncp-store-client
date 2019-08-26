import { createNcpApiStore } from '@/api'
// import { clearRepeatNum } from '@/utils/StringUtils'
// import Vue from 'vue'
const apiStore = createNcpApiStore([
  {
    action: '_fetchProductCoupons',
    property: 'coupons',
    path: 'coupons/products/{productNo}/issuable/coupons',
    pathParams: ['productNo']
  },
  {
    action: '_downLoadCoupons',
    property: 'couponsDown',
    path: 'coupons/{couponNo}/download',
    pathParams: ['couponNo'],
    method: 'post'
  }
])
export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    fetchProductCoupons ({ state, commit, dispatch }, productNo) {
      return dispatch('_fetchProductCoupons', { params: { productNo } })
    },
    async downLoadCoupons ({ state, commit, dispatch }, { couponNo, productNo }) {
      await dispatch('_downLoadCoupons', { params: { couponNo } })
      alert('할인쿠폰이 발급되었습니다')
      return dispatch('_fetchProductCoupons', { params: { productNo } })
    },
    myCoupons ({ state, commit, dispatch, rootGetters }) {
      if (!rootGetters.isLogined) {
        return
      }
      return dispatch('_myCoupons', { params: { usable: true, hasTotalCount: true, pageNumber: 1, pageSize: 300 } })
    },
    async eventDownLoad ({ state, commit, dispatch }, { couponNo }) {
      return dispatch('_downLoadCoupons', { params: { couponNo } })
    }
  },
  getters: {
    compare (state, getters, rootState, rootGetters) {
      if (rootState.product.product) {
        if ((state.coupons && !rootGetters.isLogined) || (rootGetters.isLogined && state.coupons)) {
          const newCoupons = state.coupons.sort((obj1, obj2) => {
            const disAmt1 = obj1.discountInfo.discountAmt ? obj1.discountInfo.discountAmt : obj1.discountInfo.discountRate / 100 * rootState.product.product.price.salePrice
            const disAmt2 = obj2.discountInfo.discountAmt ? obj2.discountInfo.discountAmt : obj2.discountInfo.discountRate / 100 * rootState.product.product.price.salePrice
            if (disAmt1 < disAmt2) {
              return 1
            } else if (disAmt1 > disAmt2) {
              return -1
            } else {
              if (obj1.dateInfo.issueEndYmdt > obj2.dateInfo.issueEndYmdt) {
                return 1
              } else if (obj1.dateInfo.issueEndYmdt < obj2.dateInfo.issueEndYmdt) {
                return -1
              } else {
                if (obj1.couponName > obj2.couponName) {
                  return 1
                } else {
                  return -1
                }
              }
            }
          })
          return newCoupons
        }
      }
    }
  }
}
