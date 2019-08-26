<template>
  <div v-if="todaysdealProduct">
    <div class="today_con">
      <ul class="big_type_list">
        <li v-for="product in todaysdealProduct" :key="product.productNo">
          <ProductCard :product="product"></ProductCard>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCard from '@/components/main/today/ProductCard'
export default {
  metaInfo: {
    title: 'WOW딜'
  },
  computed: {
    ...mapGetters('display', ['todaysdealProduct'])
  },
  components: {
    ProductCard
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
