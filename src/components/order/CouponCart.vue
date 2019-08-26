<template>
  <section class="order_section">
    <div class="os_top">
      <h3 class="title_style1 title" v-if="type=='PAYCO'">PAYCO 전용 장바구니 쿠폰</h3>
      <h3 class="title_style1 title" v-else>장바구니쿠폰 적용</h3>
    </div>
    <div class="os_con coupon_radio_con">
      <ul class="coupon_radio">
        <li v-if="!hasDeliveryCoupon">
          <div style="text-align: center">적용 가능한 장바구니 쿠폰이 없습니다</div>
        </li>
        <li v-else>
          <div class="radio_style1">
            <input type="radio" :id="'cartCoupon'+type" value="0" v-model.number="cartCouponIssue" @change="calcuCoupon('cart', true)">
            <label :for="'cartCoupon'+type">
              <span></span>적용안함</label>
          </div>
        </li>
        <li v-for="(catcoupon,idx) in orderCoupons.cartCoupons" :key="catcoupon.couponIssueNo" v-if="(type === 'PAYCO' && catcoupon.limitPayType === type) || (type!=='PAYCO' && catcoupon.limitPayType !== 'PAYCO')">
          <div class="radio_style1">
            <input type="radio" :id="'cartCoupon2'+type+idx" :value="catcoupon.couponIssueNo" v-model="cartCouponIssue" @change="calcuCoupon('cart', catcoupon.otherCouponUsable)">
            <label :for="'cartCoupon2'+type+idx">
              <i class="price">
                <span></span>
                <em>{{MyMiliFormat(catcoupon.couponDiscountAmt)}}</em>원</i>
              <i class="txt">
                {{catcoupon.couponName}} (
                <template v-if="catcoupon.fixedAmountDiscount">
                  {{MyMiliFormat(catcoupon.couponDiscountAmt)}}원
                </template>
                <template v-if="!catcoupon.fixedAmountDiscount">
                  {{catcoupon.discountRate}}%, 최대 {{MyMiliFormat(catcoupon.maxDiscountAmt)}}원
                </template>

                )<br> {{catcoupon.useEndYmdt}} 까지 사용가능
                <template v-if="catcoupon.limitPayType === type">
                  <ul class="card_tag">
                    <li>PAYCO 전용</li>
                  </ul>
                </template>
              </i>
            </label>
          </div>

        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
import { mapState, mapGetters } from 'vuex'
export default {
  props: ['orderCoupons', 'couponRequest', 'couponRequestGroup', 'type'],
  data () {
    return {
      oldcartCouponIssueNo: 0,
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  computed: {
    ...mapState('ordersheet', ['couponCartClickType']),
    ...mapGetters('ordersheet', ['orderSelectedPaycoCoupon']),
    cartCouponDisable: {
      get () {
        if (this.couponRequest.cartCouponIssueNo === 0) {
          return false
        }
        const currPaycoCoupon = this.orderSelectedPaycoCoupon.paycoCoupons.some(item => item === this.couponRequest.cartCouponIssueNo)
        if (currPaycoCoupon && this.type === 'PAYCO') {
          return false
        } else if (currPaycoCoupon && this.type === 'GENERAL') {
          return true
        } else if (!currPaycoCoupon && this.type === 'PAYCO') {
          return true
        } else if (!currPaycoCoupon && this.type === 'GENERAL') {
          return false
        }
      }
    },
    cartCouponIssue: {
      get () {
        let ret = 0

        if (this.couponCartClickType === '') {
          const currPaycoCoupon = this.orderSelectedPaycoCoupon.paycoCoupons.some(item => item === this.couponRequest.cartCouponIssueNo)
          if (currPaycoCoupon && this.type === 'PAYCO') {
            ret = this.couponRequest.cartCouponIssueNo
          } else if (!currPaycoCoupon && this.type === 'GENERAL') {
            ret = this.couponRequest.cartCouponIssueNo
          }
        } else {
          if (this.couponCartClickType === this.type) {
            ret = this.couponRequest.cartCouponIssueNo
          }
        }

        return ret
      },
      set (val) {
        if (val === 0 && this.cartCouponIssue === 0) {
          return
        }
        this.$store.commit('ordersheet/CHANGE_COUPON_CART_CLICK_TYPE', this.type)
        this.couponRequest.cartCouponIssueNo = val
      }
    },
    hasDeliveryCoupon: {
      get () {
        if (!this.orderCoupons.cartCoupons || this.orderCoupons.cartCoupons.length === 0) {
          return false
        }
        const paycoCartCoupons = this.orderCoupons.cartCoupons.filter(item => item.limitPayType === 'PAYCO')
        if (this.type === 'PAYCO') {
          return paycoCartCoupons.length > 0
        } else {
          return paycoCartCoupons.length !== this.orderCoupons.cartCoupons.length
        }
      }
    }
  },
  methods: {
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    calcuCoupon (type, otherCouponUsable) {
      if (type === 'cart') {
        if (!otherCouponUsable) {
          if (confirm('이 쿠폰 사용 시 상품쿠폰은 사용할 수 없습니다. 이 쿠폰을 사용하시겠습니까?')) {
            this.couponRequestUse(false)
          } else {
            this.couponRequest.cartCouponIssueNo = this.oldcartCouponIssueNo
            return
          }
        }
        this.oldcartCouponIssueNo = this.couponRequest.cartCouponIssueNo
      }
      this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
    },
    couponRequestUse (disable) {
      this.couponRequest.productCoupons.forEach(item => {
        item.couponIssueNo = 0
        item.plusCouponIssueNo = 0
        item.couponDisable.forEach(si => {
          si.disable = disable
        })
        item.couponPlusDisable.forEach(si => {
          si.disable = disable
        })
      })
    }
  }

}
</script>

<style>

</style>
