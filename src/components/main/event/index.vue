<template>
  <div v-if="eventBanners && eventBanners.length > 0">
    <ul class="main_banner_list main_event">
      <li v-for="banner in eventBanners" :key="banner.name">
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
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  metaInfo: {
    title: '기획전'
  },
  computed: {
    ...mapGetters('banners', ['eventBanners'])
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
