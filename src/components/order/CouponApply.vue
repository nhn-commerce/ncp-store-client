<template>
  <div class="layer_popup coupon_layer">
    <div class="popup_title">
      <h2>쿠폰적용</h2>
      <button @click="close" type="button" class="btn_close" id="closeBtn1">레이어 닫기</button>
    </div>
    <form>
      <fieldset>
        <div class="popup_inner">
          <legend class="acc-hidden">장바구니 결제 상품 선택 폼</legend>

          <div class="coupon_application_con" v-if="orderPaycoCouponCount.cartPaycoCount > 0 || orderPaycoCouponCount.paycoCount > 0 || orderPaycoCouponCount.deliveryPaycoCount">
            <div class="cac_top">
              <h2 class="title_style1 title">PAYCO 전용 쿠폰 적용</h2>
            </div>
            <coupon-cart v-if="orderPaycoCouponCount.cartPaycoCount > 0" :orderCoupons="orderCoupons" :couponRequest="couponRequest" :couponRequestGroup="couponRequestGroup" :type="`PAYCO`"></coupon-cart>
            <coupon-delivery v-if="orderPaycoCouponCount.deliveryPaycoCount > 0" :orderCoupons="orderCoupons" :couponRequest="couponRequest" :couponRequestGroup="couponRequestGroup" :type="`PAYCO`" ></coupon-delivery>
            <coupon-product-payco v-if="orderPaycoCouponCount.paycoCount > 0" :orderCoupons="orderCoupons" :couponRequest="couponRequest" :hasProductCoupon="hasProductCoupon" :productCnt="productCnt"></coupon-product-payco>
          </div>

          <section class="order_section" v-if="orderPaycoCouponCount.otherCount > 0">
            <div class="os_top">
              <h3 class="title_style1 title">상품쿠폰 적용</h3>
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
                  <coupon-product v-if="!hasPaycoCoupon(product)" :products="product" :couponRequest="couponRequest" :key="product.productNo"></coupon-product>
                </template>
              </ul>
            </div>
          </section>
          <coupon-cart :orderCoupons="orderCoupons" :couponRequest="couponRequest" :couponRequestGroup="couponRequestGroup" :type="`GENERAL`"></coupon-cart>
          <coupon-delivery :orderCoupons="orderCoupons" :couponRequest="couponRequest" :couponRequestGroup="couponRequestGroup" :type="`GENERAL`" ></coupon-delivery>
          <section class="order_section">
            <div class="os_top">
              <h3 class="title_style1 title">쿠폰 할인금액</h3>
            </div>
            <div class="os_con">
              <div class="price_box coupon_price">
                <ul>
                  <li>
                    <dl>
                      <dt>총 상품할인 금액</dt>
                      <dd>
                        <strong>{{MyMiliFormat(orderCoupons.productCouponDiscountAmt)}}</strong>원 </dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>장바구니 할인금액</dt>
                      <dd class="pcolor1">
                        <strong>{{MyMiliFormat(orderCoupons.cartCouponDiscountAmt)}}</strong>원 </dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>배송비 할인금액</dt>
                      <dd>
                        <strong>{{MyMiliFormat(orderCoupons.deliveryCouponDiscountAmt)}}</strong>원 </dd>
                    </dl>
                  </li>
                </ul>
                <dl class="price_total">
                  <dt>총 할인금액</dt>
                  <dd>
                    <strong>{{MyMiliFormat(orderCoupons.productCouponDiscountAmt+orderCoupons.cartCouponDiscountAmt+orderCoupons.deliveryCouponDiscountAmt)}}</strong>원 </dd>
                </dl>
              </div>
            </div>
          </section>
          <!-- // order_section -->
        </div>
        <!-- // popup_inner -->
        <div class="coupon_layer_btn">
          <a class="btn_style3" @click.prevent="maxCalcuCoupon">최대할인 적용</a>
          <a class="btn_style1" @click.prevent="paycoCouponAlert">쿠폰적용 완료</a>
        </div>
        <!-- // coupon_layer_btn -->
      </fieldset>
    </form>
    <coupon-apply-pop v-if="couponApplyPopShow" @closePaycoAlert="closePaycoAlert"></coupon-apply-pop>
  </div>
  <!-- // coupon_layer -->
</template>

<script>
import CouponProduct from './CouponProduct'
import CouponProductPayco from './CouponProductPayco'
import CouponApplyPop from './CouponApplyPop'
import CouponCart from './CouponCart'
import CouponDelivery from './CouponDelivery'
import { formatCurrency } from '@/utils/StringUtils'

export default {
  props: ['orderCoupons', 'orderCoponsOptionCnt', 'couponSelected', 'couponRequestGroup', 'hasProductCoupon', 'orderPaycoCouponCount', 'orderSelectedPaycoCoupon'],
  data () {
    return {
      couponApplyPopShow: false,
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      coupSelected: this.couponSelected,
      productCnt: this.orderCoupons.products.length,
      couponRequest: JSON.parse(JSON.stringify(this.couponRequestGroup)),
      oldcartCouponIssueNo: this.couponRequestGroup.cartCouponIssueNo,
      lastOtherCouponUsableN: false,
      lastCartCouponNo: 0
    }
  },
  computed: {
    discountAmt: {
      get () {
        return this.orderCoupons.productCouponDiscountAmt + this.orderCoupons.cartCouponDiscountAmt + this.orderCoupons.deliveryAmt
      }
    }
  },
  methods: {
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
    },
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    close () {
      this.$store.dispatch('ordersheet/calculateOrderConpons', { orderSheetNo: this.orderSheetNo })
      this.$emit('closePop')
    },
    paycoCouponAlert () {
      const cartPaycoCoupon = this.orderSelectedPaycoCoupon.paycoCoupons.some(item => item === this.couponRequest.cartCouponIssueNo)
      const deliveryPaycoCoupon = this.orderSelectedPaycoCoupon.paycoCoupons.some(item => item === this.couponRequest.deliveryCouponIssueNo)
      let paycoCoupon = false
      this.couponRequest.productCoupons.forEach(item => {
        if (this.orderSelectedPaycoCoupon.paycoCoupons.some(i => i === item.couponIssueNo)) {
          paycoCoupon = true
        }
        if (this.orderSelectedPaycoCoupon.paycoCoupons.some(i => i === item.plusCouponIssueNo)) {
          paycoCoupon = true
        }
      }, this)
      if (cartPaycoCoupon || paycoCoupon || deliveryPaycoCoupon) {
        this.couponApplyPopShow = true
      } else {
        this.couponApply()
      }
    },
    closePaycoAlert () {
      this.couponApplyPopShow = false
      this.couponApply()
    },
    couponApply () {
      const _this = this
      this.$store.dispatch('ordersheet/applyCouponOrder', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest }).then(() => {
        _this.$store.commit('ordersheet/CHANGE_COUPONREQUEST', _this.couponRequest)
        _this.$emit('closePop')
      })
    },
    calcuCoupon (type, otherCouponUsable) {
      if (type === 'cart') {
        if (!otherCouponUsable) {
          if (confirm('이 쿠폰 사용 시 상품쿠폰은 사용할 수 없습니다. 이 쿠폰을 사용하시겠습니까?')) {
            this.couponRequestUse(false)
            // this.lastOtherCouponUsableN = true
          } else {
            this.couponRequest.cartCouponIssueNo = this.oldcartCouponIssueNo
            return
          }
        }
        this.oldcartCouponIssueNo = this.couponRequest.cartCouponIssueNo
      }
      this.$store.dispatch('ordersheet/calculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest })
    },
    maxCalcuCoupon () {
      this.$store.dispatch('ordersheet/maxCalculateConpons', { orderSheetNo: this.orderSheetNo, couponRequest: this.couponRequest }).then(() => {
        this.oldcartCouponIssueNo = this.couponRequest.cartCouponIssueNo
      })
    },
    hasPaycoCoupon (product) {
      return product.productCoupons.some(item => item.limitPayType === 'PAYCO')
    }
  },
  components: {
    CouponProduct,
    CouponApplyPop,
    CouponCart,
    CouponProductPayco,
    CouponDelivery
  },
  beforeDestroy () {
    this.$store.commit('ordersheet/CHANGE_COUPON_CART_CLICK_TYPE', '')
    this.$store.commit('ordersheet/CHANGE_COUPON_DELIVERY_CLICK_TYPE', '')
  }
}
</script>
