import { createNcpApiStore } from '@/api'
import { getDateFormat } from '@/utils/dateUtils'
import Vue from 'vue'
import {formatCurrency} from '../../utils/StringUtils'

const apiStore = createNcpApiStore([
  {
    action: '_fetchProduct',
    property: 'product',
    path: 'products/{mallProductNo}',
    pathParams: ['mallProductNo'],
    method: 'get'
  },
  {
    action: '_fetchProductOptions',
    property: 'options',
    path: 'products/{mallProductNo}/options',
    pathParams: ['mallProductNo'],
    method: 'get'
  },
  {
    action: '_fetchOptionsMainImgs',
    property: 'optionsMainImgs',
    path: 'products/{productNo}/options/images?imageCondition=ONLY_MAIN',
    pathParams: ['productNo'],
    method: 'get'
  },
  {
    action: '_fetchOptionsImgs',
    property: 'optionImgs',
    path: 'products/{productNo}/options/{optionNo}/images',
    pathParams: ['productNo', 'optionNo'],
    method: 'get',
    onSuccess (state, payload) {
      if (payload.data && payload.data.length > 0) {
        const item = {
          optionNo: payload.data[0].optionNo,
          imgs: payload.data.map(imgTemp => imgTemp.imageUrl)
        }
        state.optionImgs.push(item)
      }
    }
  },
  {
    action: '_getFavoriteKeywords',
    property: 'favoriteKeywords',
    path: 'products/favoriteKeywords?size=10',
    method: 'get'
  }
])

export default {
  namespaced: true,
  state: {
    dateInfo: false,
    optionImgs: [],
    selectedOption: '',
    detailBottomOpen: false,
    viewPopOpen: false,
    bodyScrollTop: 0
  },
  actions: {
    async fetchProduct ({ state, dispatch, commit, rootState }, product) {
      const mallProductNo = product.productNo
      const preview = product.preview === 'true'
      if (state.product === null || (state.product && state.product.baseInfo && state.product.baseInfo.imageUrls === null)) {
        await dispatch('_fetchProduct', { params: { mallProductNo, preview } }).catch((e) => {
          if (e.data.code === 'E0005') {
            alert(e.data.message)
            window.location.href = '/'
          }
        })
      }
      commit('PRODUCT_IMAGE')
      if (state.product && state.product.baseInfo && state.product.baseInfo.optionImageViewable) {
        await dispatch('_fetchOptionsMainImgs', { params: { productNo: mallProductNo } })
        if (state.optionsMainImgs) {
          state.optionsMainImgs.forEach(option => {
            if (!state.optionImgs.some(obj => obj.optionNo === option.optionNo)) {
              dispatch('_fetchOptionsImgs', { params: { productNo: mallProductNo, optionNo: option.optionNo } })
            }
          })
        }
      }
    },
    fetchProductOptions ({ state, dispatch, commit, rootState }, mallProductNo) {
      return dispatch('_fetchProductOptions', { params: { mallProductNo } })
    },
    async refreshProduct ({ state, dispatch, commit, rootState }, mallProductNo) {
      await dispatch('_fetchProduct', { params: { mallProductNo } })
      return dispatch('_fetchProductOptions', { params: { mallProductNo } })
    }
  },
  mutations: {
    CLEARPRODUCT (state) {
      state.product = null
    },
    CHANGELIKED (state) {
      if (state.product) {
        state.product.liked = !state.product.liked
      }
    },
    MODIFY_TIME (state) {
      if (state.dateInfo) {
        state.dateInfo = false
      }
    },
    PRODUCT_IMAGE (state) {
      if (state.product && state.product.baseInfo) {
        if (!state.product.baseInfo.imageUrls || state.product.baseInfo.imageUrls.length === 0) {
          Vue.set(state.product.baseInfo, 'defaultImages', 'default')
        }
      }
    },
    SELECT_OPTION (state, optionNo) {
      state.selectedOption = optionNo
    },
    SET_VIEW_POP_OPEN (state, openFlg) {
      state.viewPopOpen = openFlg
    },
    SET_DETAIL_BOTTOM_OPEN (state, openFlg) {
      state.detailBottomOpen = openFlg
    },
    SET_BODY_SCROLL_TOP (state, bodyScrollTop) {
      state.bodyScrollTop = bodyScrollTop
    },
    CLEAR_OPTION_IMGS (state) {
      state.optionImgs = []
    }
  },
  getters: {
    displayOptions (state) {
      let dispOpt = []
      if (state.options && state.options.flatOptions && state.options.type === 'COMBINATION') {
        const flatOpts = state.options.flatOptions
        const values = flatOpts.map((item) => item.value)

        state.options.labels.forEach((lab, idx, arr) => {
          let optval = values.map((item) => item.split('|')[idx])
          optval = Array.from(new Set(optval))
          const obj = { label: lab, value: optval }
          dispOpt.push(obj)
        })
      }
      // if (state.options && state.options.flatOptions && (state.options.type === 'STANDARD' || state.options.type === 'DEFAULT')) {
      //   state.options.labels.forEach((lab, idx, arr) => {
      //     const obj = { label: lab, value: state.options.flatOptions }
      //     dispOpt.push(obj)
      //   })
      // }
      if (state.options && state.options.flatOptions && (state.options.type === 'STANDARD' || state.options.type === 'DEFAULT')) {
        dispOpt = [...state.options.flatOptions]
      }
      return dispOpt
    },
    optionInputsGetters (state) {
      let arr = []
      if (state.options && state.options.inputs) {
        arr = state.options.inputs.filter((optItem) => optItem.inputMatchingType === 'OPTION')
      }
      return arr
    },
    optionsTypeCOMBINATION (state) {
      if (state.options) {
        return state.options.type === 'COMBINATION'
      }
    },
    optionsTypeDEFAULT (state) {
      if (state.options) {
        return state.options.type === 'DEFAULT'
      }
    },
    optionsTypeSTANDARD (state) {
      if (state.options) {
        return state.options.type === 'STANDARD'
      }
    },
    productInputsGetters (state) {
      let arr = []
      if (state.options && state.options.inputs) {
        arr = state.options.inputs.filter((optItem) => optItem.inputMatchingType === 'PRODUCT')
      }
      return arr
    },
    productDetail (state) {
      if (state.product && state.product.baseInfo) {
        state.dateInfo = false
        let endDate = new Date(state.product.baseInfo.saleEndYmdt.replace(/-/g, '/'))
        let currentDate = new Date()
        if (endDate.getTime() - currentDate.getTime() < 86400000 * 30 && endDate.getTime() - currentDate.getTime() > 0) {
          let runTime = parseInt((endDate.getTime() - currentDate.getTime()) / 1000)
          let year = Math.floor(runTime / 86400 / 365)
          runTime = runTime % (86400 * 365)
          let month = Math.floor(runTime / 86400 / 30)
          runTime = runTime % (86400 * 30)
          let day = Math.floor(runTime / 86400)
          runTime = runTime % 86400
          let hour = Math.floor(runTime / 3600)
          runTime = runTime % 3600
          let minute = Math.floor(runTime / 60)
          let second = runTime % 60
          let dateStr = ''
          if (year !== 0) {
            dateStr = dateStr + year + '년 '
          }
          if (month !== 0) {
            dateStr = dateStr + month + '개월 '
          }
          if (day !== 0) {
            dateStr = dateStr + day + '일'
            state.product.baseInfo.getProDate = dateStr
          } else if (hour !== 0 || minute !== 0 || second !== 0) {
            state.dateInfo = true
          }
        }

        if (state.product.baseInfo.manufactureYmdt) {
          state.product.baseInfo.manufactureYmdt = getDateFormat(state.product.baseInfo.manufactureYmdt)
        }

        if (state.product.baseInfo.expirationYmdt) {
          state.product.baseInfo.expirationYmdt = getDateFormat(state.product.baseInfo.expirationYmdt) + ' 까지'
        }

        if (state.product.deliveryFee && state.product.deliveryFee.deliveryConditionType === 'FIXED_FEE') {
          state.product.deliveryFee.defaultDeliveryConditionLabel = state.product.deliveryFee.defaultDeliveryConditionLabel.replace('{{deliveryAmt}}', formatCurrency(state.product.deliveryFee.deliveryAmt))
        }
        if (state.product.baseInfo.stickerLabels && state.product.baseInfo.stickerLabels.length > 0) {
          const tempSticker = []
          if (state.product.baseInfo.stickerLabels.some(sticker => sticker === '기부천사')) {
            tempSticker.push('기부천사')
          }
          Vue.set(state.product, 'newStickers', tempSticker)
        }
        return state.product
      }
    },
    productOptionsImgs (state) {
      if (state.optionImgs && state.optionsMainImgs && state.optionsMainImgs.length === state.optionImgs.length) {
        const productOptionsImgs = []
        state.optionsMainImgs.forEach(mainItem => {
          if (!mainItem.soldout) {
            productOptionsImgs.push(...state.optionImgs.filter(item => item.optionNo === mainItem.optionNo))
          }
        })
        return productOptionsImgs
      }
    }
  },
  mixins: [apiStore]
}
