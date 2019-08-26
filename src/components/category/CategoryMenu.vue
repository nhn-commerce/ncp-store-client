<template>
  <div class="category_menu_wrap cat_area">
    <div :class="['select_box no_over category_menu',{'open_select_list' : showItem}]">
      <a class="btn_cat_detail" @click.prevent="showItem = !showItem" v-click-outside="outsideLabel">
        <template v-for="(categorie, index) in categories">
          <template v-if="index !== 0">
            <span>&gt;</span>
          </template>
          {{categorie.label}}
        </template>
      </a>
      <ul>
        <li v-for="item in depthCategories" :class="{'now': item.isSelected}" :key="item.categoryNo" @click.prevent="hide_filter_view">
          <router-link :to="item.link_to">
            <span>{{item.label}}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import { mapMutations, mapGetters } from 'vuex'

export default {
  props: ['categories'],
  data () {
    return {
      showItem: false
    }
  },
  computed: {
    ...mapGetters('categories', ['productCates']),
    depthCategories () {
      return this.productCates(this.categories)
    }
  },
  methods: {
    outsideLabel () {
      this.showItem = false
    },
    ...mapMutations('search', ['hide_filter_view'])
  },
  directives: {
    ClickOutside
  }
}
</script>

<style>

</style>
