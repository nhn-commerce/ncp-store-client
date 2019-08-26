import { createNcpApiStore } from '@/api'
import { formatCurrency, getshowOptions } from '@/utils/StringUtils'
import qs from 'qs'
import Vue from 'vue'
import router from '@/router'
import cookies from 'js-cookie'

const apiStore = createNcpApiStore([
  {
    action: '_getCart',
    property: 'cart',
    path: 'cart'
  },
  {
    action: '_getGuestCart',
    property: 'cart',
    path: 'guest/cart',
    method: 'post'
  },
  {
    action: '_updateCart',
    property: 'result',
    path: 'cart',
    method: 'put'
  },
  {
    action: '_addCart',
    property: 'addcount',
    path: 'cart',
    method: 'post'
  },
  {
    action: '_countCart',
    property: 'count',
    path: 'cart/count'
  },
  {
    action: '_deleteCart',
    property: 'delcount',
    path: 'cart',
    method: 'delete',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_calculate',
    property: 'calculate',
    path: 'cart/calculate',
    method: 'get',
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    }
  },
  {
    action: '_calcGuestCart',
    property: 'calculate',
    path: 'guest/cart',
    method: 'post'
  }
])

export default {
  namespaced: true,
  state: {
    totalItemPrice: 0,
    totalDiscountAmount: 0,
    totalShippingCost: 0,
    paymentAmount: 0,
    checkOptions: [],
    invalidCount: 0,
    initFlg: true
  },
  mixins: [apiStore],
  actions: {
    async addToCart ({ state, dispatch, commit, rootState, rootGetters }, carts) {
      let ret = true
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        await dispatch('_addCart', { data: carts }).catch(e => {
          if (e.data.code === 'PPE0001') {
            ret = false
            router.go(0)
          }
        })
      } else {
        const preItems = JSON.parse(window.localStorage.cartInfo || '[]')
        preItems.push(...carts)
        window.localStorage.cartInfo = JSON.stringify(preItems)
      }
      await dispatch('fetchCartCount')
      return ret
    },
    async fetchCart ({ state, commit, dispatch, rootState, rootGetters }) {
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        await dispatch('_getCart')
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        if (items.length > 0) {
          await dispatch('_getGuestCart', { data: items })
        } else {
          state.cart = {}
        }
      }
      await commit('FORMAT_DATAS', { isLogined: (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') })
      if (state.initFlg) {
        state.initFlg = false
        await commit('CHECK_ALL', true)
      }
      await dispatch('calculate')
    },
    fetchCartCount ({ state, commit, dispatch, rootGetters, rootState }) {
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        dispatch('_countCart')
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        if (items.length > 0) {
          state.count = { count: items.length }
        } else {
          state.count = 0
        }
      }
    },
    async deleteCartByOptions ({ state, dispatch, commit, rootState, rootGetters }, options) {
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        const cartNo = options.map(option => option.cartNo)
        await dispatch('_deleteCart', { params: { cartNo } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !options.some(option => option.cartNo === item.cartNo)
          })
        )
      }
      options.forEach(option => {
        option.checked = false
        commit('CHECK_OPTION', option)
      })
      dispatch('fetchCart')
      dispatch('fetchCartCount')
    },
    async deleteCartByCartNos ({ state, dispatch, commit, rootState, rootGetters }, cartNo) {
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        await dispatch('_deleteCart', { params: { cartNo } })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        window.localStorage.cartInfo = JSON.stringify(
          items.filter(item => {
            return !cartNo.some(cartNo => cartNo === item.cartNo)
          })
        )
      }
      dispatch('fetchCart')
      dispatch('fetchCartCount')
    },
    async putCarts ({ state, dispatch, commit, rootState, rootGetters }, carts) {
      if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
        await dispatch('_updateCart', { data: carts })
      } else {
        const items = JSON.parse(window.localStorage.cartInfo || '[]')
        items.forEach(item => {
          carts.forEach(option => {
            if (item.cartNo === option.cartNo) {
              item.orderCnt = option.orderCnt
            }
          })
        })

        window.localStorage.cartInfo = JSON.stringify(items)
      }
      await dispatch('fetchCart')
    },
    async calculate ({ state, commit, dispatch, rootState, rootGetters }) {
      if (state.checkOptions.length > 0) {
        if (rootGetters.isLogined && cookies.get('ncpMemberAgree') === 'Y' && cookies.get('memberStatus') !== 'WAITING') {
          const cartNo = state.checkOptions.map(option => option.cartNo)
          await dispatch('_calculate', { params: { cartNo } })
          if (state.calculate) {
            state.totalItemPrice = state.calculate.standardAmt
            state.totalDiscountAmount = state.calculate.discountAmt
            state.totalShippingCost = state.calculate.totalPrePaidDeliveryAmt
            state.paymentAmount = state.calculate.totalAmt
          }
        } else {
          await dispatch('_calcGuestCart', { data: state.checkOptions })
          if (state.calculate) {
            state.totalItemPrice = state.calculate.price.standardAmt
            state.totalDiscountAmount = state.calculate.price.discountAmt
            state.totalShippingCost = state.calculate.price.totalPrePaidDeliveryAmt
            state.paymentAmount = state.calculate.price.totalAmt
          }
        }
      } else {
        state.totalItemPrice = 0
        state.totalDiscountAmount = 0
        state.totalShippingCost = 0
        state.paymentAmount = 0
      }
    }
  },
  getters: {
    allChecked (state) {
      let allChecked = false
      if (state.count) {
        if ((state.count.count - state.invalidCount) === state.checkOptions.length) {
          allChecked = true
        }
      }
      return allChecked
    },
    havePayOnDelivery (state) {
      let have = false
      if (state.checkOptions) {
        have = state.checkOptions.some(item => item.payOnDelivery)
      }
      return have
    }
  },
  mutations: {
    CHECK_OPTION (state, option) {
      if (option.checked) {
        state.checkOptions.push(option)
      } else {
        state.checkOptions = state.checkOptions.filter(item => item.cartNo !== option.cartNo)
      }
    },
    CHECK_ALL (state, flg) {
      state.checkOptions = []
      if (flg && state.cart && state.cart.deliveryGroups) {
        // deliveryGroups
        state.cart.deliveryGroups.forEach(deliveryGroup => {
          // orderProducts
          deliveryGroup.orderProducts.forEach(orderProduct => {
            // orderProductOptions
            orderProduct.orderProductOptions.forEach(option => {
              const checkOption = {
                cartNo: option.cartNo,
                productNo: option.productNo,
                optionNo: option.optionNo,
                orderCnt: option.orderCnt,
                optionInputs: option.optionInputs,
                payOnDelivery: option.payOnDelivery
              }
              state.checkOptions.push(checkOption)
            })
          })
        })
      }
    },
    FORMAT_DATAS (state, { isLogined }) {
      state.invalidCount = 0
      if (state.cart && state.cart.deliveryGroups && state.cart.deliveryGroups.length > 0) {
        // deliveryGroups
        state.cart.deliveryGroups.forEach((deliveryGroup) => {
          // orderProducts
          deliveryGroup.orderProducts.forEach((orderProduct, productIdx) => {
            // orderProductOptions
            orderProduct.orderProductOptions.forEach((orderProductOption, optionIdx) => {
              Vue.set(orderProductOption, 'idx', 'check_' + orderProductOption.cartNo)

              // orderProductOption
              orderProductOption.brandName = orderProduct.brandName
              orderProductOption.productName = orderProduct.productName

              // 옵션선택정보
              let price = orderProductOption.price
              orderProductOption.showOptions = getshowOptions(orderProduct.optionUsed, orderProductOption.optionType, orderProductOption.optionName, orderProductOption.optionValue, orderProductOption.optionInputs, price.addPrice)

              // 옵션 상품 주문금액
              orderProductOption.showPrice = formatCurrency(price.buyAmt)

              // 배송비
              if (orderProduct.deliverable) {
                if (deliveryGroup.deliveryAmt === 0) {
                  orderProductOption.showShippingFee = '배송비 무료'
                } else {
                  if (deliveryGroup.deliveryPayType === 'PAY_ON_DELIVERY') {
                    orderProductOption.payOnDelivery = true
                    orderProductOption.showShippingFee = formatCurrency(deliveryGroup.deliveryAmt) + '원착불'
                  } else {
                    orderProductOption.showShippingFee = '배송비 ' + formatCurrency(deliveryGroup.deliveryAmt) + '원'
                  }
                }
                if (orderProduct.orderProductOptions.length > 1 || deliveryGroup.orderProducts.length > 1) {
                  orderProductOption.bundledFlg = true
                } else {
                  orderProductOption.bundledFlg = false
                }
                if (productIdx === 0 && optionIdx === 0) {
                  orderProductOption.bundledFirst = true
                } else {
                  orderProductOption.bundledFirst = false
                }
              }

              // 상품금액
              orderProductOption.showStandardAmt = formatCurrency(price.standardAmt)
              // 할인금액
              orderProductOption.showDiscountAmt = formatCurrency((price.immediateDiscountAmt + price.additionalDiscountAmt) * orderProductOption.orderCnt)

              // 환불불가
              orderProductOption.refundable = orderProduct.refundable
            })
          })
        })
      }

      if (state.cart && state.cart.invalidProducts && state.cart.invalidProducts.length > 0) {
        // product
        state.cart.invalidProducts.forEach(product => {
          // orderProductOptions
          product.orderProductOptions.forEach(option => {
            state.invalidCount += 1
            Vue.set(option, 'idx', 'check_' + option.cartNo)

            // orderProductOption
            option.brandName = product.brandName
            option.productName = product.productName

            // 옵션선택정보
            option.showOptions = getshowOptions(product.optionUsed, option.optionType, option.optionName, option.optionValue, option.optionInputs, option.price.addPrice)
          })
        })
      }
    },
    SET_INIT (state) {
      state.initFlg = true
    }
  }
}
