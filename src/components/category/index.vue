<template>
  <div class="category_contents">
    <Loading></Loading>
    <CategoryMenu :categories="selectCates" v-if="selectCates" />
    <SliderMenu v-if="slickCategories && slickCategories.length > 1" :slickOptions="dotsOptions" :slickCategories="slickCategories" />
    <SliderMenu v-if="slickCategories && slickCategories.length === 1" :slickOptions="noDotsOptions" :slickCategories="slickCategories" />
    <template v-for="cateBanner in categoryBanner" v-if="categoryBanner && showCategoryName">
      <slick class="visual_banner_slider" ref="slickCategory" :options="categoryOptions" :key="cateBanner.accountNo" v-if="cateBanner.accountName === showCategoryName">
        <div v-for="banner in cateBanner.banners" :key="banner.accountNo">
          <template v-if="banner.landingUrlType === 'GENERAL'">
            <router-link :to="banner.landingUrl">
              <img :src="banner.imageUrl" alt="">
            </router-link>
          </template>
          <template v-if="banner.landingUrlType === 'EVENT'">
            <router-link :to="`/event/${banner.landingUrl}`">
              <img :src="banner.imageUrl" alt="">
            </router-link>
          </template>
        </div>
      </slick>
    </template>
    <ProductListBox :fromType="'category'"></ProductListBox>
  </div>
</template>

<script>
import SliderMenu from '@/components/category/SliderMenu'
import CategoryMenu from './CategoryMenu'
import ProductListBox from '@/components/productList/ProductListBox'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Slick from 'vue-slick'
import Loading from '../common/Loading'

export default {
  data () {
    return {
      dotsOptions: {
        dots: true,
        draggable: true,
        autoplay: false,
        arrows: false
      },
      noDotsOptions: {
        dots: false,
        draggable: true,
        autoplay: false,
        arrows: false
      },
      categoryOptions: {
        dots: true,
        draggable: true,
        autoplay: true,
        arrows: false,
        autoplaySpeed: 4000
      }
    }
  },
  metaInfo: {
    title: '상품리스트'
  },
  components: {
    CategoryMenu,
    SliderMenu,
    ProductListBox,
    Slick,
    Loading
  },
  computed: {
    ...mapState('categories', ['slickCategories']),
    ...mapGetters('categories', ['showCategoryName', 'selectCates']),
    ...mapGetters('banners', ['categoryBanner'])
  },
  methods: {
    ...mapMutations('categories', ['EMPTY_SLICK_CATEGORIES'])
  },
  beforeRouteUpdate (to, from, next) {
    this.EMPTY_SLICK_CATEGORIES()
    next()
  },
  beforeRouteLeave (to, from, next) {
    this.EMPTY_SLICK_CATEGORIES()
    next()
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      setTimeout(function () { that.$store.commit('loading/done') }, 300)
    })
  },
  destroyed () {
    this.$store.commit('loading/init')
  }
}
</script>

<style>

</style>
