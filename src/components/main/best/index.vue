<template>
  <div>
    <CategorySelect/>
    <div v-if="list" class="best_list">
      <ul class="list_type_list type5">
        <li v-for="(product, index) in list" :key="product.productNo">
          <product-card :product="product" :type="'best'" :bestNum="index+1"/></product-card>
          <!-- <div class="best_num">{{index+1}}</div> -->
        </li>
      </ul>
      <mugen-scroll :handler="fetchMoreBest" :should-handle="!pending.list && list.length<totalCount && list.length<99">
        <div id="loader" v-show="list.length<totalCount && list.length<99">
          <div class="loader_img"></div>
          <p class="loader_txt">불러오는 중입니다...</p>
        </div>
      </mugen-scroll>
    </div>
    <div id="loader" v-show="!list">
      <div class="loader_img"></div>
      <p class="loader_txt">불러오는 중입니다...</p>
    </div>
    <p class="sch_notice_txt" v-if="list && list.length === 0">
      선택하신 카테고리의 베스트 상품이 없습니다. <br>다른 카테고리를 선택하세요
    </p>
  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import ProductCard from '@/components/common/ProductCard'
import CategorySelect from './CategorySelect'
import { mapState, mapActions } from 'vuex'

export default {
  metaInfo: {
    title: '베스트'
  },
  components: {
    MugenScroll,
    ProductCard,
    CategorySelect
  },
  computed: {
    ...mapState('productList', ['list', 'pending', 'totalCount'])
  },
  methods: {
    ...mapActions('productList', ['fetchMoreBest'])
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
/* main_best */

.best_list #loader {
  position: static;
  transform: none;
}
</style>
