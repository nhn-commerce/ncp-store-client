<template>
  <div v-if="getNoValidCoupons" class="content">
    <div class="my_coupon">
      <div v-if="getNoValidCoupons.length === 0" class="no_contents">
        <p>사용완료/기간만료된 쿠폰이 없습니다.</p>
      </div>
      <div v-if="getNoValidCoupons.length > 0" class="coupon_list">
        <ul>
          <li v-for="item in getNoValidCoupons" :key="item.couponNo" v-bind:class="['coupon_card', {coupon_won : (item.discountAmt)}, {coupon_free : (item.freeDelivery)}]">
            <div class="coupon_card_txt">
              <p class="txt couponnmover">
                {{item.couponName}}
                <span v-if="item.couponType === 'PRODUCT' " class="tag">상품쿠폰</span>
                <span v-else-if="item.couponType === 'PRODUCT_PLUS' " class="tag">상품플러스쿠폰</span>
                <span v-else-if="item.couponType === 'CART' " class="tag">장바구니쿠폰</span>
                <span v-else-if="item.couponType === 'CART_DELIVERY' " class="tag">배송비쿠폰</span>
              </p>
              <p v-if="item.discountRate" class="discount">
                {{item.discountRate}}<span>%</span>
              </p>
              <p v-if="item.discountAmt" class="discount">
                {{miliFormat(item.discountAmt)}}<span>원</span>
              </p>
              <p v-if="item.couponType === 'CART_DELIVERY' && item.freeDelivery === true" class="free">무료배송
              </p>
              </p>

              <p class="info">
                <strong>
                  <template v-if="item.discountRate"><p>최대 {{miliFormat(item.maxDiscountAmt)}}원 할인</p></template>
                  <template v-if="item.couponType === 'CART_DELIVERY'">
                    <template v-if="item.minSalePrice ">
                      장바구니금액 {{miliFormat(item.minSalePrice)}} 원
                    </template>
                    <template v-if="item.minDeliveryAmt">
                      배송비 {{miliFormat(item.minDeliveryAmt)}} 원 사용가능
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="item.minSalePrice && item.maxSalePrice">
                      {{miliFormat(item.minSalePrice)}}원 이상 ~ {{miliFormat(item.maxSalePrice)}}원 이하 사용가능
                    </template>
                    <template v-else-if="item.minSalePrice && !item.maxSalePrice">
                      {{miliFormat(item.minSalePrice)}}원 이상 사용가능
                    </template>
                    <template v-else-if="!item.minSalePrice && item.maxSalePrice">
                      {{miliFormat(item.maxSalePrice)}}원 이하 사용가능
                    </template>
                    <template v-else>
                        <template v-if="item.couponType ==='CART'">
                          장바구니 기준금액 제한 없음
                        </template>
                        <template v-else>
                          상품 기준금액 제한 없음
                        </template>
                    </template>
                  </template>
                </strong>
                <template v-if="item.used === true">
                  사용완료 {{manageDate(item.useYmdt)}}
                </template>
                <template v-if="item.used === false">
                  기간만료 {{manageDate(item.useEndYmdt)}}까지 사용가능
                </template>
              </p>
            </div>
          </li>
          <mugen-scroll :handler="moreNoCoupons" :should-handle="noLoading">
            <div id="loader" v-show="noLoading">
              <div class="loader_img"></div>
              <p class="loader_txt">불러오는 중입니다...</p>
            </div>
          </mugen-scroll>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import { mapState, mapActions } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
export default {
  metaInfo: {
    title: '사용완료/가간만료 쿠폰'
  },
  methods: {
    manageDate (date) {
      if (date) {
        let slaDate = new Date(date.replace(/-/g, '/'))
        let y = slaDate.getFullYear()
        let m = slaDate.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = slaDate.getDate()
        d = d < 10 ? ('0' + d) : d
        return y + '. ' + m + '. ' + d
      }
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    ...mapActions('validCoupon', ['moreNoCoupons'])
  },
  components: {
    MugenScroll
  },
  computed: {
    ...mapState('validCoupon', ['getNoValidCoupons', 'noLoading'])
  }
}
</script>
<style>
.couponnmover {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.coupon_list #loader {
  position: static;
  transform: none;
}
</style>

