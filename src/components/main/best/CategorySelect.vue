<template>
  <div :class="selectedRoot==='all'?'category_menu_wrap':'category_menu_wrap menu_2'">
    <div @click="openflg = !openflg" v-click-outside="outsideLeftMenu" :class="['select_box no_over category_menu', {'open_select_list' : openflg}]">
      <a href="javascript:;">{{bestCategoryName && bestCategoryName.rootName ? bestCategoryName.rootName : '베스트전체'}}</a>
      <ul>
        <li>
          <router-link :to="`/best`">베스트 전체</router-link>
        </li>
        <li @click.stop="left_menu(category.categoryNo,category.label)" v-for="category in categories" :value="category.categoryNo" :key="category.categoryNo">
          <a href="javascript:;">{{category.label}}</a>
        </li>
      </ul>
    </div>
    <div @click="subOpenflg = !subOpenflg" v-click-outside="outsideRightMenu" v-if="currentSubCategories" :class="['select_box no_over category_menu', {'open_select_list' : subOpenflg}]">
      <a href="javascript:;">{{bestCategoryName && bestCategoryName.subName ? bestCategoryName.subName : '전체'}}</a>
      <ul>
        <li @click.stop="right_menu(category.categoryNo)" v-for="category in currentSubCategories" :value="category.categoryNo" :key="category.categoryNo">
          <a href="javascript:;">{{category.label}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ClickOutside from 'vue-click-outside'

export default {
  name: 'MainCategories',
  data () {
    return {
      openflg: false,
      subOpenflg: false,
      oneName: '베스트전체'
    }
  },
  computed: {
    selectedRoot: {
      get () {
        return this.$route.params.rootCategoryNo || 'all'
      },
      set (val) {
        if (val === 'all') {
          this.$router.push(`/best`)
          return
        }
        this.$router.push(`/best/${val}`)
      }
    },
    selectedSub: {
      get () {
        return this.$route.params.subCategoryNo || 'all'
      },
      set (val) {
        if (val === 'all') {
          this.$router.push(`/best/${this.$route.params.rootCategoryNo}`)
          return
        }
        this.$router.push(`/best/${this.$route.params.rootCategoryNo}/${val}`)
      }
    },
    ...mapGetters('categories', ['currentSubCategories', 'bestCategoryName']),
    ...mapState('categories', ['categories', 'categoryName', 'categorySubName'])
  },
  methods: {
    outsideLeftMenu () {
      this.openflg = false
    },
    outsideRightMenu () {
      this.subOpenflg = false
    },
    left_menu (val, name) {
      this.selectedRoot = val
      this.openflg = this.subOpenflg = false
    },
    right_menu (val) {
      this.selectedSub = val
      this.openflg = this.subOpenflg = false
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss">
.category-select {
  display: flex;
  > select {
    flex: 1;
    height: 4rem;
    border: 1px solid #e3e3e3;
    color: #464646;
    padding: 0 1.5rem;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 1.5rem center;
    background-image: url('../../../assets/images/icon/icon_dropdown.svg');
    background-size: 1.2rem;
    &:first-child {
      border-left: 0;
    }
    &:last-child {
      border-left: 0;
      border-right: 0;
    }
  }
}
</style>
