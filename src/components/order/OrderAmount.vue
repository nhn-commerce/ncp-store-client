<template>
  <section class="order_section">
    <div class="os_top">
      <h3 class="title_style1 title">결제정보</h3>
    </div>
    <div class="os_con">
      <div class="price_box cart_price">
        <ul>
          <li>
            <dl>
              <dt>총 상품금액</dt>
              <dd>
                <strong>{{MyMiliFormat(ordersheet.paymentInfo.totalStandardAmt)}}</strong> 원</dd>
            </dl>
          </li>
          <li :class="{'is_open':detailDiscountFlag}">
            <dl>
              <dt>총 할인금액
                <button @click="showDetailDiscount" v-if="totalDiscountAmt>0" type="button" class="p_box_btn">
                  <span></span>
                </button>
              </dt>
              <dd class="pcolor1">-
                <strong>{{MyMiliFormat(totalDiscountAmt) }}</strong> 원</dd>
            </dl>
            <div class="p_box_con">
              <dl v-if="ordersheet.paymentInfo.totalImmediateDiscountAmt!==0">
                <dt>즉시할인</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.totalImmediateDiscountAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="ordersheet.paymentInfo.totalAdditionalDiscountAmt!==0">
                <dt>추가 할인</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.totalAdditionalDiscountAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="ordersheet.paymentInfo.productCouponAmt!==0">
                <dt>상품 할인쿠폰</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.productCouponAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="ordersheet.paymentInfo.cartCouponAmt!==0">
                <dt>장바구니 할인쿠폰</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.cartCouponAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="this.$store.state.ordersheet.accumulationAmt!==0">
                <dt>적립금 할인</dt>
                <dd>
                  <strong>{{MyMiliFormat(this.$store.state.ordersheet.accumulationAmt)}}</strong> 원</dd>
              </dl>
            </div>
          </li>
          <li :class="{'is_open':detailDeliveryAmtFlag}">
            <dl>
              <dt>총 배송비
                <template v-if="ordersheet.paymentInfo.deliveryAmtOnDelivery > 0">(착불배송비제외)</template>
                <button @click="showDetailDeliveryAmt" v-if="ordersheet.paymentInfo.deliveryAmt > 0 || ordersheet.paymentInfo.remoteDeliveryAmt" type="button" class="p_box_btn">
                  <span></span>
                </button>
              </dt>
              <dd>+
                <strong>{{MyMiliFormat(totalDeliveryAmt)}}</strong> 원</dd>
            </dl>
            <div class="p_box_con">
              <dl v-if="ordersheet.paymentInfo.deliveryAmt!==0">
                <dt>배송비</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.deliveryAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="ordersheet.paymentInfo.deliveryCouponAmt!==0">
                <dt>배송비 쿠폰 할인</dt>
                <dd>
                  <strong>-{{MyMiliFormat(ordersheet.paymentInfo.deliveryCouponAmt)}}</strong> 원</dd>
              </dl>
              <dl v-if="ordersheet.paymentInfo.remoteDeliveryAmt!==0">
                <dt>지역별 추가 배송비</dt>
                <dd>
                  <strong>{{MyMiliFormat(ordersheet.paymentInfo.remoteDeliveryAmt)}}</strong> 원</dd>
              </dl>
            </div>
          </li>
        </ul>
        <dl class="price_total">
          <dt>총 결제금액</dt>
          <dd>
            <strong>{{MyMiliFormat(payAmt)}}</strong> 원</dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  data () {
    return {
      detailDiscountFlag: false,
      detailDeliveryAmtFlag: false
    }
  },
  props: ['ordersheet'],
  computed: {
    totalDiscountAmt: {
      get () {
        return this.ordersheet.paymentInfo.totalAdditionalDiscountAmt +
          this.ordersheet.paymentInfo.totalImmediateDiscountAmt +
          this.ordersheet.paymentInfo.productCouponAmt +
          this.ordersheet.paymentInfo.cartCouponAmt +
          this.$store.state.ordersheet.accumulationAmt
      }
    },
    totalDeliveryAmt: {
      get () {
        return (this.ordersheet.paymentInfo.deliveryAmt +
          this.ordersheet.paymentInfo.remoteDeliveryAmt) - this.ordersheet.paymentInfo.deliveryCouponAmt
      }
    },
    payAmt: {
      get () {
        return this.ordersheet.paymentInfo.totalStandardAmt - this.totalDiscountAmt + this.totalDeliveryAmt
      }
    }
  },
  methods: {
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    showDetailDiscount () {
      this.detailDiscountFlag = !this.detailDiscountFlag
    },
    showDetailDeliveryAmt () {
      this.detailDeliveryAmtFlag = !this.detailDeliveryAmtFlag
    }
  }
}
</script>

<style>

</style>
