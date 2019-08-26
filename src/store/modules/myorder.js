import { createNcpApiStore } from '@/api'
import { formatCurrency, telnoFormat, getshowOptions } from '@/utils/StringUtils'
import { getToday, getFirstAndEndDay, addMonth, getStrDate, getSixMonths } from '@/utils/dateUtils'
import cookies from 'js-cookie'
import qs from 'qs'
import Vue from 'vue'
import config from '@/config'

const defaultParams = {
  'orderRequestTypes': null,
  'pageNumber': 1,
  'pageSize': 10,
  'hasTotalCount': true,
  'startYmd': null,
  'endYmd': null
}

const apiStore = createNcpApiStore([
  {
    action: '_getOrder',
    property: 'order',
    path: 'profile/orders/{orderNo}',
    pathParams: ['orderNo']
  },
  {
    action: '_getOrderList',
    property: 'orders',
    path: 'profile/orders',
    method: 'get',
    queryParams: true,
    onSuccess (state, payload) {
      state.orders = [...state.orders || [], ...payload.data.items]
      state.totalCount = payload.data.totalCount
    },
    requestConfig: {
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
    },
    cacheable: false,
    cacheMaxAge: 1000 * 30
  },
  {
    action: '_getClaimOrderOption',
    property: 'claimOrderOption',
    path: 'profile/order-options/{orderOptionNo}/claim',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_getClaimEstimate',
    property: 'claimEstimate',
    path: 'profile/order-options/{orderOptionNo}/claim/estimate',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_multipleClaimEstimate',
    property: 'multipleClaimEstimate',
    path: 'profile/claim/estimate',
    method: 'post'
  },
  {
    action: '_multipleClaimReturn',
    property: 'multipleClaimReturn',
    path: 'profile/claim/return',
    method: 'post'
  },
  {
    action: '_postOrderClaimCancel',
    path: 'profile/orders/{orderNo}/claim/cancel',
    pathParams: ['orderNo'],
    method: 'post'
  },
  {
    action: '_postOrderOptionClaimReturn',
    path: 'profile/order-options/{orderOptionNo}/claim/return',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_postOrderOptionClaimCancel',
    path: 'profile/order-options/{orderOptionNo}/claim/cancel',
    pathParams: ['orderOptionNo'],
    method: 'post'
  },
  {
    action: '_putOrderOptionClaimWithdraw',
    path: 'profile/claims/{claimNo}/withdraw',
    pathParams: ['claimNo'],
    method: 'put'
  },
  {
    action: '_getClaimResult',
    property: 'claimResult',
    path: 'profile/order-options/{orderOptionNo}/claim/result',
    pathParams: ['orderOptionNo']
  },
  {
    action: '_getMultipleClaimResult',
    property: 'multipleClaimResult',
    path: 'profile/claims/{claimNo}/result',
    pathParams: ['claimNo']
  },
  {
    action: '_editDeliveries',
    property: 'deliverie',
    path: 'profile/orders/{orderNo}/deliveries',
    pathParams: ['orderNo'],
    method: 'put'
  }
])

export default {
  namespaced: true,
  state: {
    oldOrder: cookies.get('oldOrder') === 'Y',
    sixMonths: [],
    fetchListParams: {},
    totalCount: null,
    loading: true,
    selectTypeFlg: 'one_month',
    responsibleObjectTypelabel: ''
  },
  mixins: [apiStore],
  actions: {
    getOrder ({ state, commit, dispatch, rootState }, orderNo) {
      if (!rootState.memberIsLogin() || !orderNo) {
        return
      }
      dispatch('_getOrder', { params: { orderNo } })
    },
    async getOrderList ({ state, commit, dispatch }, { type, to }) {
      type = to.query.type || type
      const month = to.query.month
      const period = to.query.period
      state.selectTypeFlg = 'one_month'
      if (month || month === 0) {
        state.selectTypeFlg = month
      }
      if (period) {
        state.selectTypeFlg = period
      }

      commit('RESET_LIST')
      if (month === undefined || month === '' || month === null) {
        if (period === 'six_month') {
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -6),
            endYmd: getToday()
          })
        } else if (period === 'three_month') {
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -3),
            endYmd: getToday()
          })
        } else {
          // period === 'one_month'
          commit('SET_PARAMS', {
            startYmd: addMonth(new Date(), -1),
            endYmd: getToday()
          })
        }
      } else {
        commit('SET_PARAMS', {
          ...getFirstAndEndDay(month)
        })
      }

      if (type === 'ORDER') {
        commit('SET_PARAMS', {
          orderRequestTypes: [
            'DEPOSIT_WAIT',
            'PAY_DONE',
            'PRODUCT_PREPARE',
            'DELIVERY_PREPARE',
            'DELIVERY_ING',
            'DELIVERY_DONE',
            'BUY_CONFIRM'
          ]
        })
      } else {
        commit('SET_PARAMS', {
          orderRequestTypes: [
            'CANCEL_DONE',
            'RETURN_DONE',
            'EXCHANGE_DONE',
            'CANCEL_PROCESSING',
            'RETURN_PROCESSING',
            'EXCHANGE_PROCESSING'
          ]
        })
      }

      await dispatch('_getOrderList', { params: state.fetchListParams })
      commit('FORMAT_ORDERLIST', commit)
    },
    async fetchMore ({ state, dispatch, commit, rootState }, payload) {
      commit('SET_PARAMS', {
        pageNumber: state.fetchListParams.pageNumber + 1
      })
      await dispatch('_getOrderList', { params: state.fetchListParams })
      if (state.orders.length >= state.totalCount) {
        state.loading = false
      }
      commit('FORMAT_ORDERLIST', commit)
    },
    async getClaimOrderOption ({ state, commit, dispatch }, { claimParams }) {
      await dispatch('_getClaimOrderOption', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType } })
      commit('INIT_MULTIPLE_CLAIM_ESTIMATE')
      commit('CALCULATE_ORDER_OPTION')
    },
    async getCancelEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType } })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimParams.claimReasonType)
    },
    async getReturnEstimate ({ state, commit, dispatch }, claimParams) {
      if (claimParams.claimReasonType !== '') {
        await dispatch('_getClaimEstimate', { params: { orderOptionNo: claimParams.orderOptionNo, claimType: claimParams.claimType, productCnt: claimParams.productCnt, claimReasonType: claimParams.claimReasonType, returnWayType: 'SELLER_COLLECT' } })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimParams.claimReasonType)
    },
    async multipleClaimEstimate ({ state, commit, dispatch }, claimRequest) {
      if (claimRequest.claimReasonType !== '') {
        await dispatch('_multipleClaimEstimate', { data: claimRequest })
      }
      commit('GET_RESPONSIBLEOBJECTTYPE', claimRequest.claimReasonType)
    },
    multipleClaimReturn ({ state, dispatch, commit, rootState }, claimRequest) {
      return dispatch('_multipleClaimReturn', { data: claimRequest })
    },
    postOrderOptionClaimReturn ({ state, dispatch, commit, rootState }, returntparam) {
      return dispatch('_postOrderOptionClaimReturn', { data: returntparam, params: { orderOptionNo: returntparam.orderOptionNo } })
    },
    postOrderOptionClaimCancel ({ state, dispatch, commit, rootState }, cancelparam) {
      return dispatch('_postOrderOptionClaimCancel', { data: cancelparam, params: { orderOptionNo: cancelparam.orderOptionNo } })
    },
    postOrderClaimCancel ({ state, dispatch, commit, rootState }, cancelparam) {
      let orderNo = cancelparam.orderNo
      delete cancelparam.orderNo
      return dispatch('_postOrderClaimCancel', { data: cancelparam, params: { orderNo: orderNo } })
    },
    async getOrderDetail ({ state, commit, dispatch }, orderNo) {
      await dispatch('_getOrder', { params: { orderNo } })
      commit('FORMAT_ORDER', commit)
    },
    async putOrderOptionClaimWithdraw ({ state, dispatch, commit, rootState }, withdrawparam) {
      await dispatch('_putOrderOptionClaimWithdraw', { data: withdrawparam, params: { claimNo: withdrawparam.claimNo } })
    },
    async getClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      await dispatch('_getClaimResult', { params: { orderOptionNo: claimParams.orderOptionNo } })
      commit('FORMAT_CLAIM_RESULT')
    },
    async getMultipleClaimResult ({ state, dispatch, commit, rootState }, { claimParams }) {
      await dispatch('_getMultipleClaimResult', { params: { claimNo: claimParams.claimNo } })
      commit('FORMAT_MULTIPLE_CLAIM_RESULT')
    },
    async editDeliveries ({ state, dispatch, commit, rootState }, deliveriesParam) {
      await dispatch('_editDeliveries', { data: deliveriesParam.addressRequest, params: { add: false, orderNo: deliveriesParam.orderNo } })
    }
  },
  mutations: {
    RESET_LIST (state) {
      state.orders = null
      state.totalCount = null
      state.loading = true
      state.fetchListParams = defaultParams
    },
    SET_PARAMS (state, params) {
      state.fetchListParams = {
        ...state.fetchListParams,
        ...params
      }
    },
    CALCULATE_ORDER_OPTION (state) {
      if (state.claimOrderOption) {
        state.claimParams = []
        const option = state.claimOrderOption.originalOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, option.orderCnt)
        Vue.set(state.claimOrderOption.originalOption, 'showOptions', showOptions)
        // let param = {}
        // param.orderOptionNo = option.orderOptionNo
        // param.orderCnt = option.orderCnt
        // state.claimParams.push(param)

        const multiple = state.claimOrderOption.claimableOptions
        multiple.forEach((opt, index) => {
          const multipleOptions = getshowOptions(opt.optionUsed, opt.optionType, opt.optionName, opt.optionValue, opt.inputs, opt.price.addPrice, opt.orderCnt)
          Vue.set(state.claimOrderOption.claimableOptions[index], 'showOptions', multipleOptions)
          // param = {}
          // param.orderOptionNo = opt.orderOptionNo
          // param.orderCnt = opt.orderCnt
          // state.claimParams.push(param)
        })

        if (state.claimOrderOption.returnAddress) {
          const showReturnAddress = state.claimOrderOption.returnAddress
          let contacts = telnoFormat(state.claimOrderOption.returnAddress.receiverContact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.claimOrderOption.returnAddress.receiverContact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.claimOrderOption.showReturnAddress = showReturnAddress
        }
        state.responsibleObjectTypelabel = ''
        state.claimEstimate = null
      }
    },
    FORMAT_CLAIM_RESULT (state) {
      if (state.claimResult) {
        const option = state.claimResult.claimedOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, option.orderCnt)
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
      if (state.multipleClaimResult) {
        const option = state.multipleClaimResult.claimedOption
        const showOptions = getshowOptions(option.optionUsed, option.optionType, option.optionName, option.optionValue, option.inputs, option.price.addPrice, option.orderCnt)
        Vue.set(state.multipleClaimResult.claimedOption, 'showOptions', showOptions)

        const multiple = state.multipleClaimResult.claimedOptions
        multiple.forEach((opt, index) => {
          const multipleOptions = getshowOptions(opt.optionUsed, opt.optionType, opt.optionName, opt.optionValue, opt.inputs, opt.price.addPrice, opt.orderCnt)
          Vue.set(state.multipleClaimResult.claimedOptions[index], 'showOptions', multipleOptions)
        })

        if (state.multipleClaimResult.returnAddress) {
          const showReturnAddress = state.multipleClaimResult.returnAddress
          let contacts = telnoFormat(state.multipleClaimResult.returnAddress.contact1)
          Vue.set(showReturnAddress, 'contact1_1', contacts[0])
          Vue.set(showReturnAddress, 'contact1_2', contacts[1])
          Vue.set(showReturnAddress, 'contact1_3', contacts[2])
          contacts = telnoFormat(state.multipleClaimResult.returnAddress.contact2)
          Vue.set(showReturnAddress, 'contact2_1', contacts[0])
          Vue.set(showReturnAddress, 'contact2_2', contacts[1])
          Vue.set(showReturnAddress, 'contact2_3', contacts[2])
          state.multipleClaimResult.showReturnAddress = showReturnAddress
        }
      }
    },
    FORMAT_ORDER (state, commit) {
      if (state.order) {
        Vue.set(state.order, 'showYmd', getStrDate(state.order.orderYmdt, '.'))

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
            if (delivery.deliveryPayType === 'PAY_ON_DELIVERY') {
              Vue.set(state.order, 'payOnDelivery', true)
            }
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
        let contacts = telnoFormat(orderAddress.receiverContact1)
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
    FORMAT_ORDERLIST (state, commit) {
      state.sixMonths = getSixMonths()

      if (state.orders && state.orders.length > 0) {
        state.orders.forEach(order => {
          Vue.set(order, 'showYmd', getStrDate(order.orderYmdt, '.'))

          order.orderOptions.forEach(option => {
            commit('FORMAT_OPTION', option)
          })
        })
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
            } else if (nextAction.nextActionType === 'WRITE_REVIEW') {
              option.buttonCount += 1
              option.buttons.push('WRITE_REVIEW')
            } else if (nextAction.nextActionType === 'RETURN' && option.refundable) {
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
            } else if (nextAction.nextActionType === 'WRITE_REVIEW') {
              option.buttonCount += 1
              option.buttons.push('WRITE_REVIEW')
            } else if (nextAction.nextActionType === 'RETURN' && option.refundable) {
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
          if (option.nextActions.length === 1) {
            option.buttons.push('WRITE_REVIEW')
          }
        } else if (option.orderStatusType === 'DEPOSIT_WAIT') {
          option.statusLabel = '입금대기'
          option.buttonCount = 1
          if (option.nextActions.length === 1) {
            option.buttons.push('CANCEL')
          }
        }
      }
      Vue.set(option, 'showPrice', formatCurrency(option.price.buyAmt))
    },
    GET_RESPONSIBLEOBJECTTYPE (state, claimReasonType) {
      if (state.claimOrderOption && claimReasonType !== '') {
        let claimReasonTypeInfo = {}
        state.claimOrderOption.claimReasonTypes.forEach(ctypeInfo => {
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
        state.claimEstimate = null
      }
    },
    INIT_MULTIPLE_CLAIM_ESTIMATE (state) {
      if (state.multipleClaimEstimate !== null) {
        state.multipleClaimEstimate = null
      }
    }
  },
  getters: {
    orderOptionProduct (state, getters, rootState) {
      if (state.order) {
        let orderOptionProductInfo = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            orderOptionProductInfo.push(...delivery.orderOptions.filter(orderOption => orderOption.orderOptionNo === Number(rootState.route.params.orderOptionNo)))
          })
        })
        const orderOptionProduct = orderOptionProductInfo[0]
        if (orderOptionProduct) {
          orderOptionProduct.showOptions = getshowOptions(orderOptionProduct.optionUsed, orderOptionProduct.optionType, orderOptionProduct.optionName, orderOptionProduct.optionValue, orderOptionProduct.inputs, orderOptionProduct.price.addPrice, orderOptionProduct.orderCnt)
        }
        return orderOptionProduct
      }
    },
    orderOptions (state, getters, rootState) {
      if (state.order) {
        let orderOptions = []
        state.order.orderOptionsGroupByPartner.forEach(partner => {
          partner.orderOptionsGroupByDelivery.forEach(delivery => {
            orderOptions.push(...delivery.orderOptions)
          })
        })
        return orderOptions
      }
    },
    claimNos (state) {
      if (state.orders) {
        const result = []
        let temp = []
        state.orders.forEach(order => {
          order.orderOptions.forEach((option, index) => {
            temp.push(option.claimNo)
            if (index === order.orderOptions.length - 1) {
              temp.push(null)
            }
          })
          result.push(temp)
          temp = []
        })
        return result
      }
    },
    returnInfo (state) {
      if (state.claimOrderOption) {
        const option = state.claimOrderOption.originalOption
        let param = {}
        if (option.orderStatueType !== 'BUY_CONFIRM' && option.refundable) {
          param.orderProductOptionNo = option.orderOptionNo
          param.productCnt = option.orderCnt
        }
        const claimParams = []
        claimParams.push(param)
        const multiple = state.claimOrderOption.claimableOptions
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
      if (state.claimOrderOption) {
        const claimParams = []
        const multiple = state.claimOrderOption.claimableOptions
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
