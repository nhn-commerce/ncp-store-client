<template>
  <div>
    <Loading></Loading>
    <div v-if="product" class="product_wrap">
      <ProductSlider></ProductSlider>
      <ProductInfo></ProductInfo>
      <ProductDetailTab :product="product"></ProductDetailTab>
      <ProductDetailBottom></ProductDetailBottom>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductSlider from './ProductSlider'
import ProductInfo from './ProductInfo'
import ProductDetailTab from './ProductDetailTab'
import ProductDetailBottom from './ProductDetailBottom'
import Loading from '../common/Loading'
import $ from 'jquery'
// import config from '@/config'

export default {
  metaInfo: {
    title: '상품상세',
    bodyAttrs: {
      class: 'floating_bottom'
    }
  },
  name: 'ProductDetail',
  data () {
    return {
    }
  },
  components: {
    ProductSlider,
    ProductInfo,
    ProductDetailTab,
    ProductDetailBottom,
    Loading
  },
  computed: {
    ...mapState('product', {
      product: state => state.product
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.product) {
      this.product.baseInfo.imageUrls = null
    }
    next()
  },
  beforeRouteEnter (to, from, next) {
    $('body').addClass('floating_bottom')
    next()
  },
  beforeCreate () {
    // const empNo = sessionStorage.getItem('empNo')
    // const productNo = this.$route.path.split('/')[2]
    // if (config.internalProductNos.indexOf(productNo) !== -1 && !empNo) {
    //   window.location.href = '/member/internal?next=' + this.$route.fullPath
    // }
  }
}
</script>

<style>

</style>
