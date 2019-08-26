<template>
  <li v-bind:class="['coupon_card' , {'coupon_won' : (item.discountInfo.discountAmt)}, {'coupon_free' : (item.discountInfo.freeDelivery)}]">
    <div class="coupon_card_txt">
      <p class="txt couponnmover">{{item.couponName}}</p>
      <p class="free" v-if="item.discountInfo.freeDelivery">무료배송</p>
      <p class="discount" v-else>
        <template v-if="item.discountInfo.discountRate">
          {{item.discountInfo.discountRate}}
          <span>%</span>
        </template>
        <template v-else>
          {{miliFormat(item.discountInfo.discountAmt)}}
          <span>원</span>
        </template>
      </p>
      <p class="info">
        <template v-if="item.discountInfo.discountRate && item.discountInfo.maxDiscountAmt">
          <p>최대 {{miliFormat(item.discountInfo.maxDiscountAmt)}}원 할인</p>
        </template>
        <template v-if="item.useConstraint.minSalePrice && item.useConstraint.maxSalePrice">
          {{miliFormat(item.useConstraint.minSalePrice)}}원 이상 ~ {{miliFormat(item.useConstraint.maxSalePrice)}}원 이하 사용가능
        </template>
        <template v-else-if="item.useConstraint.minSalePrice && !item.useConstraint.maxSalePrice">
          {{miliFormat(item.useConstraint.minSalePrice)}}원 이상 사용가능
        </template>
        <template v-else-if="!item.useConstraint.minSalePrice && item.useConstraint.maxSalePrice">
          {{miliFormat(item.useConstraint.maxSalePrice)}}원 이하 사용가능
        </template>
      </p>
      <div class="dateInfo" v-if="type !== 'event'">{{manageDate(item.dateInfo.issueEndYmdt )}}까지 발급 가능</div>
    </div>
    <button @click.prevent="downLoad" class="btn">COUPON DOWNLOAD</button>
  </li>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
import { getStrDate } from '@/utils/dateUtils'
export default {
  props: ['item', 'type'],
  methods: {
    downLoad () {
      if (!this.$store.getters.isLogined) {
        this.$store.dispatch('authentication/callUnauthUrlScheme')
      } else {
        const nowHour = new Date().getHours()
        const nowWeek = new Date().getDay()
        let issueDaysOfWeeks = JSON.parse(this.item.dateInfo.issueDaysOfWeek)
        issueDaysOfWeeks = issueDaysOfWeeks.map(item => {
          if (item === '7') {
            return '0'
          } else {
            return item
          }
        })
        if (nowHour < this.item.dateInfo.issueStartHour || nowHour > this.item.dateInfo.issueEndHour) {
          alert(this.item.dateInfo.issueStartHour + '시 ~ ' + this.item.dateInfo.issueEndHour + '시에만 발급 가능한 할인쿠폰 입니다.')
          return
        } else if (!issueDaysOfWeeks.some(item => item === nowWeek.toString())) {
          const weeks = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
          let weekMsg = ''
          issueDaysOfWeeks.forEach(item => {
            if (weekMsg.length > 0) {
              weekMsg += ', '
            }
            weekMsg += weeks[parseInt(item)]
          })
          alert(weekMsg + '에 발급 가능한 할인쿠폰 입니다.')
          return
        }

        if (this.type === 'event') {
          this.$emit('downLoad', this.item.couponNo)
        } else {
          const productNo = this.$store.state.route.params.productId
          this.$store.dispatch('coupon/downLoadCoupons', { couponNo: this.item.couponNo, productNo })
        }
      }
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    manageDate (date) {
      return getStrDate(date, '. ')
    }
  }
}
</script>

<style>
.couponnmover {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.coupon_card_txt .dateInfo {
  margin-top: 0;
  font-weight: 300;
  font-size: 1.2rem;
  letter-spacing: -0.01em;
  line-height: 1.8rem;
  color: rgb(180, 180, 180);
}
</style>
