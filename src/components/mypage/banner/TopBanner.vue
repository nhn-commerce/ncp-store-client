<template>
  <div v-if="myPageTopBanners && myPageTopBanners.length > 0" class="visual_banner_slider">
    <slick ref="slick" :options="slickOptions">
      <div v-for="banner in myPageTopBanners" :key="banner.imageUrl">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Slick from 'vue-slick'

export default {
  components: {
    Slick
  },
  data () {
    return {
      slickOptions: {
        dots: true,
        draggable: true,
        autoplay: true,
        arrows: false,
        autoplaySpeed: 4000,
        initialSlide: 0
      }
    }
  },
  computed: {
    ...mapGetters('banners', ['myPageTopBanners'])
  },
  methods: {
  },
  created () {
    if (this.myPageTopBanners) {
      this.slickOptions.initialSlide = Math.floor(Math.random() * this.myPageTopBanners.length)
      this.slickOptions.dots = this.myPageTopBanners.length > 1
    }
  },
  beforeUpdate () {
    this.slickOptions.dots = this.myPageTopBanners.length > 1
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
