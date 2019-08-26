<template>
  <div class="coupon_list" v-if="event.coupon.coupons && event.coupon.coupons.length > 0">
    <ul>
      <couponItem v-for="couponItem in event.coupon.coupons" :key="couponItem.couponNo" :item="couponItem" :type="'event'" @downLoad="downLoad"></couponItem>
    </ul>
    <div v-if="event.coupon.guideImageUrl">
      <a @click.prevent="showPop" class="btn_notice" id="couponNotice">쿠폰 유의사항</a>
    </div>
    <EventPop v-show="showPopFlg" @closePop="closePop" :popType="popType" :infoHtml="event.coupon.guideImageUrl"></EventPop>
  </div>
</template>

<script>
import CouponItem from '@/components/common/CouponItem'
import EventPop from '@/components/event/EventPop'

export default {
  props: ['event'],
  data () {
    return {
      showPopFlg: false,
      popType: 'notice'
    }
  },
  methods: {
    showPop () {
      this.popType = 'notice'
      this.showPopFlg = true
    },
    closePop () {
      this.showPopFlg = false
    },
    downLoad (couponNo) {
      this.$store.dispatch('coupon/eventDownLoad', { couponNo }).then(() => {
        this.popType = 'success'
        this.showPopFlg = true
      })
    }
  },
  components: {
    CouponItem,
    EventPop
  }
}
</script>
