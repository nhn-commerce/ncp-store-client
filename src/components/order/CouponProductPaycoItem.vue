<template>
  <li>
    <div class="cr_goods_title">
      <p class="name">
        <strong>{{products.brandName}}</strong>{{products.productName}}
      </p>
      <p class="info">
        <span>{{products.optionCnt}}개</span>
        <span>
          <strong>{{MyMiliFormat(products.buyAmt)}}</strong>원</span>
      </p>
    </div>
    <section class="cr_goods_con" v-if="products.productCoupons.length > 0">
      <h3 class="title">상품 쿠폰</h3>
      <ul class="coupon_radio">
        <li>
          <div class="radio_style1">
            <input type="radio" :id="'goods3Coupon'+products.productNo" value="0" v-model.number="selectedCoupon" @change="calcuCoupon()">
            <label :for="'goods3Coupon'+products.productNo">
              <span></span>적용안함</label>
          </div>
        </li>
        <li v-for="(coupon,idx) in products.productCoupons" :key="coupon.couponIssueNo">
          <div class="radio_style1">
            <input :disabled="couponUsed('coupon', coupon.couponIssueNo) || !couponUsable('coupon', coupon.couponIssueNo)" type="radio" :id="'goods3Coupon2'+products.productNo+idx" :value="coupon.couponIssueNo" v-model="selectedCoupon" @change="calcuCoupon()">
            <label :for="'goods3Coupon2'+products.productNo+idx">
              <i class="price">
                <span></span>
                <em>{{MyMiliFormat(coupon.couponDiscountAmt)}}</em>원</i>
              <i class="txt">
                <em v-if="!couponUsable('coupon', coupon.couponIssueNo)">사용중</em>{{coupon.couponName}} (
                <template v-if="coupon.fixedAmountDiscount">
                  {{MyMiliFormat(coupon.couponDiscountAmt)}}원
                </template>
                <template v-if="!coupon.fixedAmountDiscount">
                  {{coupon.discountRate}}%, 최대 {{MyMiliFormat(coupon.maxDiscountAmt)}}원
                </template>

                )<br> {{coupon.useEndYmdt}} 까지 사용가능
                <template v-if="coupon.limitPayType === `PAYCO`">
                  <ul class="card_tag">
                    <li>PAYCO 전용</li>
                  </ul>
                </template>
              </i>
            </label>
          </div>
        </li>
      </ul>
    </section>
    <!-- // 상품 쿠폰 -->
    <section class="cr_goods_con" v-if="products.productPlusCoupons.length > 0">
      <h3 class="title">상품 플러스 쿠폰</h3>
      <ul class="coupon_radio">
        <li>
          <div class="radio_style1">
            <input type="radio" :id="'goods4Coupon'+products.productNo" value="0" v-model.number="selectedPlusCoupon" @change="calcuCoupon()">
            <label :for="'goods4Coupon'+products.productNo">
              <span></span>적용안함</label>
          </div>
        </li>
        <li v-for="(coupon,idx) in products.productPlusCoupons" :key="coupon.couponIssueNo">
          <div class="radio_style1">
            <input :disabled="couponUsed('plus', coupon.couponIssueNo) || !couponUsable('plus', coupon.couponIssueNo)" type="radio" :id="'goods4Coupon2'+products.productNo+idx" :value="coupon.couponIssueNo" v-model="selectedPlusCoupon" @change="calcuCoupon()">
            <label :for="'goods4Coupon2'+products.productNo+idx">
              <i class="price">
                <span></span>
                <em>{{MyMiliFormat(coupon.couponDiscountAmt)}}</em>원</i>
              <i class="txt">
                <em v-if="!couponUsable('plus', coupon.couponIssueNo)">사용중</em>{{coupon.couponName}} (
                <template v-if="coupon.fixedAmountDiscount">
                  {{MyMiliFormat(coupon.couponDiscountAmt)}}원
                </template>
                <template v-if="!coupon.fixedAmountDiscount">
                  {{coupon.discountRate}}%, 최대 {{MyMiliFormat(coupon.maxDiscountAmt)}}원
                </template>
                )
                <br> {{coupon.useEndYmdt}} 까지 사용가능
                <template v-if="coupon.limitPayType === `PAYCO`">
                  <ul class="card_tag">
                    <li>PAYCO 전용</li>
                  </ul>
                </template>
              </i>
            </label>
          </div>
        </li>
      </ul>
    </section>
  </li>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  props: ['products', 'couponRequest'],
  data () {
    return {
      // productCoupon: this.couponRequest.productCoupons.filter(item => item.productNo === this.products.productNo)
    }
  },
  computed: {
    productCoupon: {
      get () {
        return this.couponRequest.productCoupons.filter(item => item.productNo === this.products.productNo)
      }
    },
    selectedCoupon: {
      get () {
        const product = this.productCoupon
        if (product.length > 0) {
          return product[0].couponIssueNo
        }
      },
      set (val) {
        this.$store.commit('ordersheet/SET_COUPONREQUEST_COUPONISS', { productNo: this.products.productNo, couponIssueNo: val, couponRequest: this.couponRequest })
      }
    },
    selectedPlusCoupon: {
      get () {
        const product = this.productCoupon
        if (product.length > 0) {
          return product[0].plusCouponIssueNo
        }
      },
      set (val) {
        this.$store.commit('ordersheet/SET_COUPONREQUEST_PLUSCOUPONISS', { productNo: this.products.productNo, plusCouponIssueNo: val, couponRequest: this.couponRequest })
      }
    }
  },
  methods: {
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    couponUsed (type, issNo) {
      if (this.productCoupon.length === 0) {
        return
      }
      const productCoupon = this.productCoupon[0]
      if (type === 'plus') {
        const plusCoupons = productCoupon.couponPlusDisable.filter((item) => item.couponIssueNo === issNo)
        if (plusCoupons.length > 0) {
          return plusCoupons[0].disable
        }
      } else {
        const coupons = productCoupon.couponDisable.filter((item) => item.couponIssueNo === issNo)
        if (coupons.length > 0) {
          return coupons[0].disable
        }
      }
      return ''
    },
    couponUsable (type, issNo) {
      if (this.productCoupon.length === 0) {
        return
      }
      const productCoupon = this.productCoupon[0]
      if (type === 'plus') {
        const plusCoupons = productCoupon.couponPlusDisable.filter((item) => item.couponIssueNo === issNo)
        if (plusCoupons.length > 0) {
          return plusCoupons[0].usable
        }
      } else {
        const coupons = productCoupon.couponDisable.filter((item) => item.couponIssueNo === issNo)
        if (coupons.length > 0) {
          return coupons[0].usable
        }
      }
      return ''
    },
    calcuCoupon () {
      const orderSheetNo = this.$store.state.route.params.orderSheetNo
      this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo, couponRequest: this.couponRequest })
    }
  }

}
</script>

<style>

</style>
