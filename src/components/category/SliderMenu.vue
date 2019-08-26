<template>
  <slick class="category_slider_menu" ref="slick" :options="slickOptions">
    <ul class="menu" v-for="cate in slickCategories" :key="cate.length">
      <template v-for="item in cate">
        <li :key="item.link_to" @click.prevent="hide_filter_view">
          <router-link :to="`${item.link_to}`" exact-active-class="is_curr">{{item.label}}</router-link>
        </li>
      </template>
    </ul>
  </slick>
</template>

<script>
import Slick from 'vue-slick'
import { mapMutations } from 'vuex'

export default {
  props: ['slickOptions', 'slickCategories'],
  components: {
    Slick
  },
  methods: {
    ...mapMutations('search', ['hide_filter_view'])
  }
}
</script>

<style>

</style>
