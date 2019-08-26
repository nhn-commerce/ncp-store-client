<template>
  <div id="filterView" class="sort_search" :class="showAsideView ? 'is_open' : ''">
    <a @click.prevent="showView" class="btn_filter">상세검색</a>
    <!-- aside_menu -->
    <div class="aside_menu filter_menu">
      <div class="aside_menu_top">
        <h3 class="filterTitle">
          <strong>{{filterTitle}}</strong>
          <template v-if="fromType === 'search'"> 검색결과</template>
        </h3>
        <button class="btn_close" @click="closeView()">닫기</button>
      </div>
      <div class="aside_menu_inner">
        <h4 class="aside_menu_title">카테고리 선택</h4>
        <ul class="filter_category">
          <template v-for="(depth1, index) in depthCategories">
            <li v-if="depth1.noDepth" class="no_depth" :key="index">
              <a @click.prevent="changeCategory(depth1.categoryNo)">{{depth1.label}}</a>
            </li>
            <li v-else :key="index" class="is_depth2" :class="{'is_active' : depth1.checked}">
              <a @click.prevent="clickDepth1(depth1)">{{depth1.label}}</a>
              <div class="filter_category_2" v-if="!depth1.noDepth">
                <ul>
                  <li v-for="(depth2, index) in depth1.depth2Cates" :key="index">
                    <a @click.prevent="changeCategory(depth2.categoryNo)" :class="depth2.checked ? 'is_curr' : ''">{{depth2.label}}</a>
                  </li>
                </ul>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="aside_menu_bg" @click="closeView()"></div>
    <!-- // aside_menu -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  props: ['fromType', 'filterTitle'],
  methods: {
    showView () {
      this.show_aside_view()
      document.getElementById('btnBack').style.zIndex = 9990
    },
    closeView () {
      this.hide_aside_view()
      document.getElementById('btnBack').style.zIndex = 9994
    },
    changeCategory (categoryNo) {
      this.hide_aside_view()
      this.$router.push({
        path: `${this.$route.fullPath}`,
        query: {
          categoryNo: categoryNo
        }
      })
    },
    clickDepth1 (depth1) {
      depth1.checked = !depth1.checked
    },
    ...mapMutations('search', ['show_aside_view', 'hide_aside_view'])
  },
  computed: {
    ...mapGetters('productList', ['depthCategories']),
    ...mapState('search', ['showAsideView'])
  }
}
</script>

<style>
.filterTitle {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 2rem;
}
</style>
