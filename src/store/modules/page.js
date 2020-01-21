
const FETCH_DATA_START = 'FETCH_DATA_START'
const FETCH_DATA_END = 'FETCH_DATA_END'
const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR'

function genFetchDataAction (action) {
  return (context, payload) => {
    context.dispatch('categories/fetchAll', payload)
    context.commit(FETCH_DATA_START)
    action(context, payload)
      .then(() => context.commit(FETCH_DATA_END))
      .catch((error) => {
        context.commit(FETCH_DATA_ERROR, error)
        return Promise.reject(error)
      })
  }
}

const state = {
  initDataFetching: false,
  error: null
}

const actions = {
  MainHome: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('banners/fetchMainAll'),
      dispatch('productList/fetchBestByCategory', to),
      dispatch('display/fetchMainAll')
    ])
  )),
  MainBest: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('productList/fetchBestByCategory', to)
    ])
  )),
  MainToday: genFetchDataAction(({ dispatch }) => (
    Promise.all([
      dispatch('display/todaysdeal')
    ])
  )),
  MainBrand: genFetchDataAction(({ dispatch }) => (
    Promise.all([
      dispatch('brand/fetchAllBrand')
    ])
  )),
  Search: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('productList/search', { to })
    ])
  )),
  Category: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('productList/fetchListByCategory', to)
    ])
  )),
  Brand: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('brand/fetchAllBrand'),
      dispatch('productList/fetchListByBrand', { to })
    ])
  )),
  Event: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('event/fetchEventDetail', to.params.eventNo)
    ])
  )),
  ProductDetail: genFetchDataAction(({ dispatch }, { to, from }) => {
    dispatch('product/fetchProduct', { productNo: to.params.productId, preview: to.query.preview })
    dispatch('product/fetchProductOptions', to.params.productId)
    // dispatch('coupon/myCoupons')
    dispatch('coupon/fetchProductCoupons', to.params.productId)
    dispatch('cart/fetchCartCount')
    dispatch('profile/memberFetch')
    return Promise.all([
    ])
  }),
  ProductDetailReview: genFetchDataAction(({ dispatch }, { to, from }) => {
    dispatch('product/fetchProduct', { productNo: to.params.productId, preview: to.query.preview })
    dispatch('product/fetchProductOptions', to.params.productId)
    // dispatch('coupon/myCoupons')
    dispatch('coupon/fetchProductCoupons', to.params.productId)
    dispatch('common/fetchMalls')
    dispatch('productreview/fetchProductReviews', to.params.productId)
    return Promise.all([
    ])
  }),
  ProductDetailInquiry: genFetchDataAction(({ dispatch }, { to, from }) => {
    dispatch('product/fetchProduct', { productNo: to.params.productId, preview: to.query.preview })
    dispatch('product/fetchProductOptions', to.params.productId)
    // dispatch('coupon/myCoupons')
    dispatch('coupon/fetchProductCoupons', to.params.productId)
    dispatch('common/fetchMalls')
    dispatch('productinquiry/fetchProductInquiry', to.params.productId)
    dispatch('productinquiry/fetchMemberInquiry', to.params.productId)
    return Promise.all([
    ])
  }),
  ProductDetailMoreInfo: genFetchDataAction(({ dispatch }, { to, from }) => {
    dispatch('product/fetchProduct', { productNo: to.params.productId, preview: to.query.preview })
    dispatch('product/fetchProductOptions', to.params.productId)
    // dispatch('coupon/myCoupons')
    dispatch('coupon/fetchProductCoupons', to.params.productId)
    return Promise.all([
    ])
  }),
  Cart: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('cart/fetchCart'),
      dispatch('cart/fetchCartCount')
    ])
  )),
  MemberSetting: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('authentication/fetchShopAgreement')
    ])
  )),
  OrderList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderList', { type: 'ORDER', to })
    ])
  )),
  CancelList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderList', { type: 'CANCEL', to })
    ])
  )),
  BeforeOrder: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('ordersheet/getSheetNo', to)
    ])
  )),
  OrderSheet: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('ordersheet/fetchOrder', to.params.orderSheetNo),
      // dispatch('ordersheet/fetchOrderConpons', to.params.orderSheetNo),
      dispatch('shippingaddresses/recentAddresses')
      // dispatch('profile/memberFetch')
    ])
  )),
  MyPage: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('member/memberInformation'),
      dispatch('member/mySummary'),
      dispatch('banners/fetchMyPageBanners')
    ])
  )),
  MyMain: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
    ])
  )),
  MyReviewable: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('profilereview/fetchProductReviewable')
    ])
  )),
  MyReviews: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profilereview/fetchProfileProductReviews')
    ])
  )),
  ValidCoupon: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('validCoupon/getValidCoupons'),
      dispatch('validCoupon/getNoValidCoupons')
      // dispatch('validCoupon/getNoValidCoupons')
    ])
  )),
  NoValidCoupon: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('validCoupon/getNoValidCoupons')
      // dispatch('validCoupon/getValidCoupons'),
      // dispatch('validCoupon/getNoValidCoupons')
    ])
  )),
  LikeProducts: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('likeProducts/fetchLikeProducts')
    ])
  )),
  Return: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getClaimOrderOption', {
        claimParams: {
          claimType: 'RETURN',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  Cancel: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getClaimOrderOption', {
        claimParams: {
          claimType: 'CANCEL',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NoneMemberCancel: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('guestorder/getGuestClaim', {
        claimParams: {
          claimType: 'CANCEL',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NoneMemberReturn: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('guestorder/getGuestClaim', {
        claimParams: {
          claimType: 'RETURN',
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  CancelDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getClaimResult', {
        claimParams: {
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  ReturnDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getMultipleClaimResult', {
        claimParams: {
          claimNo: to.params.claimNo
        }
      })
    ])
  )),
  NoneMemberCancelDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestClaimResult', {
        claimParams: {
          orderOptionNo: to.params.orderOptionNo
        }
      })
    ])
  )),
  NoneMemberReturnDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('guestorder/getGuestMultipleClaimResult', {
        claimParams: {
          claimNo: to.params.claimNo
        }
      })
    ])
  )),
  Boards: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('display/boardsArticlesCategorys'),
      dispatch('display/boardsCategorys')
    ])
  )),
  ShopList: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMallsPartners')
    ])
  )),
  BoardInquiry: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('profile/memberFetch')
    ])
  )),
  PaymentConfirm: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.query.orderNo)
    ])
  )),
  AddReview: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.params.orderNo)
    ])
  )),
  EditReview: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('myorder/getOrder', to.params.orderNo),
      dispatch('profilereview/fetchProductReviewDetail', {
        editParams: {
          reviewNo: to.params.reviewNo,
          productNo: to.params.productNo
        }
      })
    ])
  )),
  OrderDetail: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('myorder/getOrderDetail', to.params.orderNo)
    ])
  )),
  NoneMemberDetail: genFetchDataAction(({ dispatch }, { to }) => (
    Promise.all([
      dispatch('guestorder/getGuestOrderDetail', to.params.orderNo)
    ])
  )),
  MyProductInquirys: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('common/fetchMalls'),
      dispatch('productinquiry/fetchProductInquiries')
    ])
  )),
  ProfileInquiries: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profileinquiry/fetchInquiries')
    ])
  )),
  MbrModify: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profile/memberFetch')
    ])
  )),
  Accumulations: genFetchDataAction(({ dispatch }, { to, from }) => (
    Promise.all([
      dispatch('profile/fetchAccumulations'),
      dispatch('profile/fetchAccumulationsSummary'),
      dispatch('profile/fetchAccumulationsSummary30')
    ])
  ))
}

const mutations = {
  [FETCH_DATA_START] (state) {
    state.initDataFetching = true
  },
  [FETCH_DATA_END] (state) {
    state.initDataFetching = false
  },
  [FETCH_DATA_ERROR] (state, payload) {
    state.initDataFetching = false
    state.error = payload
  }
}

export default {
  state,
  actions: Object.keys(actions).reduce((obj, rawActionName) => {
    obj[`beforeEnter${rawActionName}`] = actions[rawActionName]
    return obj
  }, {}),
  mutations
}
