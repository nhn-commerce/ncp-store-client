<template>
  <section class="order_section">
    <div class="os_top">
      <h3 class="title_style1 title" v-if="type=='PAYCO'">PAYCO 전용 배송비쿠폰</h3>
      <h3 class="title_style1 title" v-else>배송비쿠폰 적용</h3>
    </div>
    <div class="os_con coupon_radio_con">

      <ul class="coupon_radio">
        <li v-if="!hasDeliveryCoupon">
          <div style="text-align: center">적용 가능한 배송비 쿠폰이 없습니다</div>
        </li>
        <li v-else>
          <div class="radio_style1">
            <input type="radio" :id="`deliveryCoupon`+type" value="0" v-model.number="deliveryCouponIssueNo" @change="calcuCoupon('order')">
            <label :for="`deliveryCoupon`+type">
              <span></span>적용안함</label>
          </div>
        </li>
        <li v-for="(deliverycoupon,idx) in orderCoupons.deliveryCoupons" :key="deliverycoupon.couponIssueNo" v-if="(type === 'PAYCO' && deliverycoupon.limitPayType === type) || (type!=='PAYCO' && deliverycoupon.limitPayType !== 'PAYCO')">
          <div class="radio_style1">
            <input type="radio" :id="'deliveryCoupon2'+type+idx" :value="deliverycoupon.couponIssueNo" v-model="deliveryCouponIssueNo" @change="calcuCoupon('order')">
            <label :for="'deliveryCoupon2'+type+idx">
              <i class="price">
                <span></span>
                <em>{{MyMiliFormat(deliverycoupon.couponDiscountAmt)}}</em>원</i>
              <i class="txt">
                {{deliverycoupon.couponName}} (
                <template v-if="deliverycoupon.fixedAmountDiscount">
                  {{MyMiliFormat(deliverycoupon.couponDiscountAmt)}}원
                </template>
                <template v-if="!deliverycoupon.fixedAmountDiscount">
                  {{deliverycoupon.discountRate}}%, 최대 {{MyMiliFormat(deliverycoupon.maxDiscountAmt)}}원
                </template>
                )
                <br> {{deliverycoupon.useEndYmdt}} 까지 사용가능
                <template v-if="deliverycoupon.limitPayType === type">
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
      orderSheetNo: this.$store.state.route.params.orderSheetNo
    }
  },
  computed: {
    deliveryCouponIssueNo: {
      get () {
        let ret = 0

        if (this.couponDeliveryClickType === '') {
          const currPaycoCoupon = this.orderSelectedPaycoCoupon.paycoCoupons.some(item => item === this.couponRequest.deliveryCouponIssueNo)
          if (currPaycoCoupon && this.type === 'PAYCO') {
            ret = this.couponRequest.deliveryCouponIssueNo
          } else if (!currPaycoCoupon && this.type === 'GENERAL') {
            ret = this.couponRequest.deliveryCouponIssueNo
          }
        } else {
          if (this.couponDeliveryClickType === this.type) {
            ret = this.couponRequest.deliveryCouponIssueNo
          }
        }

        return ret
      },
      set (val) {
        if (val === 0 && this.deliveryCouponIssueNo === 0) {
          return
        }
        this.$store.commit('ordersheet/CHANGE_COUPON_DELIVERY_CLICK_TYPE', this.type)
        this.couponRequest.deliveryCouponIssueNo = val
      }
    },
    hasDeliveryCoupon: {
      get () {
        if (!this.orderCoupons.deliveryCoupons || this.orderCoupons.deliveryCoupons.length === 0) {
          return false
        }
        const paycoDeliveryCoupon = this.orderCoupons.deliveryCoupons.filter(item => item.limitPayType === 'PAYCO')
        if (this.type === 'PAYCO') {
          return paycoDeliveryCoupon.length > 0
        } else {
          return paycoDeliveryCoupon.length !== this.orderCoupons.deliveryCoupons.length
        }
      }
    },
    ...mapState('ordersheet', ['couponDeliveryClickType']),
    ...mapGetters('ordersheet', ['orderSelectedPaycoCoupon'])
  },
  methods: {
    MyMiliFormat (val) {
      return formatCurrency(val)
    },
    calcuCoupon () {
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
