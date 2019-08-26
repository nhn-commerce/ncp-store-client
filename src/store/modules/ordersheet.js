import { createNcpApiStore } from '@/api'
import { formatCurrency, telnoFormat, getshowOptions } from '@/utils/StringUtils'
import Vue from 'vue'
import cookies from 'js-cookie'

const apiStore = createNcpApiStore([
  {
    action: '_postOrderSheets',
    property: 'ordersheetno',
    path: 'order-sheets',
    method: 'post'
  },
  {
    action: '_getOrderSheets',
    property: 'ordersheet',
    path: 'order-sheets/{orderSheetNo}',
    pathParams: ['orderSheetNo']
  },
  {
    action: '_orderCoupons',
    property: 'orderCoupons',
    path: 'order-sheets/{orderSheetNo}/coupons',
    pathParams: ['orderSheetNo']
  },
  {
    action: '_calculate',
    property: 'orderCouponsCalcu',
    path: 'order-sheets/{orderSheetNo}/coupons/calculate',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_maxCalculateOrder',
    property: 'orderCouponsCalcu',
    path: 'order-sheets/{orderSheetNo}/coupons/maximum',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_calculateOrder',
    property: 'orderCouponsResult',
    path: 'order-sheets/{orderSheetNo}/calculate',
    pathParams: ['orderSheetNo'],
    method: 'post'
  },
  {
    action: '_applyCouponOrder',
    property: 'orderCouponsApplyResult',
    path: 'order-sheets/{orderSheetNo}/coupons/apply',
    pathParams: ['orderSheetNo'],
    method: 'post'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    couponAmt: 0,
    couponRequest: {
      cartCouponIssueNo: 0,
      deliveryCouponIssueNo: 0,
      promotionCode: '',
      productCoupons: []
    },
    addressRequest: {

    },
    newAddress: false,
    currRecent: null,
    deliveryMemo: '',
    payType: 'PAYCO',
    pgType: 'PAYCO',
    couponCartClickType: '',
    couponDeliveryClickType: ''
  },
  actions: {
    async getSheetNo ({ state, dispatch, commit, rootState, rootGetters }, to) {
      const orderinfo = JSON.parse(window.localStorage.orderinfo)
      const option = decodeURIComponent(orderinfo.option)
      if (option && option.length > 0) {
        const products = JSON.parse(option)
        const searchProductID = to.query.searchProductID
        const productNo = to.query.productNo
        const channelType = to.query.channelType
        let errFlg = false
        const requestObj = { products }
        /** trackingKey */
        if (cookies.get('trackingKey') && cookies.get('trackingKey').length > 0) {
          requestObj.trackingKey = cookies.get('trackingKey')
        }
        /** end */
        /** channelType */
        if (channelType && channelType !== '') {
          requestObj.channelType = channelType
        }
        /** end */
        const res = await dispatch('_postOrderSheets', { data: requestObj }).catch(e => {
          errFlg = true
          if (e.data.code !== 'O3336') {
            window.location.replace(orderinfo.fromUrl)
          }
        })
        if (errFlg) {
          return
        }
        const cartnos = []
        products.forEach(item => {
          if (item.cartNo) {
            cartnos.push(item.cartNo)
          }
        })
        let url = '/order/' + res.data.orderSheetNo
        let flg = false
        if (cartnos.length > 0) {
          url += '?cartnos=' + encodeURIComponent(JSON.stringify(cartnos))
          flg = true
        }
        if (productNo) {
          if (flg) {
            url += '&productNo=' + productNo
          } else {
            url += '?productNo=' + productNo
            flg = true
          }
        }
        if (searchProductID) {
          if (flg) {
            url += '&searchProductID=' + searchProductID
          } else {
            url += '?searchProductID=' + searchProductID
          }
        }
        window.location.replace(url)
      } else {
        window.location.replace('/etc/dataerror')
      }
    },
    async fetchOrder ({ state, dispatch, commit, rootGetters }, orderSheetNo) {
      await dispatch('_getOrderSheets', { params: { orderSheetNo } })

      if (rootGetters.isLogined) {
        await dispatch('_orderCoupons', { params: { orderSheetNo } })
        commit('CLEAR_REPEAT_COUPON')
        commit('INIT_ADDRESS_REQUEST')
        commit('INIT_COUPONREQUEST')
        commit('SUM_APPLYED_COUPONAMT', commit)
        commit('FORMAT_ORDERER_CONTACT')
      }
    },
    async fetchOrderConpons ({ state, dispatch, commit, rootGetters }, orderSheetNo) {
      if (!rootGetters.isLogined) {
        return
      }
      await dispatch('_orderCoupons', { params: { orderSheetNo } })
      commit('CLEAR_REPEAT_COUPON')
    },
    async calculateConpons ({ state, dispatch, commit, rootGetters }, { orderSheetNo, couponRequest }) {
      if (!rootGetters.isLogined) {
        return
      }

      const couponRequestCopy = JSON.parse(JSON.stringify(couponRequest))
      if (couponRequestCopy.productCoupons.length > 0) {
        couponRequestCopy.productCoupons = couponRequestCopy.productCoupons.filter((item) => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }

      await dispatch('_calculate', { params: { orderSheetNo }, data: couponRequestCopy })
      commit('CLEAR_REPEAT_COUPON')
      commit('INIT_COUPONREQUEST', couponRequest)
      commit('SET_COUPON_SELECTED', { commit, couponRequest })
    },
    async maxCalculateConpons ({ state, dispatch, commit, rootGetters }, { orderSheetNo, couponRequest }) {
      if (!rootGetters.isLogined) {
        return
      }
      await dispatch('_maxCalculateOrder', { params: { orderSheetNo } })
      commit('CLEAR_REPEAT_COUPON')
      commit('INIT_COUPONREQUEST', couponRequest)
      commit('SET_COUPON_SELECTED', { commit, couponRequest })
    },
    async calculateOrderConpons ({ state, dispatch, commit, rootGetters }, { orderSheetNo, addressRequest }) {
      if (!addressRequest) {
        addressRequest = state.addressRequest
      }
      await dispatch('_calculateOrder', { params: { orderSheetNo }, data: addressRequest })
      commit('SET_ADDRESS_REQUEST', addressRequest)
      commit('UPDATE_ORDERSHEET_PAYMENTS')
    },
    async applyCouponOrder ({ state, dispatch, commit, rootGetters }, { orderSheetNo, couponRequest }) {
      if (!rootGetters.isLogined) {
        return
      }
      const couponRequestCopy = JSON.parse(JSON.stringify(couponRequest))
      if (couponRequestCopy.productCoupons.length > 0) {
        couponRequestCopy.productCoupons = couponRequestCopy.productCoupons.filter((item) => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }

      await dispatch('_applyCouponOrder', { params: { orderSheetNo }, data: couponRequestCopy })
      commit('UPDATE_ORDERSHEET_PAYMENTS_COUPON')
      await dispatch('fetchOrder', orderSheetNo)
      state.addressRequest.couponRequest = couponRequestCopy
      await dispatch('calculateOrderConpons', { orderSheetNo, addressRequest: state.addressRequest })
    }
  },
  mutations: {
    FORMAT_ORDERER_CONTACT (state) {
      if (state.ordersheet.ordererContact) {
        if (state.ordersheet.ordererContact.ordererContact1) {
          const contactNos = telnoFormat(state.ordersheet.ordererContact.ordererContact1)
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_one', contactNos[0])
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_two', contactNos[1])
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_three', contactNos[2])
        } else {
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_one', '')
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_two', '')
          Vue.set(state.ordersheet.ordererContact, 'ordererContact1_three', '')
        }
        if (state.ordersheet.ordererContact.ordererEmail) {
          const emails = state.ordersheet.ordererContact.ordererEmail.split('@')
          Vue.set(state.ordersheet.ordererContact, 'ordererEmailName', emails[0])
          Vue.set(state.ordersheet.ordererContact, 'ordererEmailDomain', emails[1])
        } else {
          Vue.set(state.ordersheet.ordererContact, 'ordererEmailName', '')
          Vue.set(state.ordersheet.ordererContact, 'ordererEmailDomain', '')
        }
      }
    },
    SUM_APPLYED_COUPONAMT (state, commit) {
      const paymentInfo = state.ordersheet.paymentInfo
      state.couponAmt = paymentInfo.cartCouponAmt + paymentInfo.deliveryCouponAmt + paymentInfo.productCouponAmt

      const appliedCoupons = state.ordersheet.appliedCoupons
      if (appliedCoupons) {
        state.couponRequest.cartCouponIssueNo = appliedCoupons.cartCouponIssueNo
        state.couponRequest.deliveryCouponIssueNo = appliedCoupons.deliveryCouponIssueNo
        if (appliedCoupons.productCoupons && appliedCoupons.productCoupons.length > 0) {
          appliedCoupons.productCoupons.forEach((pdCoupon) => {
            commit('SET_COUPONREQUEST_COUPONISS', { productNo: pdCoupon.productNo, couponIssueNo: pdCoupon.couponIssueNo, couponRequest: null })
            commit('SET_COUPONREQUEST_PLUSCOUPONISS', { productNo: pdCoupon.productNo, plusCouponIssueNo: pdCoupon.plusCouponIssueNo, couponRequest: null })
          })
        }
        state.orderCoupons.cartCouponDiscountAmt = paymentInfo.cartCouponAmt
        state.orderCoupons.deliveryCouponDiscountAmt = paymentInfo.deliveryCouponAmt
        state.orderCoupons.productCouponDiscountAmt = paymentInfo.productCouponAmt

        commit('CART_COUPON_USE')
      }
    },
    CART_COUPON_USE (state) {
      if (state.orderCoupons) {
        const otherCouponUsable = state.orderCoupons.cartCoupons && state.orderCoupons.cartCoupons.some(item => item.couponIssueNo === state.couponRequest.cartCouponIssueNo && !item.otherCouponUsable)
        if (otherCouponUsable) {
          state.couponRequest.productCoupons.forEach(item => {
            item.couponIssueNo = 0
            item.plusCouponIssueNo = 0
            item.couponDisable.forEach(si => {
              si.usable = false
            })
            item.couponPlusDisable.forEach(si => {
              si.usable = false
            })
          })
        }
      }
    },
    SET_COUPON_SELECTED (state, { commit, couponRequest }) {
      if (state.orderCouponsCalcu) {
        state.orderCoupons = state.orderCouponsCalcu
        let otherUsedable = true
        if (state.orderCouponsCalcu.cartCoupons) {
          const cartCoupon = state.orderCouponsCalcu.cartCoupons.filter(item => item.selected)
          if (cartCoupon && cartCoupon.length > 0) {
            if (cartCoupon.length > 0 && cartCoupon[0].limitPayType === 'PAYCO') {
              state.couponCartClickType = 'PAYCO'
            } else {
              state.couponCartClickType = 'GENERAL'
            }
            couponRequest.cartCouponIssueNo = cartCoupon[0].couponIssueNo
          }
        }
        if (state.orderCouponsCalcu.deliveryCoupons) {
          const deliveryCoupon = state.orderCouponsCalcu.deliveryCoupons.filter(item => item.selected)
          if (deliveryCoupon && deliveryCoupon.length > 0) {
            if (deliveryCoupon.length > 0 && deliveryCoupon[0].limitPayType === 'PAYCO') {
              state.couponDeliveryClickType = 'PAYCO'
            } else {
              state.couponDeliveryClickType = 'GENERAL'
            }
            couponRequest.deliveryCouponIssueNo = deliveryCoupon[0].couponIssueNo
          }
        }

        if (otherUsedable) {
          state.orderCouponsCalcu.products.forEach(pdCoupon => {
            couponRequest.productCoupons.forEach(pdcItem => {
              if (pdcItem.productNo === pdCoupon.productNo) {
                const coupon = pdCoupon.productCoupons.filter(pdc => pdc.selected)
                if (coupon.length > 0) {
                  pdcItem.couponIssueNo = coupon[0].couponIssueNo
                }

                const ngCoupon = pdCoupon.productCoupons.filter(pdc => pdc.selected === false && pdc.used === true)
                if (ngCoupon.length > 0) {
                  ngCoupon.forEach(ngc => {
                    const disableCoupn = pdcItem.couponDisable.filter(disCoupon => disCoupon.couponIssueNo === ngc.couponIssueNo)
                    if (disableCoupn.length > 0) {
                      disableCoupn[0].disable = true
                      disableCoupn[0].usable = false
                    }
                  })
                }

                const couponPlus = pdCoupon.productPlusCoupons.filter(pdc => pdc.selected)
                if (couponPlus.length > 0) {
                  pdcItem.plusCouponIssueNo = couponPlus[0].couponIssueNo
                }

                const ngCouponPlus = pdCoupon.productPlusCoupons.filter(pdc => pdc.selected === false && pdc.used === true)
                if (ngCouponPlus.length > 0) {
                  ngCouponPlus.forEach(ngcp => {
                    const disableCoupn = pdcItem.couponPlusDisable.filter(disCoupon => disCoupon.couponIssueNo === ngcp.couponIssueNo)
                    if (disableCoupn.length > 0) {
                      disableCoupn[0].disable = true
                      disableCoupn[0].usable = false
                    }
                  })
                }
              }
            })
          })
        } else {
          couponRequest.productCoupons.forEach(coupon => {
            coupon.couponIssueNo = 0
            coupon.plusCouponIssueNo = 0
            coupon.couponDisable.forEach(dis => {
              dis.disable = true
              dis.usable = true
            })
            coupon.couponPlusDisable.forEach(dis => {
              dis.disable = true
              dis.usable = true
            })
          })
        }

        state.orderCoupons.cartCouponDiscountAmt = state.orderCouponsCalcu.cartCouponDiscountAmt
        state.orderCoupons.deliveryCouponDiscountAmt = state.orderCouponsCalcu.deliveryCouponDiscountAmt
        state.orderCoupons.productCouponDiscountAmt = state.orderCouponsCalcu.productCouponDiscountAmt
      }
    },
    CHANGE_CURRRECENT (state, recent) {
      state.currRecent = recent
    },
    CHANGE_COUPONAMT (state, amt) {
      state.couponAmt = amt
    },
    CHANGE_NEWADDRESS (state, newAddress) {
      state.newAddress = newAddress
    },
    CHANGE_DEVLI_MEMO (state, memo) {
      state.deliveryMemo = memo
    },
    CHANGE_PAYTYPE (state, type) {
      if (type === 'PAYCO') {
        state.payType = type
        state.pgType = type
      } else {
        state.payType = type
        state.pgType = 'KCP'
      }
    },
    CHANGE_COUPONREQUEST (state, couponRequest) {
      state.couponRequest = couponRequest
    },
    SET_COUPONREQUEST_COUPONISS (state, { productNo, couponIssueNo, couponRequest }) {
      if (!couponRequest) {
        couponRequest = state.couponRequest
      }
      const productCoupon = couponRequest.productCoupons.filter(item => item.productNo === productNo)
      if (productCoupon.length > 0) {
        productCoupon[0].couponIssueNo = couponIssueNo
        /** 정률일 경우 10원 이하 절상으로 표시 */
        const otherProduct = couponRequest.productCoupons.filter(item => item.productNo !== productNo)
        if (otherProduct.length > 0) {
          otherProduct.forEach((elem) => {
            // elem.couponIssueNo = 0
            elem.couponDisable.forEach((elem) => {
              if (couponIssueNo === 0) {
                elem.disable = false
              }
              if (elem.couponIssueNo === couponIssueNo) {
                elem.disable = true
              } else {
                elem.disable = false
              }
            })
          })
        }
      }
    },
    SET_COUPONREQUEST_PLUSCOUPONISS (state, { productNo, plusCouponIssueNo, couponRequest }) {
      if (!couponRequest) {
        couponRequest = state.couponRequest
      }
      const productCoupon = couponRequest.productCoupons.filter(item => item.productNo === productNo)
      if (productCoupon.length > 0) {
        productCoupon[0].plusCouponIssueNo = plusCouponIssueNo
        /** 정률일 경우 10원 이하 절상으로 표시 */
        const otherProduct = couponRequest.productCoupons.filter(item => item.productNo !== productNo)
        if (otherProduct.length > 0) {
          otherProduct.forEach((elem) => {
            elem.couponPlusDisable.forEach((elem) => {
              if (plusCouponIssueNo === 0) {
                elem.disable = false
              }
              if (elem.couponIssueNo === plusCouponIssueNo) {
                elem.disable = true
              } else {
                elem.disable = false
              }
            })
          })
        }
      }
    },
    INIT_ADDRESS_REQUEST (state) {
      if (!state.addressRequest.addressRequest && state.ordersheet && state.ordersheet.orderSheetAddress && state.ordersheet.orderSheetAddress.recentAddresses) {
        state.addressRequest['addressRequest'] = state.ordersheet.orderSheetAddress.recentAddresses[0]
      }
    },
    SET_ADDRESS_REQUEST (state, addressRequest) {
      state.addressRequest = addressRequest
    },
    INIT_COUPONREQUEST (state, couponRequest) {
      if (!couponRequest) {
        couponRequest = state.couponRequest
      }
      // if (couponRequest.productCoupons.length === 0) {
      couponRequest.cartCouponIssueNo = 0
      couponRequest.deliveryCouponIssueNo = 0
      couponRequest.productCoupons = state.orderCoupons.products.map(item => {
        const productCoupons = item.productCoupons
        const productPlusCoupons = item.productPlusCoupons
        const couponDisable = productCoupons.map((elem) => {
          return { couponIssueNo: elem.couponIssueNo, disable: false, usable: true }
        })

        const couponPlusDisable = productPlusCoupons.map((elem) => {
          return { couponIssueNo: elem.couponIssueNo, disable: false, usable: true }
        })

        return {
          couponIssueNo: 0,
          plusCouponIssueNo: 0,
          plusPromotionCode: '',
          productNo: item.productNo,
          promotionCode: '',
          couponDisable: couponDisable,
          couponPlusDisable: couponPlusDisable
        }
      })
      // } else {
      //   couponRequest.cartCouponIssueNo = 0
      //   couponRequest.deliveryCouponIssueNo = 0
      //   couponRequest.productCoupons.forEach(item => {
      //     item.couponIssueNo = 0
      //     item.plusCouponIssueNo = 0
      //     item.plusPromotionCode = ''
      //     item.promotionCode = ''
      //     item.couponDisable.forEach(item => {
      //       item.disable = false
      //       item.usable = true
      //     })
      //     item.couponPlusDisable.forEach(item => {
      //       item.disable = false
      //       item.usable = true
      //     })
      //   })
      // }
    },
    UPDATE_ORDERSHEET_PAYMENTS (state) {
      if (state.ordersheet && state.orderCouponsResult) {
        state.ordersheet.paymentInfo = state.orderCouponsResult.paymentInfo
      }
    },
    UPDATE_ORDERSHEET_PAYMENTS_COUPON (state) {
      if (state.ordersheet && state.orderCouponsApplyResult) {
        state.ordersheet.paymentInfo = state.orderCouponsApplyResult.paymentInfo
      }
    },
    CLEAR_REPEAT_COUPON (state) {
      // const clear = (coupons) => {
      //   if (coupons && coupons.length > 0) {
      //     const c = []
      //     return coupons.filter((item) => {
      //       if (!c.some((no) => no === item.couponNo)) {
      //         c.push(item.couponNo)
      //         return true
      //       }
      //     })
      //   }
      // }
      // const sortFn = (item1, item2) => {
      //   const amt1 = item1.couponDiscountAmt
      //   const maxAmt1 = item1.maxDiscountAmt ? item1.maxDiscountAmt : 0
      //   const amtA = (amt1 <= maxAmt1 || maxAmt1 === 0) ? amt1 : maxAmt1

      //   const amt2 = item2.couponDiscountAmt
      //   const maxAmt2 = item2.maxDiscountAmt ? item2.maxDiscountAmt : 0
      //   const amtB = (amt2 <= maxAmt2 || maxAmt2 === 0) ? amt2 : maxAmt2

      //   if (amtA > amtB) {
      //     return -1
      //   } else if (amtA < amtB) {
      //     return 1
      //   } else if (amtA === amtB && item1.couponIssueNo > item2.couponIssueNo) {
      //     return 1
      //   } else if (amtA === amtB && item1.couponIssueNo < item2.couponIssueNo) {
      //     return -1
      //   } else {
      //     const timeA = item1.useEndYmdt ? new Date(item1.useEndYmdt.replace(/-/g, '/')) : 0
      //     const timeB = item2.useEndYmdt ? new Date(item2.useEndYmdt.replace(/-/g, '/')) : 0
      //     if (timeA === 0 && timeB === 0) {
      //       return 0
      //     } else if (timeA === 0 && timeB !== 0) {
      //       return 1
      //     } else if (timeA !== 0 && timeB === 0) {
      //       return -1
      //     } else if (timeA > timeB) {
      //       return 1
      //     } else {
      //       return -1
      //     }
      //   }
      // }
      /** clear and sort */
      // if (state.orderCoupons.cartCoupons && state.orderCoupons.cartCoupons.length > 0) {
      //   state.orderCoupons.cartCoupons = (state.orderCoupons.cartCoupons).sort(sortFn)
      // }
      // if (state.orderCoupons.deliveryCoupons && state.orderCoupons.deliveryCoupons.length > 0) {
      //   state.orderCoupons.deliveryCoupons = (state.orderCoupons.deliveryCoupons).sort(sortFn)
      // }
      // if (state.orderCoupons.products && state.orderCoupons.products.length > 0) {
      //   state.orderCoupons.products.forEach((item) => {
      //     if (item.productCoupons && item.productCoupons.length > 0) {
      //       item.productCoupons = (item.productCoupons).sort(sortFn)
      //     }
      //     if (item.productPlusCoupons && item.productPlusCoupons.length > 0) {
      //       item.productPlusCoupons = (item.productPlusCoupons).sort(sortFn)
      //     }
      //   })
      // }
      if (!state.orderCoupons.cartCouponDiscountAmt) {
        state.orderCoupons.cartCouponDiscountAmt = 0
      }
    },
    CHANGE_COUPON_CART_CLICK_TYPE (state, val) {
      state.couponCartClickType = val
    },
    CHANGE_COUPON_DELIVERY_CLICK_TYPE (state, val) {
      state.couponDeliveryClickType = val
    }
  },
  getters: {
    orderAvailablePayTypes (state) {
      if (state.ordersheet) {
        return function (payType) {
          const avaiPayTypes = state.ordersheet.availablePayTypes
          const credit = avaiPayTypes.filter(item => item.payType === 'CREDIT_CARD')
          if (credit.length > 0) {
            return true
          } else {
            return false
          }
        }
      }
    },
    orderSelectedPaycoCoupon (state) {
      if (state.orderCoupons) {
        const paycoCoupons = []
        const payType = 'PAYCO'
        const couponAmt = function (coupons, pType) {
          let amt = 0
          coupons.forEach(item => {
            if (item.limitPayType === pType && item.selected && item.used) {
              amt += item.couponDiscountAmt
              paycoCoupons.push(item.couponIssueNo)
            }
          })
          return amt
        }
        let amount = 0
        if (state.orderCoupons.cartCoupons && state.orderCoupons.cartCoupons.length > 0) {
          amount += couponAmt(state.orderCoupons.cartCoupons, payType)
        }
        if (state.orderCoupons.deliveryCoupons && state.orderCoupons.deliveryCoupons.length > 0) {
          amount += couponAmt(state.orderCoupons.deliveryCoupons, payType)
        }
        state.orderCoupons.products.forEach((item) => {
          amount += couponAmt(item.productCoupons, payType)
          amount += couponAmt(item.productPlusCoupons, payType)
        })
        return { paycoCoupons, amount }
      }
    },
    orderPaycoCouponCount (state) {
      if (state.orderCoupons) {
        const ret = {}
        let count = 0
        state.orderCoupons.products.forEach(item => {
          let itemCount = 0
          item.productCoupons.forEach(sub => {
            if (sub.limitPayType === 'PAYCO') {
              itemCount = 1
            }
          })
          item.productPlusCoupons.forEach(sub => {
            if (sub.limitPayType === 'PAYCO') {
              itemCount = 1
            }
          })
          count = count + itemCount
        })
        let cartPaycoCount = 0
        if (state.orderCoupons.cartCoupons && state.orderCoupons.cartCoupons.length > 0) {
          state.orderCoupons.cartCoupons.forEach(item => {
            if (item.limitPayType === 'PAYCO') {
              cartPaycoCount++
            }
          })
        }
        let deliveryPaycoCount = 0
        if (state.orderCoupons.deliveryCoupons && state.orderCoupons.deliveryCoupons.length > 0) {
          state.orderCoupons.deliveryCoupons.forEach(item => {
            if (item.limitPayType === 'PAYCO') {
              deliveryPaycoCount++
            }
          })
        }
        ret.paycoCount = count
        ret.cartPaycoCount = cartPaycoCount
        ret.deliveryPaycoCount = deliveryPaycoCount
        ret.otherCount = state.orderCoupons.products.length - count
        return ret
      }
    },
    orderinfoGetter (state, getters, rootState, rootGetters) {
      if (state.ordersheet) {
        const ordersheet = state.ordersheet.deliveryGroups
        const optionProduct = []
        ordersheet.forEach((orderGroup, idx) => {
          orderGroup.orderProducts.forEach((orderProduct, pidx) => {
            orderProduct.orderProductOptions.forEach((option) => {
              /** deliveryAmtText */
              // orderGroup.deliveryAmt = !orderGroup.deliveryAmt ? 0 : orderGroup.deliveryAmt
              let txt = ''
              if (orderGroup.deliveryAmt === 0) {
                txt = ''
              } else {
                if (orderGroup.deliveryPayType === 'PAY_ON_DELIVERY') {
                  txt = formatCurrency(orderGroup.deliveryAmt) + '원착불'
                } else {
                  txt = '배송비 ' + formatCurrency(orderGroup.deliveryAmt) + '원'
                }
              }
              if (pidx > 1) {
                // txt += ' (묶음배송)'
                option.gdelivery = '(묶음배송)'
              }

              option.deliveryAmtText = txt
              /** option name */
              option.optionText = getshowOptions(orderProduct.optionUsed, option.optionType, option.optionName, option.optionValue, option.optionInputs, option.price.addPrice, option.orderCnt)
              /** saleprice */
              option.price.optSalePrice = (option.price.salePrice + option.price.addPrice) * option.orderCnt
              /** DiscountAmt */
              option.price.discountAmt = (option.price.immediateDiscountAmt + option.price.additionalDiscountAmt) * option.orderCnt
              /** orderAmt */
              option.price.myPrice = option.price.optSalePrice - option.price.discountAmt

              option.brandName = orderProduct.brandName
              option.productName = orderProduct.productName
              optionProduct.push(option)
            })
          })
        })
        return optionProduct
      }
    },
    orderProductOptionNos: (state, getters) => {
      if (state.ordersheet) {
        const optNOs = []
        state.ordersheet.deliveryGroups.forEach((deliveryGroup) => {
          deliveryGroup.orderProducts.forEach((item) => {
            item.orderProductOptions.forEach((option) => {
              optNOs.push(option.optionNo)
            })
          })
        })
        return optNOs
      }
    },
    orderCoponsOptionCnt: (state) => {
      if (state.orderCoupons) {
        let productCnt = 0
        state.orderCoupons.products.forEach((item) => {
          productCnt += item.optionCnt
        })
        return productCnt
      }
    },
    hasProductCoupon: (state) => {
      if (state.orderCoupons) {
        let has = false
        state.orderCoupons.products.forEach(item => {
          if (item.productCoupons.length > 0 || item.productPlusCoupons.length > 0) {
            has = true
          }
        })
        return has
      }
    }
  }
}
