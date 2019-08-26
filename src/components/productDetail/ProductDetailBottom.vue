<template>
  <div>
    <transition name="fade">
      <div class="back_capture" v-if="optShowFlg || pvbLayerMulti || pvbLayerSingle" :class="{set_z_index:(displayOptions || pvbLayerMulti || pvbLayerSingle)}"></div>
    </transition>
    <!-- product view bottom : pv_bottom -->
    <div class="pv_bottom" v-if="options && product">
      <div class="pvb_btn" id="btnPvb" @click.prevent="openOpt">
        <a href="#" :class="buybtnClass">{{buytext}}</a>
      </div>
      <form action="">
        <fieldset>
          <legend class="acc-hidden">구매 옵션 선택 폼</legend>
          <transition name="slide-fade">
            <div class="pvb_con" id="pvbCon" ref="pvbCon" v-show="optShowFlg" :style="optStyle">
              <button type="button" class="btn_close" @click="closeOpt">
                <span>옵션 레이어 닫기</span>
              </button>
              <div class="pvbc_inner">
                <div class="pvbc_inner_scroll">
                  <div class="pvbc_opt">
                    <div class="opt_select">
                      <!-- 조합형 -->
                      <a v-if="optionsTypeCOMBINATION && selectedOptValueTitle.length === 0" href="" class="btn_opt" data-layer="multi" @click.prevent="openPvbLayerMulti">옵션을 선택하세요.</a>
                      <!-- 커런트 is_curr -->
                      <!-- // 조합형 -->
                      <!-- 단독형 -->
                      <a v-if="optionsTypeSTANDARD && selectedOptValueTitle.length === 0" href="" class="btn_opt" data-layer="single" @click.prevent="openPvbLayerSingle">옵션을 선택하세요.</a>
                      <!-- // 단독형 -->

                      <template v-if="optionsTypeCOMBINATION">
                        <a v-for="title in selectedOptValueTitle" :key="title" href="" class="btn_opt" data-layer="single" @click.prevent="openPvbLayerMulti">{{title}}</a>
                      </template>
                      <template v-else>
                        <a v-for="title in selectedOptValueTitle" :key="title" href="" class="btn_opt" data-layer="single" @click.prevent="openPvbLayerSingle">{{title}}</a>
                      </template>
                    </div>
                    <div class="opt_message">
                      <template v-for="(item,index) in options.inputs">
                        <input v-if="item.inputMatchingType === 'OPTION'" type="text" class="opt_inp" :placeholder="`${item.inputLabel} : 입력하세요`" :key="item.inputNo" v-model="optionInput.inputText[index]" maxlength="255">
                      </template>
                      <a href="#" v-if="optionInputsGetters && optionInputsGetters.length > 0" class="btn_style3 btn_done" @click.prevent="optionInputDone">입력한 정보로 선택완료</a>
                    </div>

                  </div>
                  <!-- <div class="pvbc_opt">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div> -->
                  <template v-if="optSelectedAll.length > 0">
                    <div class="pvbc_opt_item" v-for="(item,index) in optSelectedAll" :key="item.optionNo" v-if="item.display">
                      <div class="opt_item">
                        <p class="opt_i_txt">
                          <span v-for="opt in item.msg" :key="opt">
                            {{opt}}
                          </span>
                        </p>
                        <div class="opt_i_bottom">
                          <div class="quantity">
                            <a href="" class="minus" @click.prevent="updateQuantity(index,-1)">
                              <img src="../../assets/images/btn/btn_minus_sq.png" alt="감소">
                            </a>
                            <input type="number" class="inp" v-model.number="item.quantity" @change="inputQuantity(index,item.quantity)" @keypress="quantityEnter">
                            <a href="" class="plus" @click.prevent="updateQuantity(index,1)">
                              <img src="../../assets/images/btn/btn_plus_sq.png" alt="증가">
                            </a>
                          </div>
                          <p class="price">
                            <strong>{{miliFormat(item.amt)}}</strong>원</p>
                        </div>
                        <a href="" class="btn_del" @click.prevent="deleteOptSelected(index)">삭제</a>
                      </div>

                      <template v-if="productInputsGetters && productInputsGetters.length > 0">
                        <div class="pvbc_opt">
                          <div class="opt_message">
                            <template v-for="(inputItem, idx) in options.inputs">
                              <input v-if="inputItem.inputMatchingType === 'PRODUCT'" type="text" @input="pdinput(item.optionNo,idx, $event.target.value)" class="opt_inp" :placeholder="`${inputItem.inputLabel} : 입력하세요`" :key="idx" maxlength="255">
                            </template>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
              <dl class="pvbc_total">
                <dt>총 상품금액</dt>
                <dd>
                  <strong>{{(optAmt())}}</strong>원</dd>
              </dl>
              <div class="pvb_btn pvbc_btn">
                <a :class="{'btn_style2 btn_cart':buybutton, 'btn_style6 btn_cart':!buybutton}" @click.prevent="addToCart">장바구니 담기</a>
                <a :class="{'btn_style1':buybutton,'btn_style6':!buybutton}" @click.prevent="buy">구매하기</a>
              </div>
            </div>
          </transition>
          <!-- 단독형 -->
          <transition name="slide-fade-opt2" v-if="displayOptions">
            <div v-if="pvbLayerSingle" class="pvb_layer" id="pvbLayerSingle">
              <button type="button" class="btn_close" @click="closePvbLayerSingle">
                <span>옵션 선택 레이어 닫기</span>
              </button>
              <div class="pvbl_inner">
                <ul class="opt_list pvb_l_single">
                  <li>
                    <a href="#">옵션을 선택하세요. </a>
                    <ul class="opt_dp2">
                      <template v-for="(lastOpt,index) in displayOptions">
                        <li @click.prevent="lastOptSelect(index,lastOpt)" :key="lastOpt.optionNo" :class="optSoldOutStyle(lastOpt.stockCnt, lastOpt.saleType)">
                          <a href="#">
                            <div class="name">{{lastOpt.label}}:{{lastOpt.value}}{{optAddPriceTxt(lastOpt.addPrice)}}</div>
                          </a>
                        </li>
                      </template>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </transition>
          <!-- // 단독형 -->
          <!-- 조합형 -->
          <transition name="slide-fade-opt" v-if="displayOptions">
            <div v-if="pvbLayerMulti" class="pvb_layer" id="pvbLayerMulti">
              <button type="button" class="btn_close" @click="closePvbLayerMulti">
                <span>옵션 선택 레이어 닫기</span>
              </button>
              <div class="pvbl_inner">
                <ul class="opt_list pvb_l_multi">
                  <li v-for="(opt,index) in displayOptions" :key="opt.label" :class="index === currentOptIdx?'is_open':''">
                    <a href="#" @click.prevent="changeOpt(index)">{{opt.label}} {{optTitle[index]}}</a>
                    <ul class="opt_dp2">
                      <template v-for="lastOpt in opt.value">
                        <template v-if="(index === (displayOptions.length-1)) && (currentOptValue.includes(lastOpt.name) || displayOptions.length === 1)">
                          <li @click.prevent="lastOptSelect(index,lastOpt)" :key="lastOpt.optionNo" :class="optSoldOutStyle(lastOpt.stockCnt, lastOpt.saleType)">
                            <a href="#">
                              <div class="name">{{lastOpt.name}} {{optAddPriceTxt(lastOpt.addPrice)}}</div>
                              <div class="stock">{{reparStockTxt(lastOpt.stockCnt,lastOpt.saleType)}}</div>
                            </a>
                          </li>
                        </template>
                        <li @click.prevent="changeOptNext(index, lastOpt)" v-else-if="index < (displayOptions.length-1) && currentOptValue.includes(lastOpt)" :key="lastOpt">
                          <a href="#">
                            <div class="name">{{lastOpt}}</div>
                          </a>
                        </li>
                        <li @click.prevent="changeOptNext(index, lastOpt)" v-else-if="displayOptions.length > 1 && index === 0" :key="lastOpt">
                          <a href="#">
                            <div class="name">{{lastOpt}}</div>
                          </a>
                        </li>
                      </template>
                    </ul>
                  </li>

                </ul>
              </div>
            </div>
          </transition>
          <!-- // 조합형 -->
        </fieldset>
      </form>
      <ProductAddCartPop v-if="alertAddCart" @closePop="closeAlertAddCart"></ProductAddCartPop>
    </div>
    <!-- // pv_bottom -->
  </div>
</template>
<script>
/* global NCPSearch */

import { addClass, removeClass } from '@/utils/utils'
import { formatCurrency } from '@/utils/StringUtils'
import { mapState, mapGetters, mapMutations } from 'vuex'
import ProductAddCartPop from './ProductAddCartPop'
import { getDateFormatYMDHM, getTodayTime, getDateFormatMDHM } from '@/utils/dateUtils'
import cookies from 'js-cookie'

export default {
  data () {
    return {
      running: false,
      isLogined: this.$store.getters.isLogined,
      optTitle: [],
      selectedOptValueTitle: [],
      optStockStyle: [],
      optDetial: [],
      selectedOptValue: [],
      currentOptIdx: -1,
      currentOptValue: [],
      optSelectedAll: [
        // {
        //   msg: [],
        //   quantity: 1,
        //   amt: 0,
        //   optionNo: 0,
        //   unitAmt: 0,
        //   stockCnt: 0,
        //   addPrice: 0,
        //   inputMatchingText:[]
        // }
      ],
      productInput: [],
      optionInput: {
        inputText: [],
        inputDone: false
      },
      optAmt: () => {
        if (this.optSelectedAll.length > 0) {
          let sum = 0
          this.optSelectedAll.forEach((item) => {
            sum += item.amt
          })
          return this.miliFormat(sum)
        } else {
          return 0
        }
      },
      optStyle: {
        marginButtom: '0px',
        display: 'block'
      },
      optSelectedMsg: false,
      pvbLayerMulti: false,
      pvbLayerSingle: false,
      optShowFlg: false,
      alertAddCart: false,
      buybtnClass: 'btn_style1'
    }
  },
  computed: {
    buytext: {
      get () {
        if (this.product) {
          const preview = this.$store.state.route.query.preview
          if (preview === 'true') {
            this.buybtnClass = 'btn_style1'
            return '구매하기'
          }
          const now = getTodayTime()
          const startdt = this.product.baseInfo.saleStartYmdt
          if (!this.product.status.display || this.product.status.soldout || (this.product.status.saleStatusType !== 'READY' && this.product.status.saleStatusType !== 'ONSALE')) {
            this.buybtnClass = 'btn_style5'
            return '구매불가'
          } else if (this.product.status.saleStatusType === 'READY' && (startdt > now)) {
            this.buybtnClass = 'btn_style5'
            return getDateFormatMDHM(startdt)
          } else {
            this.buybtnClass = 'btn_style1'
            return '구매하기'
          }
        }
      }
    },
    buybutton: {
      get () {
        return this.optSelectedAll.some(item => item.display) && this.canBuy()
      }
    },
    ...mapState('product', ['product', 'options', 'selectedOption', 'detailBottomOpen', 'viewPopOpen', 'bodyScrollTop']),
    ...mapState('cart', ['count']),
    ...mapState('profile', ['profile']),
    ...mapGetters('product', ['displayOptions', 'optionInputsGetters', 'productInputsGetters', 'optionsTypeCOMBINATION', 'optionsTypeDEFAULT', 'optionsTypeSTANDARD'])
  },
  components: {
    ProductAddCartPop
  },
  methods: {
    ...mapMutations('product', ['SET_DETAIL_BOTTOM_OPEN', 'SET_BODY_SCROLL_TOP']),
    canBuy () {
      if (!this.product.status.display || this.product.status.soldout || this.product.status.saleStatusType !== 'ONSALE') {
        return false
      } else {
        return true
      }
    },
    pdinput (optNo, idx, val) {
      const option = this.productInput.find(item => item.optionNo === optNo)
      if (option) {
        option.inputs[idx] = val
      }
    },
    replice (str, r) {
      if (str) {
        return str.replace(r, '')
      }
    },
    quantityEnter (e) {
      if (e.key === '+' || e.key === '-' || e.key === '.' || e.key === 'Enter') {
        e.preventDefault()
      }
    },
    initOptVal (partten) {
      this.currentOptIdx = 0
      this.optDetial = []
      this.currentOptValue = []
      this.selectedOptValue = []
      this.optTitle = []
      if (partten) {
        this.productInput = []
        this.optSelectedAll = []
      }
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    updateQuantity (idx, val) {
      if (this.optSelectedAll[idx].quantity + val <= 0) {
        return
      }

      this.optSelectedAll[idx].quantity += val
      if (this.optSelectedAll[idx].quantity > 9999) {
        this.optSelectedAll[idx].quantity = 9999
      }
      this.optSelectedAll[idx].amt = this.optSelectedAll[idx].quantity * this.optSelectedAll[idx].unitAmt
    },
    inputQuantity (idx, val) {
      if (!val) {
        this.optSelectedAll[idx].quantity = 1
        return
      }
      if (this.optSelectedAll[idx].quantity + val <= 0) {
        this.optSelectedAll[idx].quantity = 1
        return
      }

      if (val > 9999) {
        val = 9999
      }

      this.optSelectedAll[idx].quantity = val

      this.optSelectedAll[idx].amt = this.optSelectedAll[idx].quantity * this.optSelectedAll[idx].unitAmt
    },
    changeOpt (idx) {
      if (this.currentOptIdx > idx) {
        this.currentOptIdx = idx
        this.optDetial = []
        this.currentOptValue = []
        for (let i = idx + 1; this.optTitle[i] !== undefined; i++) {
          this.$set(this.optTitle, i, '')
        }
        for (let i = idx + 1; this.selectedOptValue[i] !== undefined; i++) {
          this.$set(this.selectedOptValue, i, '')
        }
      }
    },
    deleteOptSelected (idx) {
      const optNo = this.optSelectedAll[idx].optionNo
      this.productInput.forEach((item, idx) => {
        if (item.optionNo === optNo) {
          this.productInput.splice(idx, 1)
        }
      })
      this.optSelectedAll.splice(idx, 1)
    },
    lastOptSelect (idx, opt) {
      if (opt.stockCnt === 0 ? 'soldout' : '') {
        return
      }
      if (!this.optSelectedAll.filter((item) => item.optionNo === opt.optionNo).length > 0) {
        this.optTitle[idx] = ':' + opt.name
        const labels = opt.label.split('|')
        const values = opt.value.split('|')
        // const t = opt.name ? opt.name : opt.value
        // debugger

        const optSelected = {
          msg: [],
          quantity: 1,
          amt: 0,
          optionNo: 0,
          unitAmt: 0,
          stockCnt: 0,
          addPrice: 0,
          inputMatchingText: [],
          display: true
        }

        labels.forEach((item, idx) => {
          optSelected.msg.push(item + ':' + values[idx])
        })

        if (opt.addPrice !== 0) {
          const operator = opt.addPrice > 0 ? '+' : ''
          optSelected.msg.push('(' + operator + this.miliFormat(opt.addPrice) + '원)')
        }

        optSelected.optionNo = opt.optionNo
        optSelected.unitAmt = this.product.price.salePrice - this.product.price.additionDiscountAmt - this.product.price.immediateDiscountAmt + opt.addPrice
        optSelected.amt = optSelected.quantity * optSelected.unitAmt
        optSelected.stockCnt = opt.stockCnt
        optSelected.addPrice = opt.addPrice
        if (this.optionInputsGetters.length > 0) {
          optSelected.display = false
        }
        if (this.optSelectedAll.length > 0 && this.optSelectedAll[this.optSelectedAll.length - 1].display === false) {
          this.optSelectedAll.pop()
        }
        this.optSelectedAll.push(optSelected)

        const t = values[values.length - 1]

        if (optSelected.display) {
          this.selectedOptValueTitle.push(t)
        } else if (!optSelected.display && this.selectedOptValueTitle.length === this.optSelectedAll.length) {
          this.selectedOptValueTitle.pop()
          this.selectedOptValueTitle.push(t)
        } else {
          this.selectedOptValueTitle.push(t)
        }

        if (optSelected.display) {
          const optInputs = this.options.inputs.filter(f => f.inputMatchingType === 'PRODUCT')
          if (optInputs.length > 0) {
            if (!this.productInput.some(itm => itm.optionNo && itm.optionNo === opt.optionNo)) {
              const ips = Array.apply(null, Array(optInputs.length)).map(function (item, i) {
                return ''
              })
              this.productInput.push({ optionNo: opt.optionNo, inputs: ips })
            }
          }
        }
      } else {
        alert('이미 선택한 옵션입니다.')
      }
      this.openOptSelectedMsg()
      if (this.optionsTypeCOMBINATION) {
        this.closePvbLayerMulti()
      } else {
        this.closePvbLayerSingle()
      }
      this.initOptVal()
    },
    changeOptNext (idx, val) {
      if (this.currentOptIdx >= 0) {
        this.optTitle[this.currentOptIdx] = ':' + val
        this.selectedOptValue[this.currentOptIdx] = val
        if (!this.selectedOptValueTitle.some(item => item === val)) {
          this.selectedOptValueTitle.push(val)
        }
        let optText = ''
        for (let i = 0; i < this.selectedOptValue.length; i++) {
          console.log(i)
          console.log(this.selectedOptValue[i])
          if (this.selectedOptValue[i] !== '') {
            if (i === 0) {
              optText += this.selectedOptValue[i]
            } else {
              optText += '|' + this.selectedOptValue[i]
            }
          }
        }
        const tempOpt = this.options.flatOptions.map((item) => {
          if (item.value.substr(0, optText.length) === optText) {
            return item.value.substr(optText.length).split('|')[1]
          }
        })
        console.log(Array.from(new Set(tempOpt.filter(o => o))))
        this.currentOptValue = Array.from(new Set(tempOpt.filter(o => o)))
      }
      this.currentOptIdx = this.currentOptIdx + 1
      if (this.displayOptions.length === (this.currentOptIdx + 1)) {
        this.optDetial = this.options.flatOptions.map((item) => {
          const tempArr = item.value.split('|').filter((item, idx) => idx < this.selectedOptValue.length)
          if (tempArr.join('|') === this.selectedOptValue.join('|')) {
            item.name = item.value.split('|').filter((item, idx) => idx === this.selectedOptValue.length).join('')
            return item
          }
        }, this)
        this.optDetial = this.optDetial.filter((item) => item)
      }
      this.displayOptions[this.displayOptions.length - 1].value = this.optDetial
    },
    optionInputDone () {
      if (this.optSelectedAll.length === 0) {
        alert('상품 옵션을 선택 해 주세요.')
        return false
      }
      const optionInputs = this.optionInputsGetters
      const optionInputCnt = optionInputs.length

      if (optionInputCnt > 0) {
        if (this.optionInput.inputText.length !== optionInputCnt) {
          alert('옵션 값을 입력 해  주세요.')
          return false
        }

        if (this.optionInput.inputText.filter(item => item === '').length > 0) {
          alert('옵션 값을 입력 해  주세요.')
          return false
        }
        const lastOpt = this.optSelectedAll[this.optSelectedAll.length - 1]

        this.optionInput.inputText.forEach((inputVal, idx) => {
          optionInputs.forEach((subitem, sidx) => {
            if (idx === sidx) {
              const txt = subitem.inputLabel + ':' + inputVal
              lastOpt.msg.push(txt)
              lastOpt.inputMatchingText.push(inputVal)
            }
          })
        })
        lastOpt.display = true

        this.optionInput.inputText.splice(0)
        this.selectedOptValueTitle.splice(0)
      }
      return true
    },
    productInputDone () {
      if (this.optSelectedAll.length === 0) {
        alert('상품 옵션을 선택 해 주세요.')
        return false
      }

      const pInput = this.productInputsGetters
      if (pInput.length === 0) {
        return true
      }

      if (this.productInput.some(item => item.inputs.some(s => s === ''))) {
        alert('옵션 값을 입력 해  주세요.')
        return false
      }
      return true
    },
    beforValidate (buyPattern) {
      if (this.optSelectedAll.length === 0) {
        alert('상품 옵션을 선택 해 주세요.')
        return false
      }

      if (this.optSelectedAll.filter(item => item.display === false).length > 0) {
        alert('옵션 값을 입력 해  주세요.')
        return false
      }

      if (!this.productInputDone()) {
        return false
      }
      if (this.product.status.saleStatusType !== 'READY' && this.product.status.saleStatusType !== 'ONSALE') {
        alert('이 상품은 현재 구매가 불가능합니다.')
        return false
      }

      let buyCnt = 0
      let checkflg = true
      let hasCntZero = false
      /** stock check */
      this.optSelectedAll.forEach((item) => {
        buyCnt += parseInt(item.quantity)
        if (item.quantity <= 0) {
          hasCntZero = true
        }
        this.options.flatOptions.forEach((subitem) => {
          if (subitem.optionNo === item.optionNo) {
            if (subitem.addPrice !== item.addPrice) {
              checkflg = false
              alert('상품가격이 변경 되었습니다. 다시 확인하시고 구매 해 주세요.')
              return false
            }
            if (subitem.stockCnt === 0) {
              checkflg = false
              alert('선택하신 옵션이 품절되었습니다.')
              return false
            }
            if (parseInt(item.quantity) > subitem.stockCnt) {
              checkflg = false
              alert('상품의 재고가 부족합니다. 수량을 다시 확인 해 주세요.')
              return false
            }
          }
        })
      })
      if (!checkflg) {
        return checkflg
      }

      if (hasCntZero) {
        alert('이 상품은 최소 1개이상 구매 가능한 상품입니다. 수량을 다시 확인 해 주세요.')
        return false
      }

      /** min buy check */
      if (this.product.limitations.minBuyCnt !== 0 && buyCnt < this.product.limitations.minBuyCnt) {
        alert('이 상품은 최소 ' + this.product.limitations.minBuyCnt + '개이상 구매 가능한 상품입니다. 수량을 다시 확인 해 주세요.')
        return false
      }

      /** Time max Buy Cnt check */
      if (this.product.limitations.maxBuyTimeCnt !== 0 && buyCnt > this.product.limitations.maxBuyTimeCnt) {
        alert('이 상품은 최대 ' + this.product.limitations.maxBuyTimeCnt + '개 구매 가능한 상품입니다. 수량을 다시 확인 해 주세요.')
        return false
      }

      return true
    },
    getSelectedProductItems (buyPattern) {
      const productOptionInputs = this.productInputsGetters.length > 0 ? this.productInputsGetters : this.optionInputsGetters
      const products = this.optSelectedAll.map((item, idx) => {
        const optionIpt = []
        if (this.productInputsGetters.length > 0) {
          const pdInputs = this.productInput.find(f => f.optionNo === item.optionNo)
          productOptionInputs.forEach((pin, idx) => {
            const inputLabel = pin.inputLabel
            const inputVal = pdInputs.inputs[idx]
            optionIpt.push({ inputLabel: inputLabel, inputValue: inputVal })
          })
        } else {
          productOptionInputs.forEach((sitem, idx) => {
            const inputLabel = sitem.inputLabel
            const inputVal = item.inputMatchingText[idx]
            optionIpt.push({ inputLabel: inputLabel, inputValue: inputVal })
          })
        }

        let maxCartNo = 0
        const cartItems = JSON.parse(window.localStorage.cartInfo || '[]')
        if (cartItems.length > 0) {
          cartItems.forEach(cartItem => {
            if (cartItem.cartNo > maxCartNo) {
              maxCartNo = cartItem.cartNo
            }
          })
        }

        if (buyPattern) {
          return {
            productNo: this.product.baseInfo.productNo,
            optionNo: item.optionNo,
            orderCnt: item.quantity,
            additionalProductNo: 0,
            optionInputs: optionIpt
          }
        } else {
          return {
            cartNo: (maxCartNo + idx + 1),
            productNo: this.product.baseInfo.productNo,
            optionNo: item.optionNo,
            orderCnt: item.quantity,
            additionalProductNo: 0,
            optionInputs: optionIpt
          }
        }
      })
      return products
    },
    addToCart () {
      if (!this.buybutton) {
        return
      }
      const item = this.getSelectedProductItems(false)

      if (this.beforValidate(false)) {
        /** cart quantity 장바구니에 담긴 옵션상품 수가 100개 초과 될 경우 */
        if (this.isLogined) {
          if (this.count.count + this.optSelectedAll.length > 100) {
            alert('장바구니에 담을 수 있는 최대 상품 수를 초과하게 됩니다. 장바구니에 담긴 상품을 정리 해 주세요.')
            return
          }
        } else {
          const cartItems = JSON.parse(window.localStorage.cartInfo || '[]')
          if (cartItems.length + this.optSelectedAll.length > 100) {
            alert('장바구니에 담을 수 있는 최대 상품 수를 초과하게 됩니다. 장바구니에 담긴 상품을 정리 해 주세요.')
            return
          }
        }

        /** 장바구니 담기 불가 상품일 경우 */
        if (!this.product.limitations.canAddToCart) {
          alert('이 상품은 장바구니에 담을 수 없습니다.')
          return
        }

        if (!this.viewPopOpen) {
          removeClass(document.body, 'no_scroll')
          document.body.style.top = '0px'
          window.scrollTo(0, this.bodyScrollTop * -1)
        }
        this.SET_DETAIL_BOTTOM_OPEN(false)

        const targetURL = `${location.protocol}//${location.host}${this.$route.path}`
        const searchProductID = this.$route.query.searchProductID
        if (searchProductID) {
          NCPSearch.sendClickLog(targetURL, searchProductID, 'cart', cookies.get('adId') ? cookies.get('adId') : '')
        }
        if (this.running) {
          return
        } else {
          this.running = true
        }
        this.$store.dispatch('cart/addToCart', item).then((ret) => {
          this.closePvbLayerWarp()
          this.initOptVal(true)
          this.selectedOptValueTitle.splice(0)
          if (ret) {
            this.openAlertAddCart()
          }
          this.running = false
        }).catch(e => {
          this.running = false
        })
      }
    },
    buy () {
      if (!this.buybutton) {
        return
      }
      if (!this.viewPopOpen) {
        removeClass(document.body, 'no_scroll')
        document.body.style.top = '0px'
        window.scrollTo(0, this.bodyScrollTop * -1)
      }
      this.SET_DETAIL_BOTTOM_OPEN(false)
      if (this.beforValidate(true)) {
        const products = this.getSelectedProductItems(true)
        const targetURL = `${location.protocol}//${location.host}${this.$route.path}`
        const searchProductID = this.$route.query.searchProductID
        if (searchProductID) {
          NCPSearch.sendClickLog(targetURL, searchProductID, 'buyclick', cookies.get('adId') ? cookies.get('adId') : '')
        }
        if (this.running) {
          return
        } else {
          this.running = true
        }

        delete window.localStorage.orderinfo
        const orderinfo = {
          option: JSON.stringify(products),
          fromUrl: this.$route.fullPath
        }
        window.localStorage.orderinfo = JSON.stringify(orderinfo)

        this.$router.push({
          path: '/order/getsheetno',
          query: {
            searchProductID: this.$store.state.route.query.searchProductID,
            productNo: this.product.baseInfo.productNo
          }
        })
      }
    },
    noOptionDefaultSelected () {
      const option = this.options.flatOptions[0]
      const msglist = []
      msglist.push('수량')
      const addPrice = option.addPrice
      if (addPrice !== 0) {
        const operator = addPrice > 0 ? '+' : ''
        msglist.push('(' + operator + addPrice + ')')
      }

      this.optSelectedAll.push(
        {
          msg: msglist,
          quantity: 1,
          amt: this.product.price.salePrice - this.product.price.immediateDiscountAmt - this.product.price.additionDiscountAmt + addPrice,
          optionNo: option.optionNo,
          unitAmt: this.product.price.salePrice - this.product.price.immediateDiscountAmt - this.product.price.additionDiscountAmt + addPrice,
          stockCnt: option.stockCnt,
          addPrice: addPrice,
          inputMatchingText: [],
          display: true
        })
      const optInputs = this.options.inputs.filter(f => f.inputMatchingType === 'PRODUCT')
      if (optInputs.length > 0) {
        if (!this.productInput.some(itm => itm.optionNo && itm.optionNo === option.optionNo)) {
          const ips = Array.apply(null, Array(optInputs.length)).map(function (item, i) {
            return ''
          })
          this.productInput.push({ optionNo: option.optionNo, inputs: ips })
        }
      }
    },
    openOpt () {
      if (this.buytext !== '구매하기') {
        return
      }
      const preview = this.$store.state.route.query.preview
      /** YYYY년 MM월 DD일 오픈 예정 */
      const saleStartYmdt = this.product.baseInfo.saleStartYmdt
      const openDate = (saleStartYmdt && saleStartYmdt.length > 0) ? new Date(saleStartYmdt.replace(/-/g, '/')) : ''
      if (openDate !== '') {
        const now = new Date()
        if (openDate > now && this.product.status.saleStatusType === 'READY' && preview !== 'true') {
          const msg = getDateFormatYMDHM(saleStartYmdt) + ' 오픈 예정'
          alert(msg)
          return
        }
      }

      /** no option , default selected */
      if (this.optionsTypeDEFAULT) {
        if (this.optSelectedAll.length === 0) {
          this.noOptionDefaultSelected()
        }
      }
      /** end */

      if (!this.viewPopOpen) {
        const currScroll = document.body.scrollTop | document.documentElement.scrollTop
        this.SET_BODY_SCROLL_TOP(currScroll * -1)
        document.body.style.top = this.bodyScrollTop + 'px'
        addClass(document.body, 'no_scroll')
      }
      this.SET_DETAIL_BOTTOM_OPEN(true)
      this.openPvbLayerWarp()

      if (this.selectedOption) {
        if (this.optionsTypeCOMBINATION) {
          this.openPvbLayerMulti()
        } else {
          this.openPvbLayerSingle()
        }
        // 조합형이면 option.labels 1개라면 옵션 선택 레이어 오픈, 1개이상이면 첫번째 label 선택되어야 함.
        // 단독형이면 current 이미지의 해당 옵션이 선택되어야 함
        const tempOption = this.options.flatOptions.filter(item => item.optionNo === this.selectedOption)
        const optionVal = tempOption[0].value.split('|')
        if (this.optionsTypeCOMBINATION) {
          if (optionVal.length > 1) {
            this.changeOptNext(0, optionVal[0])
          } else {
            this.pvbLayerMulti = true
          }
        } else {
          this.lastOptSelect(0, tempOption && tempOption[0])
        }
      }
    },
    closeOpt () {
      this.closePvbLayerWarp()
      if (!this.viewPopOpen) {
        removeClass(document.body, 'no_scroll')
        document.body.style.top = '0px'
        window.scrollTo(0, this.bodyScrollTop * -1)
      }
      this.SET_DETAIL_BOTTOM_OPEN(false)
    },
    reparStockTxt (stock, saleType) {
      // if (saleType === 'SOLDOUT' || stock === 0) {
      //   return '품절'
      // }
      if (stock === 0) {
        return '품절'
      }
      return '재고:' + stock + '개'
    },
    optAddPriceTxt (price) {
      if (price !== 0) {
        const operator = price > 0 ? '+' : ''

        return '(' + operator + this.miliFormat(price) + '원)'
      }
      return ''
    },
    optSoldOutStyle (stockCnt, saleType) {
      // return stockCnt === 0 || saleType === 'SOLDOUT' ? 'soldout' : ''
      return stockCnt === 0 ? 'soldout' : ''
    },
    openOptSelectedMsg () {
      this.optSelectedMsg = true
    },
    openPvbLayerWarp () {
      this.optShowFlg = true
    },
    openPvbLayerMulti () {
      this.selectedOptValueTitle = []
      this.pvbLayerMulti = true
      this.initOptVal()
      if (this.displayOptions.length === 1) {
        this.currentOptIdx = -1
        this.changeOptNext(0, this.displayOptions[0].label)
      }
      this.closePvbLayerWarp()
    },
    openPvbLayerSingle () {
      this.pvbLayerSingle = true
      this.closePvbLayerWarp()
    },
    openAlertAddCart () {
      this.alertAddCart = true
    },
    closePvbLayerWarp () {
      this.optShowFlg = false
    },
    closePvbLayerMulti () {
      if (!this.optSelectedAll.some(item => !item.display)) {
        this.selectedOptValueTitle.splice(0)
      }
      this.pvbLayerMulti = false
      this.openPvbLayerWarp()
    },
    closePvbLayerSingle () {
      if (!this.optSelectedAll.some(item => !item.display)) {
        this.selectedOptValueTitle.splice(0)
      }
      this.pvbLayerSingle = false
      this.openPvbLayerWarp()
    },
    closeAlertAddCart () {
      this.alertAddCart = false
    }
  }
}
</script>
<style scoped>
.back_capture {
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
.set_z_index {
  z-index: 9995;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slide-fade-opt-enter-active,
.slide-fade-opt-leave-active,
.slide-fade-opt2-enter-active,
.slide-fade-opt2-leave-active,
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-opt-enter,
.slide-fade-opt-leave-to {
  transform: translateY(476px);
}

.slide-fade-opt2-enter,
.slide-fade-opt2-leave-to {
  transform: translateY(312px);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(588px);
}
.pvbc_opt .opt_select .btn_opt {
  overflow: hidden;
  -webkit-line-clamp: 1;
  padding: 0 3rem 0 1.5rem;
}
</style>
