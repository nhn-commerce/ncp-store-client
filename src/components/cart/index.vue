<template>
  <div class="cart_list_con" v-if="cart">
    <template v-if="(cart.deliveryGroups && cart.deliveryGroups.length > 0) || (cart.invalidProducts && cart.invalidProducts.length > 0)">
      <div class="cart_all">
        <div class="check_style1" v-if="cart.deliveryGroups.length > 0">
          <input type="checkbox" id="allCart" v-model="checkAllGo" @change="checkAll">
          <label for="allCart">
            <span></span>전체선택</label>
        </div>
        <div class="btn_all_del">
          <span v-if="cart.deliveryGroups.length > 0">
            <a @click.prevent="delChecked" class="btn_all_del">삭제</a>
          </span>
          <span v-if="invalidCount > 0">
            <a @click.prevent="delSoldOut" class="btn_all_del">구매불가 전체삭제</a>
          </span>
        </div>
      </div>
      <div class="cart_list">
        <ul class="ctl_box" v-for="deliveryGroup in cart.deliveryGroups" :key="deliveryGroup.partnerNo">
          <div v-for="product in deliveryGroup.orderProducts" :key="product.productNo">
            <CartOption v-for="option in product.orderProductOptions" :key="option.optionNo" :option="option">
            </CartOption>
          </div>
        </ul>
        <ul class="ctl_box">
          <div v-for="product in cart.invalidProducts" :key="product.productNo">
            <CartOption v-for="option in product.orderProductOptions" :key="option.optionNo" :option="option" :soldOut="true">
            </CartOption>
          </div>
        </ul>
      </div>
      <!-- //cart_list -->
      <div class="cart_bottom">
        <dl>
          <dt>결제예정금액</dt>
          <dd class="pcolor1">
            <span>{{miliFormat(this.paymentAmount)}}</span>원</dd>
        </dl>
        <a @click.prevent="buyChecked" class="btn_buy btn_style1">주문하기</a>
      </div>
      <div class="price_box cart_price">
        <ul>
          <li>
            <dl>
              <dt>총 상품금액</dt>
              <dd>
                <strong>{{miliFormat(this.totalItemPrice)}}</strong> 원</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>총 할인금액</dt>
              <dd class="pcolor1">-
                <strong>{{miliFormat(this.totalDiscountAmount)}}</strong> 원</dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>총 배송비
                <template v-if="havePayOnDelivery">(착불배송비제외)</template>
              </dt>
              <dd>+
                <strong>{{miliFormat(this.totalShippingCost)}}</strong> 원</dd>
            </dl>
          </li>
        </ul>
        <dl class="price_total">
          <dt>결제예정금액</dt>
          <dd>
            <strong>{{miliFormat(this.paymentAmount)}}</strong> 원</dd>
        </dl>
      </div>
      <!-- // cart_price -->
      <div class="order_buy_btn">
        <a @click.prevent="buyChecked" class="btn_style1">주문하기</a>
      </div>
    </template>
    <div class="cart_list" v-else>
      <div class="no_cart">
        <p>장바구니에 담긴 상품이 없습니다.</p>
        <router-link to="/best" class="btn_style1">{{mallName}} 베스트 보기</router-link>
      </div>
    </div>
  </div>
  <div v-else>
    <div id="loader">
      <div class="loader_img"></div>
      <p class="loader_txt">불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script>
import CartOption from '@/components/cart/CartOption'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { addClass, removeClass } from '@/utils/utils'
import floatingBtn from '@/utils/cart'
import { formatCurrency } from '@/utils/StringUtils'
import config from '@/config'
import ssq from 'jquery'

export default {
  data () {
    return {
      running: false,
      mychecked: false,
      mallName: config.mallName
    }
  },
  metaInfo: {
    title: '장바구니'
  },
  name: 'Cart',
  components: {
    CartOption
  },
  computed: {
    checkAllGo: {
      // getter
      get () {
        return this.allChecked
      },
      // setter
      set (newValue) {
        this.mychecked = newValue
      }
    },
    ...mapState('cart', ['cart', 'totalItemPrice', 'totalDiscountAmount', 'totalShippingCost', 'paymentAmount', 'checkOptions', 'invalidCount']),
    ...mapGetters('cart', ['allChecked', 'havePayOnDelivery'])
  },
  methods: {
    miliFormat (num) {
      return formatCurrency(num)
    },
    checkAll () {
      this.$store.commit('cart/CHECK_ALL', this.mychecked)
      this.$store.dispatch('cart/calculate')
    },
    delChecked () {
      if (this.checkOptions && this.checkOptions.length > 0) {
        if (confirm('선택한 상품을 삭제하시겠습니까?')) {
          this.$store.dispatch('cart/deleteCartByOptions', this.checkOptions)
        }
      } else {
        alert('상품을 선택해주세요.')
      }
    },
    delSoldOut () {
      if (this.invalidCount > 0) {
        if (confirm('구매가 불가능한 상품을 모두 삭제하시겠습니까?')) {
          const soldOutOptions = []
          this.cart.invalidProducts.forEach(product => {
            product.orderProductOptions.forEach(option => {
              soldOutOptions.push(option.cartNo)
            })
          })
          this.$store.dispatch('cart/deleteCartByCartNos', soldOutOptions)
        }
      }
    },
    buyChecked () {
      if (this.running) {
        return
      } else {
        this.running = true
      }
      if (this.checkOptions && this.checkOptions.length > 0) {
        delete window.localStorage.orderinfo
        const orderinfo = {
          option: JSON.stringify(this.checkOptions),
          fromUrl: this.$route.fullPath
        }
        window.localStorage.orderinfo = JSON.stringify(orderinfo)

        this.$router.push({
          path: '/order/getsheetno'
        })
      } else {
        alert('상품을 선택 해 주세요.')
        this.running = false
      }
    },
    floatCartBottom (showFlg) {
      if (showFlg) {
        addClass(document.body, 'floating_bottom')
      } else {
        removeClass(document.body, 'floating_bottom')
      }
    },
    ...mapMutations('cart', ['SET_INIT'])
  },
  beforeUpdate () {
    floatingBtn()
  },
  beforeRouteLeave (to, from, next) {
    ssq(window).unbind('scroll', floatingBtn)
    this.SET_INIT()
    next()
  },
  beforeRouteEnter (to, from, next) {
    ssq(window).scroll(floatingBtn)
    next()
  }
}
</script>

<style>

</style>
