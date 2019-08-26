<template>
  <li class="ctl_item">
    <!-- ctl_item_top -->
    <div class="ctl_item_top">
      <div class="check_style1">
        <input type="checkbox" :id="option.idx" v-model="checkGo" @change="checkedOption" :disabled="soldOut">
        <label :for="option.idx">
          <span></span>{{option.brandName}}
        </label>
      </div>
      <router-link :to="soldOut? '' : `/product/${option.productNo}`">
        {{option.productName}}
      </router-link>
      <a @click.prevent="delOption" class="btn_del">삭제하기</a>
    </div>
    <!-- // ctl_item_top -->
    <!-- ctl_item_info -->
    <div class="ctl_item_info">
      <div class="ctl_photo">
        <router-link :to="soldOut? '' : `/product/${option.productNo}`">
          <img v-if="option.imageUrl" :src="option.imageUrl" />
          <img v-else src="../../assets/images/content/buywow_default.jpg" />
        </router-link>
      </div>
      <div class="ctl_txt_box">
        <div class="ctl_option">
          <span v-for="showOption in option.showOptions" :key="showOption.index">{{showOption}}</span>
        </div>
        <div class="ctl_price">
          <div class="ctl_p_top" v-if="soldOut">
            <p class="total">
              <strong>구매불가</strong>
            </p>
            <p class="txt">이 상품은 상품정보 변경 또는 재고소진으로 주문이 불가합니다.</p>
          </div>
          <div class="ctl_p_top" v-bind:class="showPriceFlg?'is_open':''" v-if="!soldOut">
            <p class="total">
              <strong>{{option.showPrice}}</strong>원
            </p>
            <p class="txt">
              <span v-bind:class="option.bundledFirst?'':'no_charge'">{{option.showShippingFee}}</span>
              <strong v-if="option.bundledFlg">묶음배송</strong>
              <span class="no_refundable" v-if="!option.refundable">환불불가</span>
            </p>
            <button type="button" class="ctl_p_btn" @click.prevent="showDetailPrice">
              <span></span>
            </button>
          </div>
          <div class="ctl_p_detail">
            <dl>
              <dt>상품금액</dt>
              <dd>
                <strong>{{option.showStandardAmt}}</strong> 원</dd>
            </dl>
            <dl>
              <dt>할인금액</dt>
              <dd>
                <strong>{{option.showDiscountAmt}}</strong> 원</dd>
            </dl>
            <dl>
              <dt>할인 적용금액</dt>
              <dd class="pcolor1">
                <strong>{{option.showPrice}}</strong> 원</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <!-- // ctl_item_info -->
    <!-- ctl_item_btn -->
    <div class="ctl_item_btn" v-if="!soldOut">
      <div class="ctl_quantity">
        <a class="minus" @click.prevent="cntSet('minus')">
          <img src="../../assets/images/btn/btn_minus_sq.png" alt="">
        </a>
        <input type="number" v-model="option.orderCnt" @change.prevent="cntSet">
        <a class="plus" @click.prevent="cntSet('plus')">
          <img src="../../assets/images/btn/btn_plus_sq.png" alt="">
        </a>
      </div>
      <a @click.prevent="buy" class="btn_buy btn_style3">바로구매</a>
    </div>
    <!-- ctl_item_btn -->
  </li>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['option', 'soldOut'],
  data () {
    return {
      checked: true,
      showPriceFlg: false
    }
  },
  methods: {
    buy () {
      const products = [{
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        cartNo: this.option.cartNo,
        optionInputs: this.option.optionInputs
      }]

      delete window.localStorage.orderinfo
      const orderinfo = {
        option: JSON.stringify(products),
        fromUrl: this.$route.fullPath
      }
      window.localStorage.orderinfo = JSON.stringify(orderinfo)
      this.$router.push({
        path: '/order/getsheetno'
      })
    },
    delOption () {
      if (confirm('상품을 삭제하시겠습니까?')) {
        const options = []
        options.push(this.option)
        this.$store.dispatch('cart/deleteCartByOptions', options)
      }
    },
    cntSet (type) {
      if (type === 'plus') {
        this.option.orderCnt += 1
      } else if (type === 'minus') {
        this.option.orderCnt -= 1
      }
      if (this.option.orderCnt < 1) {
        this.option.orderCnt = 1
      }
      if (this.option.orderCnt > 9999) {
        this.option.orderCnt = 9999
      }
      if (this.checked) {
        this.checkOptions.forEach(item => {
          if (item.cartNo === this.option.cartNo) {
            item.orderCnt = this.option.orderCnt
          }
        })
      }
      const carts = [this.option]
      this.$store.dispatch('cart/putCarts', carts)
    },
    checkedOption () {
      const checkOption = {
        checked: this.checked,
        cartNo: this.option.cartNo,
        productNo: this.option.productNo,
        optionNo: this.option.optionNo,
        orderCnt: this.option.orderCnt,
        optionInputs: this.option.optionInputs,
        payOnDelivery: this.option.payOnDelivery
      }
      this.$store.commit('cart/CHECK_OPTION', checkOption)
      this.$store.dispatch('cart/calculate')
    },
    showDetailPrice () {
      this.showPriceFlg = !this.showPriceFlg
    }
  },
  computed: {
    checkGo: {
      // getter
      get () {
        return this.checkOptions.some(item => {
          if (item.cartNo === this.option.cartNo) {
            return true
          }
          return false
        })
      },
      // setter
      set (newValue) {
        this.checked = newValue
      }
    },
    ...mapState('cart', ['checkOptions'])
  }
}
</script>

<style>

</style>
