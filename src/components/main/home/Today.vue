<template>
  <content-section v-if="todayProduct" class="time_deal_banner">
    <template slot="header">
      <h3 class="title_style1 title">{{ today.label }}</h3>
      <router-link to="/today" class="btn_more">더보기</router-link>
    </template>
    <div class="big_type_list banner">
      <ProductCard :product="todayProduct"></ProductCard>
    </div>
  </content-section>
</template>

<script>
import Countdown from '@/components/common/Countdown'
import ProductCard from '@/components/main/today/ProductCard'
import ContentSection from './ContentSection'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      timer: 0
    }
  },
  components: {
    Countdown,
    ProductCard,
    ContentSection
  },
  computed: {
    ...mapState('display', ['today']),
    ...mapGetters('display', ['todayProduct'])
  }
}
</script>

<style>

</style>
