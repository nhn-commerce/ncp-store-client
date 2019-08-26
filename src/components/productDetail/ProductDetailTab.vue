<template>
  <div class="pd_tab" id="productDetailTab">
    <h3 :class="['tab_menu', {is_open : (isOpen==='product')}]">
      <a @click.prevent="sendClick('product')">상세정보</a>
    </h3>
    <h3 :class="['tab_menu', {is_open : (isOpen==='review')}]">
      <a @click.prevent="sendClick('review')">상품평 <span v-if="product.counter.reviewCnt > 0">{{miliFormat(product.counter.reviewCnt)}}</span></a>
    </h3>
    <h3 :class="['tab_menu', {is_open : (isOpen==='inquiry')}]">
      <a @click.prevent="sendClick('inquiry')">상품문의 <span v-if="product.counter.inquiryCnt > 0">{{miliFormat(product.counter.inquiryCnt)}}</span></a>
    </h3>
    <h3 :class="['tab_menu', {is_open : (isOpen==='info')}]">
      <a @click.prevent="sendClick('info')">반품/교환</a>
    </h3>
    <keep-alive>
      <router-view class="tab_con"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  data () {
    return {
      isOpen: 'product'
    }
  },
  props: ['product'],
  methods: {
    sendClick (type) {
      this.isOpen = type
      let url = '/product/'
      switch (type) {
        case 'review':
          url += 'review/'
          break
        case 'inquiry':
          url += 'inquiry/'
          break
        case 'info':
          url += 'info/'
          break
      }
      url += this.$route.params.productId

      this.$router.replace({
        path: url,
        query: {
          preview: this.$route.query.preview,
          searchProductID: this.$route.query.searchProductID
        }
      })
    },
    miliFormat (num) {
      return formatCurrency(num)
    }
  },
  created () {
    switch (this.$route.name) {
      case 'ProductDetailReview':
        this.isOpen = 'review'
        break
      case 'ProductDetailInquiry':
        this.isOpen = 'inquiry'
        break
      case 'ProductDetailMoreInfo':
        this.isOpen = 'info'
        break
      default:
        this.isOpen = 'product'
        break
    }
  }
}
</script>

<style>

</style>

