<template>
  <div v-if="banners" class="main_visual_slider">
    <slick class="slider" ref="slick" :options="options" @afterChange="afterChange">
      <div v-for="banner in banners" :key="banner.imageUrl">
        <banner-link :banner="banner">
          <img :src="banner.imageUrl" alt="">
        </banner-link>
      </div>
    </slick>
    <div class="counter">
      <strong>{{currentSlide}}</strong> / {{banners.length}}</div>
    <button type="button" class="btn_open" @click="openBannerModal=true">배너 리스트 레이어 열기</button>
    <banner-modal v-if="openBannerModal" @close="openBannerModal=false" :banners="banners" :label="label"/>
  </div>
</template>

<script>
import Slick from 'vue-slick'
import BannerModal from './BannerModal'
import BannerLink from '@/components/common/BannerLink'

export default {
  props: ['banners', 'label'],
  components: {
    Slick,
    BannerModal,
    BannerLink
  },
  data () {
    return {
      options: {
        arrows: false,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        initialSlide: 0
      },
      currentSlide: 0,
      openBannerModal: false
    }
  },
  methods: {
    afterChange (event, slick, currentSlide, nextSlide) {
      this.currentSlide = currentSlide + 1
    }
  },
  created () {
    if (this.banners) {
      this.options.initialSlide = Math.floor(Math.random() * this.banners.length)
      this.currentSlide = this.options.initialSlide + 1
    }
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
/* main_visual_slider */
</style>
