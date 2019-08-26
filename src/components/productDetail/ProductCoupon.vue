<template>
  <div>
    <div class="full_layer_title">
      <h3>할인쿠폰 다운로드</h3>
      <a type="button" class="btn_close" @click="closeLayer">레이어 닫기</a>
    </div>
    <div class="full_layer" id="couponDownPop">
      <div class="full_layer_inner" v-if="compare">
        <div class="full_layer_con">
          <div class="coupon_list">
            <ul>
              <couponItem v-for="item in compare" :key="item.couponNo" :item="item"></couponItem>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { removeClass } from '@/utils/utils'
import CouponItem from '@/components/common/CouponItem'

export default {
  data () {
    return {
      coupon_card: 'coupon_card',
      coupon_won: 'coupon_won'
    }
  },
  methods: {
    closeLayer () {
      removeClass(document.body, 'is_layer_open')
    }
  },
  computed: {
    ...mapGetters('coupon', ['compare'])
  },
  components: {
    CouponItem
  }
}
</script>
<style>

</style>

