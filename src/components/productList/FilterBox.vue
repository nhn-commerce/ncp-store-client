<template>
  <div class="filter_box">
    <div class="filter_view">
      <strong>{{miliFormat(itemCount)}}</strong>개 상품
    </div>
    <div class="filter_sort">
      <div @click="selOpen()" v-bind:class="['sort_select', {is_open : showFilterView}]">
        <a href="javascript:;">
          <span>정렬</span>
        </a>
        <ul>
          <!-- 선택 is_curr -->
          <li @click="selectCli('POPULAR:DESC')">
            <a href="javascript:;" :class="selectTypeFlg === 1 ? 'is_curr' : ''">판매인기순</a>
          </li>
          <li @click="selectCli('SALE_YMD:DESC')">
            <a href="javascript:;" :class="selectTypeFlg === 2 ? 'is_curr' : ''">신상품순</a>
          </li>
          <li @click="selectCli('DISCOUNTED_PRICE:ASC')">
            <a href="javascript:;" :class="selectTypeFlg === 3 ? 'is_curr' : ''">가격낮은순</a>
          </li>
          <li @click="selectCli('DISCOUNTED_PRICE:DESC')">
            <a href="javascript:;" :class="selectTypeFlg === 4 ? 'is_curr' : ''">가격높은순</a>
          </li>
          <li @click="selectCli('REVIEW:DESC')">
            <a href="javascript:;" :class="selectTypeFlg === 5 ? 'is_curr' : ''">상품평많은순</a>
          </li>
        </ul>
      </div>
      <div class="sort_type" v-if="fromType !== 'category'">
        <a href="#" :class="{
                list: isListType,
                card: !isListType
              }" @click.prevent="changeListType(!isListType)">
          {{isListType?'리스트 정렬 하기':'카드 정렬 하기'}}
        </a>
      </div>
      <FilterAside v-if="fromType !== 'category'" :fromType="fromType" :filterTitle="filterTitle" />
    </div>
  </div>
</template>

<script>
import FilterAside from './FilterAside'
import { formatCurrency } from '@/utils/StringUtils'
import { mapState, mapMutations } from 'vuex'

export default {
  props: {
    itemCount: Number,
    sortBy: String,
    isListType: Boolean,
    fromType: String,
    filterTitle: String
  },
  data () {
    return {
      filterSelectTypeFlg: 1
    }
  },
  components: {
    FilterAside
  },
  computed: {
    sortByVal: {
      get () {
        return this.sortBy
      },
      set (val) {
        this.changeSortBy(val)
      }
    },
    ...mapState('search', ['showFilterView']),
    selectTypeFlg: {
      get () {
        return this.sortBy === 'POPULAR:DESC' ? 1 : this.sortBy === 'SALE_YMD:DESC' ? 2 : this.sortBy === 'DISCOUNTED_PRICE:ASC' ? 3 : this.sortBy === 'DISCOUNTED_PRICE:DESC' ? 4 : this.sortBy === 'REVIEW:DESC' ? 5 : 0
      },
      set (val) {
        this.filterSelectTypeFlg = val
      }
    }
  },
  methods: {
    changeSortBy (val) {
      this.$emit('changeSortBy', val)
    },
    changeListType (val) {
      this.$emit('changeListType', val)
    },
    selectCli (selValue) {
      this.sortByVal = selValue
      if (selValue === 'POPULAR:DESC') {
        this.selectTypeFlg = 1
      } else if (selValue === 'SALE_YMD:DESC') {
        this.selectTypeFlg = 2
      } else if (selValue === 'DISCOUNTED_PRICE:ASC') {
        this.selectTypeFlg = 3
      } else if (selValue === 'DISCOUNTED_PRICE:DESC') {
        this.selectTypeFlg = 4
      } else if (selValue === 'REVIEW:DESC') {
        this.selectTypeFlg = 5
      }
    },
    selOpen () {
      this.toggle_filter_view()
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    ...mapMutations('search', ['toggle_filter_view'])
  }
}
</script>

<style>

</style>
