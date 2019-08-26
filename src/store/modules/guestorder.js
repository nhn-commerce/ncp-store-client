import { createNcpApiStore } from '@/api'
import Vue from 'vue'
import { formatCurrency, telnoFormat, getshowOptions } from '@/utils/StringUtils'
import { getStrDate } from '@/utils/dateUtils'
import cookies from 'js-cookie'
import ncpApi from '@/api/ncpApi'
import router from '@/router'
import config from '@/config'

const apiStore = createNcpApiStore([
  {
    action: '_getGuestOrder',
    property: 'guestorder',
    path: 'guest/orders/{orderNo}',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_getPassword',
    path: 'guest/orders/{orderNo}/forgot-password',
    pathParams: ['orderNo'],
    method: 'get',
    queryParams: true
  },
  {
    action: '_editDeliveries',
    property: 'deliverie',
    path: 'guest/orders/{orderNo}/deliveries',
    pathParams: ['orderNo'],
    method: 'put'
  },
  {
    action: '_getGuestClaim',
    property: 'guestClaim',
    path: 'guest/order-options/{orderOptionNo}/claim',
    pathParams: ['orderOptionNo'],
    method: 'get',
    queryParams: true
  },
  {
    action: '_multipleGuestClaimEstimate',
    property: 'multipleGuestClaimEstimate',
    path: 'guest/claim/estimate',
    method: 'post'
  },
  {
    action: '_multipleGuestClaimReturn',
    property: 'multipleGuestClaimReturn',
    path: 'guest/claims/return',
    method: 'post'
  },
  {
    action: '_postOrderOptionClaimCancel',
    path: 'guest/order-options/{orderOptionNo}/claim/cancel',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_postGuestClaimReturn',
    path: 'guest/order-options/{orderOptionNo}/claim/return',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_getClaimResult',
    property: 'claimResult',
    path: 'guest/order-options/{orderOptionNo}/claim/result',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_getMultipleGuestClaimResult',
    property: 'multipleGuestClaimResult',
    path: 'guest/claims/{claimNo}/result',
    pathParams: ['claimNo']
  },
  {
    action: '_putGuestClaimWithdraw',
    path: 'guest/claims/{claimNo}/withdraw',
    pathParams: ['claimNo'],
    method: 'put'
  },
  {
    action: '_getGuestClaimEstimate',
    property: 'guestClaimEstimate',
    path: 'guest/order-options/{orderOptionNo}/claim/estimate',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_getGuestOrderDetail',
    property: 'order',
    path: 'guest/orders/{orderNo}',
    pathParams: ['orderNo'],
    method: 'get'
  }
])

export default {
  namespaced: true,
  state: {
    responsibleObjectTypelabel: `${config.mallName} 판매자가 배송비를 부담합니다`
  },
  mixins: [apiStore],
  actions: {
    async getGuestOrder ({ state, commit, dispatch }, { orderNo, password }) {
      await dispatch('_getGuestOrder', { data: { orderRequestType: 'ALL', password }, params: { orderNo } })
      cookies.set('guestToken', state.guestorder.guestToken)
      ncpApi.defaults.headers.guestToken = state.guestorder.guestToken
      return state.guestorder.orderNo
    },
    async getPassword ({ commit, dispatch, rootState }, noneMeberParams) {
      await dispatch('_getPassword', { params: noneMeberParams })
    },
    async editDeliveries ({ state, dispatch, commit, rootState }, deliveriesParam) {
      await dispatch('_editDeliveries', { data: deliveriesParam.addressRequest, params: { add: false, orderNo: deliveriesParam.orderNo } })
    },
    async getGuestClaim ({ state, commit, dispatch }, { claimParams }) {
      await dispatch('_getGuestClaim', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType } })
      commit('INIT_MULTIPLE_CLAIM_ESTIMATE')
      commit('GUESTCLAIM_PRICE_OPTION')
    },
    postOrderOptionClaimCancel ({ state, dispatch, commit, rootState }, cancelparam) {
      return dispatch('_postOrderOptionClaimCancel', { data: cancelparam, params: { orderOptionNo: cancelparam.orderOptionNo } })
    },
    postGuestClaimReturn ({ state, dispatch, commit, rootState }, returntparam) {
      return dispatch('_postGuestClaimReturn', { data: returntparam, params: { orderOptionNo: returntparam.orderOptionNo } })
    },
    async getGuestClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      await dispatch('_getClaimResult', { params: { orderOptionNo: claimParams.orderOptionNo } })
      commit('FORMAT_CLAIM_RESULT')
    },
    async getGuestMultipleClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      await dispatch('_getMultipleGuestClaimResult', { params: { claimNo: claimParams.claimNo } })
      commit('FORMAT_MULTIPLE_CLAIM_RESULT')
    },
    async putGuestClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
      await dispatch('_putGuestClaimWithdraw', { data: withdrawparam, params: { claimNo: withdrawparam.claimNo } })
    },
    async getGuestCancelEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getGuestClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType } })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimParams.claimReasonType)
    },
    async getGuestReturnEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getGuestClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType, returnWayType: 'SELLER_COLLECT' } })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimParams.claimReasonType)
    },
    async multipleGuestClaimEstimate ({ state, commit, dispatch }, claimRequest) {
      if (claimRequest.claimReasonType !== '') {
        await dispatch('_multipleGuestClaimEstimate', { data: claimRequest })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimRequest.claimReasonType)
    },
    multipleGuestClaimReturn ({ state, dispatch, commit, rootState }, claimRequest) {
      return dispatch('_multipleGuestClaimReturn', { data: claimRequest })
    },
    async getGuestOrderDetail ({ state, commit, dispatch }, orderNo) {
      await dispatch('_getGuestOrderDetail', { data: { orderRequestType: 'ALL' }, params: { orderNo } }).catch(e => {
        router.push({
          path: '/member/nonemember/ordersearch'
        })
      })
      commit('FORMAT_ORDER', commit)
    }
  },
  mutations: {
    FORMAT_ORDER (state, commit) {
      if (state.order) {
        Vue.set(state.order, 'showYmd', getStrDate(state.order.orderYmdt, '.'))
        state.order.memberFlg = false

        let contacts = telnoFormat(state.order.orderer.ordererContact1)
        state.order.orderer.contact1 = contacts[0]
        state.order.orderer.contact2 = contacts[1]
        state.order.orderer.contact3 = contacts[2]

        if (state.order.payInfo && state.order.payInfo.cardInfo) {
          const cardInfo = state.order.payInfo.cardInfo
          if (cardInfo.installmentPeriod > 0) {
            if (cardInfo.noInterest) {
              cardInfo.installmentLabel = cardInfo.installmentPeriod + '개월 무이자'
            } else {
              cardInfo.installmentLabel = cardInfo.installmentPeriod + '개월'
            }
          } else {
            cardInfo.installmentLabel = '일시불'
          }
        }

        let showLabelFlg = true
        let showButtonFlg = true

        state.order.showOptions = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            delivery.orderOptions.forEach(option => {
              commit('FORMAT_OPTION', option)

              state.order.showOptions.push(option)

              if (option.claimStatusType || (option.orderStatusType !== 'PRODUCT_PREPARE' && option.orderStatusType !== 'DELIVERY_PREPARE')) {
                showLabelFlg = false
              }
              if (option.claimStatusType || option.orderStatusType !== 'PAY_DONE') {
                showButtonFlg = false
              }
            })
          })
        })
        const firstamt = state.order.firstOrderAmount
        const showPriceInfo = {}
        showPriceInfo.showStandardAmt = formatCurrency(firstamt.standardAmt)
        showPriceInfo.totalDisAmt = formatCurrency(firstamt.additionalDiscountAmt + firstamt.immediateDiscountAmt + firstamt.cartCouponDiscountAmt + firstamt.productCouponDiscountAmt)
        showPriceInfo.immDisAmt = formatCurrency(firstamt.immediateDiscountAmt)
        showPriceInfo.addDisAmt = formatCurrency(firstamt.additionalDiscountAmt)
        showPriceInfo.proCouDisAmt = formatCurrency(firstamt.productCouponDiscountAmt)
        showPriceInfo.cartCouDisAmt = formatCurrency(firstamt.cartCouponDiscountAmt)
        showPriceInfo.totalDeliveryAmt = formatCurrency((firstamt.deliveryAmt - firstamt.deliveryCouponDiscountAmt) + firstamt.remoteDeliveryAmt)
        showPriceInfo.deliveryAmt = formatCurrency(firstamt.deliveryAmt)
        showPriceInfo.delCouDisAmt = formatCurrency(firstamt.deliveryCouponDiscountAmt)
        showPriceInfo.remDelAmt = formatCurrency(firstamt.remoteDeliveryAmt)
        showPriceInfo.payAmt = formatCurrency(firstamt.payAmt)

        if (state.order.refundInfos) {
          const refundInfos = state.order.refundInfos
          let claimProductAmt = 0
          let claimSubtractionAmt = 0
          let claimDeliveryAmt = 0
          let refundPayAmt = 0
          refundInfos.forEach(refundInfo => {
            claimProductAmt += refundInfo.productAmtInfo.totalAmt
            claimSubtractionAmt += refundInfo.subtractionAmtInfo.totalAmt
            claimDeliveryAmt += refundInfo.deliveryAmtInfo.totalAmt
            refundPayAmt += refundInfo.refundPayAmt
          })
          showPriceInfo.claimProductAmt = formatCurrency(claimProductAmt)
          showPriceInfo.claimSubtractionAmt = formatCurrency(claimSubtractionAmt)
          showPriceInfo.claimDeliveryAmt = formatCurrency(claimDeliveryAmt)
          showPriceInfo.refundPayAmt = formatCurrency(refundPayAmt)
        }

        state.order.showPriceInfo = showPriceInfo

        const orderAddress = state.order.shippingAddress

        contacts = telnoFormat(orderAddress.receiverContact1)
        Vue.set(orderAddress, 'contact1_1', contacts[0])
        Vue.set(orderAddress, 'contact1_2', contacts[1])
        Vue.set(orderAddress, 'contact1_3', contacts[2])
        contacts = telnoFormat(orderAddress.receiverContact2)
        Vue.set(orderAddress, 'contact2_1', contacts[0])
        Vue.set(orderAddress, 'contact2_2', contacts[1])
        Vue.set(orderAddress, 'contact2_3', contacts[2])

        orderAddress.deliveryMemo = state.order.deliveryMemo
        orderAddress.orderNo = state.order.orderNo
        orderAddress.showLabelFlg = showLabelFlg
        orderAddress.showButtonFlg = showButtonFlg

        state.order.orderAddress = orderAddress
      }
    },
    FORMAT_OPTION (state, option) {
      option.showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, option.orderCnt)

      option.buttons = []
      if (option.claimStatusType) {
        if (option.claimStatusType === 'CANCEL_REQUEST' || option.claimStatusType === 'CANCEL_PROC_REQUEST_REFUND' || option.claimStatusType === 'CANCEL_PROC_WAITING_REFUND') {
          option.statusLabel = '취소처리중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_CLAIM') {
              option.buttonCount += 1
              option.buttons.push('CANCEL_VIEW_CLAIM')
            } else if (nextAction.nextActionType === 'WITHDRAW_CANCEL') {
              option.buttonCount += 1
              option.buttons.push('WITHDRAW_CANCEL')
            }
          })
        } else if (option.claimStatusType === 'CANCEL_NO_REFUND' || option.claimStatusType === 'CANCEL_DONE') {
          option.statusLabel = '취소완료'
          option.buttonCount = 1
          option.buttons.push('CANCEL_VIEW_CLAIM')
        } else if (option.claimStatusType === 'RETURN_REQUEST' || option.claimStatusType === 'RETURN_REJECT_REQUEST' || option.claimStatusType === 'RETURN_PROC_BEFORE_RECEIVE' || option.claimStatusType === 'RETURN_PROC_REQUEST_REFUND' || option.claimStatusType === 'RETURN_PROC_WAITING_REFUND') {
          option.statusLabel = '반품처리중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_CLAIM') {
              option.buttonCount += 1
              option.buttons.push('RETURN_VIEW_CLAIM')
            } else if (nextAction.nextActionType === 'WITHDRAW_RETURN') {
              option.buttonCount += 1
              option.buttons.push('WITHDRAW_RETURN')
            }
          })
        } else if (option.claimStatusType === 'RETURN_DONE') {
          option.statusLabel = '반품완료'
          option.buttonCount = 1
          option.buttons.push('RETURN_VIEW_CLAIM')
        }
      } else {
        if (option.orderStatusType === 'PAY_DONE') {
          option.statusLabel = '결제완료'
          option.buttonCount = 1
          if (option.refundable) {
            option.buttons.push('CANCEL')
          } else {
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'PRODUCT_PREPARE') {
          option.statusLabel = '상품준비중'
          option.buttonCount = 1
          if (option.refundable) {
            option.buttons.push('CANCEL')
          } else {
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'DELIVERY_PREPARE') {
          option.statusLabel = '배송준비중'
          option.buttonCount = 1
          if (option.refundable) {
            option.buttons.push('CANCEL')
          } else {
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'DELIVERY_ING') {
          option.statusLabel = '배송중'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_DELIVERY') {
              option.buttonCount += 1
              option.buttons.push('VIEW_DELIVERY')
            } else if (nextAction.nextActionType === 'RETURN') {
              option.buttonCount += 1
              option.buttons.push('RETURN')
            }
          })
          if (option.deliverable && !option.refundable) {
            option.buttonCount += 1
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'DELIVERY_DONE') {
          option.statusLabel = '배송완료'
          option.buttonCount = 0
          option.nextActions.forEach(nextAction => {
            if (nextAction.nextActionType === 'VIEW_DELIVERY') {
              option.buttonCount += 1
              option.buttons.push('VIEW_DELIVERY')
            } else if (nextAction.nextActionType === 'RETURN') {
              option.buttonCount += 1
              option.buttons.push('RETURN')
            }
          })
          if (option.deliverable && !option.refundable) {
            option.buttonCount += 1
            option.buttons.push('NOT_REFUNDABLE')
          }
        } else if (option.orderStatusType === 'BUY_CONFIRM') {
          option.statusLabel = '구매완료'
          option.buttonCount = 1
        }
      }
      Vue.set(option, 'showPrice', formatCurrency(option.price.buyAmt))
    },
    GUESTCLAIM_PRICE_OPTION (state) {
      if (state.guestClaim) {
        const option = state.guestClaim.originalOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, state.guestClaim.originalOption.orderCnt)
        Vue.set(state.guestClaim, 'showOptions', showOptions)
        if (state.guestClaim.returnAddress) {
          const showReturnAddress = state.guestClaim.returnAddress
          let contacts = telnoFormat(state.guestClaim.returnAddress.receiverContact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.guestClaim.returnAddress.receiverContact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.guestClaim.showReturnAddress = showReturnAddress
        }
        state.responsibleObjectTypelabel = ''
        state.guestClaimEstimate = null
      }
    },
    FORMAT_CLAIM_RESULT (state) {
      if (state.claimResult) {
        const option = state.claimResult.claimedOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, state.claimResult.claimedOption.orderCnt)

        Vue.set(state.claimResult, 'showOptions', showOptions)
        if (state.claimResult.returnAddress) {
          const showReturnAddress = state.claimResult.returnAddress
          let contacts = telnoFormat(state.claimResult.returnAddress.contact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.claimResult.returnAddress.contact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.claimResult.showReturnAddress = showReturnAddress
        }
      }
    },
    FORMAT_MULTIPLE_CLAIM_RESULT (state) {
      if (state.multipleGuestClaimResult) {
        const option = state.multipleGuestClaimResult.claimedOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, state.multipleGuestClaimResult.claimedOption.orderCnt)
        Vue.set(state.multipleGuestClaimResult.claimedOption, 'showOptions', showOptions)

        const multiple = state.multipleGuestClaimResult.claimedOptions
        multiple.forEach((opt, index) => {
          const multipleOptions = getshowOptions(opt.optionUsed, opt.optionType, opt.optionName, opt.optionValue, opt.inputs, opt.price.addPrice, opt.orderCnt)
          Vue.set(state.multipleGuestClaimResult.claimedOptions[index], 'showOptions', multipleOptions)
        })

        Vue.set(state.multipleGuestClaimResult, 'showOptions', showOptions)
        if (state.multipleGuestClaimResult.returnAddress) {
          const showReturnAddress = state.multipleGuestClaimResult.returnAddress
          let contacts = telnoFormat(state.multipleGuestClaimResult.returnAddress.contact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.multipleGuestClaimResult.returnAddress.contact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.multipleGuestClaimResult.showReturnAddress = showReturnAddress
        }
      }
    },
    GET_RESPONSIBLEOBJECTTYPE (state, claimReasonType) {
      if (state.guestClaim && claimReasonType !== '') {
        let claimReasonTypeInfo = {}
        state.guestClaim.claimReasonTypes.forEach(ctypeInfo => {
          if (ctypeInfo.claimReasonType === claimReasonType) {
            claimReasonTypeInfo = ctypeInfo
          }
        })
        if (claimReasonTypeInfo) {
          if (claimReasonTypeInfo.responsibleObjectType === 'SELLER') {
            state.responsibleObjectTypelabel = `${config.mallName} 판매자가 배송비를 부담합니다`
          } else if (claimReasonTypeInfo.responsibleObjectType === 'BUYER') {
            state.responsibleObjectTypelabel = '구매자님께서 배송비를 부담합니다'
          }
        }
      } else {
        state.responsibleObjectTypelabel = ''
        state.guestClaimEstimate = null
      }
    },
    INIT_MULTIPLE_CLAIM_ESTIMATE (state) {
      if (state.multipleGuestClaimEstimate !== null) {
        state.multipleGuestClaimEstimate = null
      }
    }
  },
  getters: {
    returnInfo (state) {
      if (state.guestClaim) {
        const option = state.guestClaim.originalOption
        let param = {}
        if (option.orderStatueType !== 'BUY_CONFIRM' && option.refundable) {
          param.orderProductOptionNo = option.orderOptionNo
          param.productCnt = option.orderCnt
        }
        const claimParams = []
        claimParams.push(param)
        const multiple = state.guestClaim.claimableOptions
        multiple.forEach((opt, index) => {
          if (opt.orderStatusType !== 'BUY_CONFIRM' && opt.refundable) {
            param = {}
            param.orderProductOptionNo = opt.orderOptionNo
            param.productCnt = 0
            claimParams.push(param)
          }
        })
        return claimParams
      }
    },
    viewableClaimOptions (state) {
      if (state.guestClaim) {
        const claimParams = []
        const multiple = state.guestClaim.claimableOptions
        multiple.forEach((opt, index) => {
          if (opt.orderStatusType !== 'BUY_CONFIRM' && opt.refundable) {
            claimParams.push(opt)
          }
        })
        return claimParams
      }
    }
  }
}
