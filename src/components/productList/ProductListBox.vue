<template>
  <div class="product_list_box">
    <filter-box :isListType="isListType" :itemCount="totalCount" :sortBy="sortBy" :fromType="fromType" :filterTitle="showName" @changeSortBy="setSortBy" @changeListType="changeListType"></filter-box>
    <ul v-if="fromType === 'category' && list" class="big_type_list">
      <li v-for="product in list" :key="product.productNo">
        <item-card :product="product" :type="fromType" />
      </li>
    </ul>
    <ul v-if="fromType !== 'category' && list" :class="listTypeClass">
      <li v-for="product in list" :key="product.productNo">
        <product-card :product="product" :listType="isListType ? '' : 'wide'"/>
      </li>
    </ul>
    <div>
      <div id="loader" v-show="!list" :style="loaderStyle">
        <div class="loader_img"></div>
        <p class="loader_txt">불러오는 중입니다...</p>
      </div>

      <p class="sch_notice_txt" v-if="list && list.length === 0">
        <template v-if="fromType === 'category'">
          선택하신 카테고리의 베스트 상품이 없습니다.
          <br>다른 카테고리를 선택하세요
        </template>
        <template v-if="fromType === 'brand'">
          선택하신 브랜드의 베스트 상품이 없습니다.
          <br>다른 브랜드를 선택하세요
        </template>
        <template v-if="fromType === 'search'">
          <strong>{{showName}}</strong>에 대한 검색결과가 없습니다.
          <br> 다른 검색어로 다시 검색 해 보세요.
        </template>
      </p>
      <div class="content_wide_section" v-if="list && list.length === 0 && fromType === 'search' && bestList">
        <div class="content_wide_section_top">
          <h3 class="title_style1 title">{{mallName}} BEST</h3>
          <p class="sub_title">지금 {{mallName}}에서 인기 있는 상품을 확인 하세요</p>
        </div>
        <div class="best_list">
          <ul class="list_type_list type2">
            <li v-for="(product, index) in bestList.items" :key="product.productNo">
              <product-card :product="product" />
              <div class="best_num">{{index+1}}</div>
            </li>
          </ul>
        </div>
      </div>

      <mugen-scroll :handler="fetchMore" :should-handle="!pending.list && list && list.length<totalCount && pageCount!==0">
        <div id="loader" v-show="list && list.length < totalCount && pageCount!==0">
          <div class="loader_img"></div>
          <p class="loader_txt">불러오는 중입니다...</p>
        </div>
      </mugen-scroll>
    </div>
  </div>
</template>

<script>
import MugenScroll from 'vue-mugen-scroll'
import ProductCard from '@/components/common/ProductCard'
import ItemCard from '@/components/common/ItemCard'
import FilterBox from './FilterBox'
import { mapState, mapActions } from 'vuex'
import config from '@/config'

export default {
  props: ['fromType', 'showName'],
  data () {
    return {
      isListType: this.$store.state.route.query.isListType ? this.$store.state.route.query.isListType === 'true' : true,
      loaderStyle: {
        marginTop: '40%',
        marginBottom: '50%'
      },
      mallName: config.mallName
    }
  },
  components: {
    MugenScroll,
    ProductCard,
    ItemCard,
    FilterBox
  },
  computed: {
    listTypeClass () {
      return {
        'gallery_type_list wide': !this.isListType,
        'list_type_list type2': this.isListType
      }
    },
    sortBy: {
      get () {
        return this.$store.state.route.query.sortBy ? this.$store.state.route.query.sortBy : this.fetchListParams['order.by'] + ':' + this.fetchListParams['order.direction']
      }
    },
    ...mapState('productList', ['list', 'totalCount', 'pageCount', 'fetchListParams', 'pending', 'bestList'])
  },
  methods: {
    setSortBy (val) {
      this.$router.push({
        path: `${this.$route.fullPath}`,
        query: {
          sortBy: val
        }
      })
    },
    changeListType (val) {
      this.isListType = val
      this.$router.replace({
        path: `${this.$route.fullPath}`,
        query: {
          isListType: val
        }
      })
    },
    ...mapActions('productList', ['fetchMore'])
  }
}
</script>

<style>
.product_list_box #loader {
  position: static;
  transform: none;
}
</style>
