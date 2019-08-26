<template>
  <keep-alive>
    <content-section v-if="list" class="product_slider">
      <template slot="header">
        <h3 class="title_style1 title">베스트상품</h3>
        <router-link to="/best" class="btn_more">더보기</router-link>
      </template>
      <slick class="card_type_list slider" :options="options">
        <div v-for="product in list.slice(0, 10)" :key="product.productNo">
          <ProductCard :product="product" :listType="'wide'"></ProductCard>
        </div>
      </slick>
    </content-section>
  </keep-alive>
</template>

<script>
import $ from 'jquery'
import Slick from 'vue-slick'
import ProductCard from '@/components/common/ProductCard'
import ContentSection from './ContentSection'
import { mapState } from 'vuex'

export default {
  components: {
    Slick,
    ProductCard,
    ContentSection
  },
  data () {
    return {
      options: {
        accessibility: false,
        arrows: false,
        dots: true,
        slidesToScroll: 2,
        slidesToShow: 2,
        infinite: false
      },
      current: 0
    }
  },
  computed: {
    ...mapState('productList', ['list'])
  },
  methods: {
    afterChange (e) {
      this.current = e.detail.currentSlide / 2
    },
    clickDot (index) {
      this.$refs.carousel.lory.slideTo(index * 2)
    }
  },
  mounted () {
    // fix -webkit-line-clamp bug...
    $('.card_name').each((i, el) => {
      el.innerHTML = el.innerHTML
    })
  }
}
</script>

<style>

</style>
