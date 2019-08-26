<template>
  <section class="order_section">
    <div class="os_top">
      <h3 class="title_style1 title">PAYCO 전용 상품 쿠폰</h3>
      <p class="txt" v-if="hasProductCoupon">(할인 적용가능 상품 {{productCnt}}개)</p>
    </div>
    <div class="os_con coupon_radio_con">
      <ul class="coupon_radio" v-if="!hasProductCoupon">
        <li>
          <div style="text-align: center">적용 가능한 상품 쿠폰이 없습니다</div>
        </li>
      </ul>
      <ul class="cr_goods" v-else>
        <template v-for="product in orderCoupons.products">
          <coupon-product-payco-item v-if="hasPaycoCoupon(product)" :products="product" :couponRequest="couponRequest" :key="product.productNo"></coupon-product-payco-item>
        </template>
      </ul>
    </div>
  </section>
</template>

<script>
import CouponProductPaycoItem from './CouponProductPaycoItem'
export default {
  props: ['orderCoupons', 'couponRequest', 'hasProductCoupon', 'productCnt'],
  components: {
    CouponProductPaycoItem
  },
  data () {
    return {
    }
  },
  methods: {
    hasPaycoCoupon (product) {
      return product.productCoupons.some(item => item.limitPayType === 'PAYCO') || product.productPlusCoupons.some(item => item.limitPayType === 'PAYCO')
    }
  },
  computed: {
  }

}
</script>

<style>

</style>
