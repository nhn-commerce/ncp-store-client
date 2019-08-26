<template>
  <div class="main_wrap" v-if="!page.initDataFetching">
    <Banner v-if="mainTopBanners" :banners="mainTopBanners" :label="banners[0].label"/>
    <Today/>
    <!-- <Best/> -->
    <Banner v-if="magicBanners" :banners="mainMagicBanners" :label="magicBanners[0].label"/>
    <SectionArea v-if="homeProducts" :products="homeProducts" :categories="flatCategories"/>
  </div>
</template>

<script>
import Banner from './Banner'
import Today from './Today'
import Best from './Best'
import SectionArea from './SectionArea'
import { mapState, mapGetters } from 'vuex'
import config from '@/config'

export default {
  metaInfo: {
    title: config.mallName,
    titleTemplate: null
  },
  components: {
    Banner,
    Today,
    Best,
    SectionArea
  },
  computed: {
    ...mapState(['page']),
    ...mapState('banners', ['magicBanners', 'banners']),
    ...mapGetters('display', ['homeProducts']),
    ...mapGetters('banners', ['mainTopBanners', 'mainMagicBanners']),
    ...mapGetters('common', ['flatCategories'])
  }
}
</script>

<style>
</style>
