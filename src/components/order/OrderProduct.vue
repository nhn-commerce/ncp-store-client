<template>
  <li class="ctl_item">
    <!-- ctl_item_info -->
    <div class="ctl_item_info">
      <div class="ctl_photo">
        <router-link :to="`/product/${option.productNo}`" tag="a"><img :src="option.imageUrl" alt=""></router-link>
      </div>
      <div class="ctl_txt_box">
        <p class="ctl_name">
          <strong>{{option.brandName}}</strong>
          <router-link :to="`/product/${option.productNo}`" tag="a">{{option.productName}}</router-link>
        </p>
        <div class="ctl_option">
          <span v-for="txt in option.optionText" :key="txt">{{txt}}</span>
        </div>
        <div class="ctl_price">
          <div :class="{'ctl_p_top is_open':moreShow,'ctl_p_top':!moreShow}">
            <p class="total">
              <strong>{{MyMiliFormat(option.price.buyAmt)}}</strong>원</p>
            <p class="txt">{{option.deliveryAmtText}}
              <strong v-if="option.gdelivery">{{option.gdelivery}}</strong>
            </p>
            <button type="button" class="ctl_p_btn" @click.prevent="more()">
              <span></span>
            </button>
          </div>
          <div class="ctl_p_detail">
            <dl>
              <dt>상품금액</dt>
              <dd>
                <strong>{{MyMiliFormat(option.price.optSalePrice) }}</strong> 원</dd>
            </dl>
            <dl>
              <dt>할인금액</dt>
              <dd>
                <strong>{{MyMiliFormat(option.price.discountAmt) }}</strong> 원</dd>
            </dl>
            <dl>
              <dt>할인 적용금액</dt>
              <dd class="pcolor1">
                <strong>{{MyMiliFormat(option.price.myPrice) }}</strong> 원</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <!-- // ctl_item_info -->
  </li>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  props: ['option'],
  data () {
    return {
      moreShow: false
    }
  },
  methods: {
    more () {
      this.moreShow = !this.moreShow
    },
    MyMiliFormat (v) {
      return formatCurrency(v)
    }
  }
}
</script>

<style>

</style>
