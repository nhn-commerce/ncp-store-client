<template>
  <slick class="category_slider_menu" ref="slick" :options="slickOptions">
    <ul class="menu" v-for="page in event.slickMenu" :key="page.index">
      <template v-for="item in page">
        <li :key="item.label" @click="setPage(page.index)">
          <a @click.prevent="goEvent(item.to)">{{ item.label }}</a>
        </li>
      </template>
    </ul>
  </slick>
</template>

<script>
import Slick from 'vue-slick'
import $ from 'jquery'

export default {
  props: ['event', 'slickOptions'],
  methods: {
    setPage (index) {
      this.slickOptions.initialSlide = index
    },
    goEvent (to) {
      let sectionOffsetTop = $(to).offset().top
      let headerHeight = $('.sub_header').height()
      $(window).scrollTop(sectionOffsetTop - headerHeight - 10)
    }
  },
  components: {
    Slick
  }
}
</script>
