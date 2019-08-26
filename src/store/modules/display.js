import { createNcpApiStore } from '@/api'
import config from '@/config'
import { getDateFormatYMDHM, getStrYMDHMSS, getTodayTime, within30Days, isOverDay } from '@/utils/dateUtils'
import { formatCurrency } from '@/utils/StringUtils'

const apiStore = createNcpApiStore([
  {
    action: '_todaysdeal',
    property: 'todaysdeal',
    path: `display/sections/${config.todaySectionNo}`,
    method: 'get',
    cacheable: true,
    cacheMaxAge: 30e3
  },
  {
    action: '_today',
    property: 'today',
    path: `display/sections/${config.todaySectionNo}`,
    onSuccess (state, res) {
      state.today = res.data[0]
    },
    cacheable: true,
    cacheMaxAge: 30e3
  },
  {
    action: '_homeSections',
    property: 'homeSections',
    path: `display/sections/${config.homeSectionNo}`,
    onSuccess (state, res) {
      state.homeSections = res.data[0]
    },
    cacheable: true,
    cacheMaxAge: 30e3
  },
  {
    action: '_boardsArticlesCategorys',
    property: 'boardsArticlesCategorys',
    path: 'boards/{boardNo}/articles',
    pathParams: ['boardNo'],
    method: 'get'
  },
  {
    action: '_boardsCategorys',
    property: 'boardsCategorys',
    path: 'boards/{boardNo}/categories',
    pathParams: ['boardNo'],
    method: 'get'
  },
  {
    action: '_getBoardDetail',
    property: 'boardDetail',
    path: 'boards/{boardNo}/articles/{articleNo}',
    pathParams: ['boardNo', 'articleNo'],
    method: 'get'
  },
  {
    action: '_getPopups',
    property: 'popupsInfo',
    path: `display/popups`,
    method: 'get'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    boardDetails: [],
    boardItem: {
      item: { articleNo: 0 },
      display: false
    }
  },
  actions: {
    todaysdeal ({ state, commit, dispatch }) {
      if (state.todaysdeal) {
        return
      }
      return dispatch('_todaysdeal', { params: { order: 'ADMIN_SETTING', soldout: 'true', saleStatus: 'READY_ONSALE' } })
    },
    fetchMainAll ({ state, commit, dispatch }) {
      if (state.today && state.FhomeSections && state.popupsInfo) {
        return
      }
      dispatch('_today', { params: { order: 'SALE', soldout: 'false', saleStatus: 'ONSALE' } })
      dispatch('_homeSections', { params: { soldout: 'false', saleStatus: 'ONSALE' } })
      dispatch('_getPopups')
    },
    boardsArticlesCategorys ({ state, commit, dispatch }, params) {
      state.boardItem.display = false
      if (params) {
        return dispatch('_boardsArticlesCategorys', { params: { boardNo: config.faqBoardNo, categoryNo: params.categoryNo, keyword: params.keyword, 'pageNumber': 1, 'pageSize': 100 } })
      }
      return dispatch('_boardsArticlesCategorys', { params: { boardNo: config.faqBoardNo, 'pageNumber': 1, 'pageSize': 100 } })
    },
    boardsCategorys ({ state, commit, dispatch }, boardNo) {
      if (state.boardsCategorys) {
        return
      }
      return dispatch('_boardsCategorys', { params: { boardNo: config.faqBoardNo } })
    },
    async getBoardDetail ({ state, commit, dispatch }, params) {
      if (state.boardItem.item.articleNo === params.articleNo) {
        state.boardItem.display = !state.boardItem.display
        return
      }

      if (state.boardDetails.some(board => board.articleNo === params.articleNo)) {
        state.boardItem.item = state.boardDetails.filter(item => item.articleNo === params.articleNo)[0]
        state.boardItem.display = true
        return
      }
      await dispatch('_getBoardDetail', { params })
      commit('CASE_BOARD')
    }
  },
  getters: {
    todayProduct (state) {
      if (!state.today || !state.today.products || state.today.products.length === 0) {
        return null
      }

      let todayProduct = null
      let notfind = true
      // state.today.products.reverse()
      state.today.products.forEach(product => {
        if (notfind) {
          let nextFlg = false
          if (product.productSalePeriodType === 'REGULAR') {
            nextFlg = true
          } else {
            if (getStrYMDHMSS(product.sectionProductStartYmdt) <= getTodayTime() && getTodayTime() <= getStrYMDHMSS(product.sectionProductEndYmdt)) {
              nextFlg = true
            } else {
              nextFlg = false
            }
          }
          if (product.stockCnt > 0 && nextFlg) {
            const tempSticker = []
            if (product.stickerLabels) {
              if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
                tempSticker.push('기부천사')
              }
              if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
                tempSticker.push('쿠폰')
              }
              if (product.deliveryConditionType === 'FREE') {
                tempSticker.push('무료배송')
              }
            } else {
              if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
                tempSticker.push('쿠폰')
              }
              if (product.deliveryConditionType === 'FREE') {
                tempSticker.push('무료배송')
              }
            }
            if (tempSticker.length === 4) {
              tempSticker.pop()
              tempSticker.pop()
            }
            if (tempSticker.length === 3) {
              tempSticker.pop()
            }
            product.newStickers = tempSticker
            product.soldout = product.stockCnt === 0
            product.saleYmdt = getDateFormatYMDHM(product.saleStartYmdt)
            product.showDiscount = Math.round((product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt) / product.salePrice * 100)
            product.showPrice = formatCurrency(product.salePrice - (product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt))

            if (getStrYMDHMSS(product.saleStartYmdt) <= getTodayTime() && getTodayTime() <= getStrYMDHMSS(product.saleEndYmdt)) {
              product.saleFlg = true
            } else {
              product.saleFlg = false
            }

            product.within30Days = within30Days(product.sectionProductEndYmdt)
            product.overDay = isOverDay(product.sectionProductEndYmdt)
            product.endTime = new Date(product.sectionProductEndYmdt.replace(/-/g, '/') + ' GMT+9') - new Date()

            todayProduct = product
            notfind = false
          }
        }
      })

      return todayProduct
    },
    todaysdealProduct (state) {
      if (!state.todaysdeal) {
        return null
      }
      const products = []
      state.todaysdeal.forEach(todaysdeal => {
        products.push(...todaysdeal.products.filter(product => {
          if (product.productSalePeriodType === 'REGULAR') {
            return true
          } else {
            if (getStrYMDHMSS(product.sectionProductStartYmdt) <= getTodayTime() && getTodayTime() <= getStrYMDHMSS(product.sectionProductEndYmdt)) {
              return true
            } else {
              return false
            }
          }
        }))
      })

      products.forEach(product => {
        const tempSticker = []
        if (product.stickerLabels) {
          if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
            tempSticker.push('기부천사')
          }
          if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
            tempSticker.push('쿠폰')
          }
          if (product.deliveryConditionType === 'FREE') {
            tempSticker.push('무료배송')
          }
        } else {
          if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
            tempSticker.push('쿠폰')
          }
          if (product.deliveryConditionType === 'FREE') {
            tempSticker.push('무료배송')
          }
        }
        if (tempSticker.length === 4) {
          tempSticker.pop()
          tempSticker.pop()
        }
        if (tempSticker.length === 3) {
          tempSticker.pop()
        }
        product.newStickers = tempSticker
        product.soldout = product.stockCnt === 0
        product.saleYmdt = getDateFormatYMDHM(product.saleStartYmdt)
        product.showDiscount = Math.round((product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt) / product.salePrice * 100)
        product.showPrice = formatCurrency(product.salePrice - (product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt))

        if (getStrYMDHMSS(product.saleStartYmdt) <= getTodayTime() && getTodayTime() <= getStrYMDHMSS(product.saleEndYmdt)) {
          product.saleFlg = true
        } else {
          product.saleFlg = false
        }

        product.within30Days = within30Days(product.sectionProductEndYmdt)
        product.overDay = isOverDay(product.sectionProductEndYmdt)
        product.endTime = new Date(product.sectionProductEndYmdt.replace(/-/g, '/') + ' GMT+9') - new Date()
      })

      return products
    },
    getPopupsData (state) {
      if (state.popupsInfo) {
        let nowDate = new Date()
        let nowDateTime = nowDate.getTime()
        const retPopups = state.popupsInfo.filter((popup) => {
          return new Date(popup.startYmdt.replace(/-/g, '/') + ' GMT+9').getTime() < nowDateTime &&
            new Date(popup.endYmdt.replace(/-/g, '/') + ' GMT+9').getTime() > nowDateTime
        })
        if (retPopups && retPopups.length > 0) {
          return retPopups[0]
        }
      }
    },
    homeProducts (state) {
      if (state.homeSections && state.homeSections.products) {
        state.homeSections.products.forEach(product => {
          const tempSticker = []
          if (product.stickerLabels) {
            if (product.stickerLabels.some(sticker => sticker === '기부천사')) {
              tempSticker.push('기부천사')
            }
            if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
              tempSticker.push('쿠폰')
            }
            if (product.deliveryConditionType === 'FREE') {
              tempSticker.push('무료배송')
            }
          } else {
            if (product.hasCoupons.brand || product.hasCoupons.category || product.hasCoupons.partner || product.hasCoupons.product) {
              tempSticker.push('쿠폰')
            }
            if (product.deliveryConditionType === 'FREE') {
              tempSticker.push('무료배송')
            }
          }
          if (tempSticker.length === 4) {
            tempSticker.pop()
            tempSticker.pop()
          }
          if (tempSticker.length === 3) {
            tempSticker.pop()
          }
          product.newStickers = tempSticker
          product.showImg = (product.listImageUrls && product.listImageUrls[0]) ? product.listImageUrls[0] : (product.imageUrls && product.imageUrls[0]) ? product.imageUrls[0] : null
        })
        return state.homeSections.products
      }
    }
  },
  mutations: {
    CASE_BOARD (state) {
      state.boardDetails.push(state.boardDetail)
      state.boardItem.item = state.boardDetail
      state.boardItem.display = true
    },
    CHANGELIKED (state, productNo) {
      if (state.homeSections) {
        state.homeSections.products.forEach(product => {
          if (product.productNo === Number(productNo)) {
            product.liked = !product.liked
          }
        })
      }
    }
  }
}
