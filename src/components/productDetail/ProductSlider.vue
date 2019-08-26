<template>
  <div class="pv_slider">
    <template v-if="product.baseInfo.imageUrls">
      <slick class="slider" ref="slick" :options="slickOptions" @afterChange="afterChange">
        <div v-for="(image, i) in product.baseInfo.imageUrls" :key="image">
          <img :src="image" @load="setHeight(i)" />
        </div>
      </slick>
      <div class="counter">
        <strong>{{currentSlide}}</strong> / {{product.baseInfo.imageUrls.length}}
      </div>
    </template>
    <template v-if="product.baseInfo.defaultImages === 'default'">
      <slick class="slider" ref="slick" :options="slickOptions" @afterChange="afterChange">
        <div>
          <img src="../../assets/images/content/buywow_default.jpg" />
        </div>
      </slick>
      <div class="counter">
        <strong>1</strong> / 1
      </div>
    </template>
    <div class="btn_wish">
      <a v-if="product" :class="{wish_on:product.liked,wish_off:!product.liked}" @click.prevent="likeIt">위시리스트추가</a>
    </div>
  </div>
</template>

<script>
import Slick from 'vue-slick'
import { mapState, mapGetters } from 'vuex'
import $ from 'jquery'
export default {
  components: {
    Slick
  },
  data () {
    return {
      slickOptions: {
        autoplay: false,
        arrows: false,
        adaptiveHeight: true
      },
      currentSlide: 1,
      slideCount: 0,
      showShare: false,
      running: false
    }
  },
  computed: {
    ...mapState('product', ['product']),
    ...mapGetters('authentication', ['isAvailableMember'])
  },
  methods: {
    setHeight (index) {
      if (index !== 0) {
        return
      }
      const $img = $('.pv_slider .slick-slide[data-slick-index=0] img')
      $('.pv_slider .slick-list').height($img.height())
    },
    afterChange (event, slick, currentSlide) {
      this.currentSlide = slick.currentSlide + 1
    },
    onInit (event, slick) {
      this.currentSlide = 1
      this.slideCount = slick.slideCount
    },
    likeIt () {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        const _this = this
        this.$store.dispatch('likeProducts/postLikeProducts', [this.product.baseInfo.productNo]).then(() => {
          const productNo = this.product.baseInfo.productNo
          _this.$store.commit('product/CHANGELIKED', productNo)
          _this.$store.commit('display/CHANGELIKED', productNo)
          _this.running = false
        }).catch((e) => {
          _this.running = false
        })
      }
    }
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      setTimeout(function () { that.$store.commit('loading/done') }, 500)
    })
  },
  destroyed () {
    this.$store.commit('loading/init')
  }
}
</script>

<style>
/* @import '~slick-carousel/slick/slick.css'; */
</style>
