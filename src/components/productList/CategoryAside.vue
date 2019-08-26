<template>
  <div>
    <div class="aside_menu category_aside_menu">
      <div class="aside_menu_top">
        <h3>카테고리 전체보기</h3>
        <button class="btn_close" @click="closeView">닫기</button>
      </div>
      <div class="aside_menu_inner" v-if="categories">
        <ul class="sub_category">
          <CategoryCard @closeView="closeView" v-for="category in categories" :key="category.categoryNo" :category="category" />
        </ul>
      </div>
    </div>
    <div class="aside_menu_bg" @click="closeView"></div>
  </div>
</template>

<script>
import CategoryCard from './CategoryCard'
import { addClass, removeClass } from '@/utils/utils'
import { mapState } from 'vuex'
import ssq from 'jquery'

export default {
  props: ['fromType', 'filterTitle'],
  data () {
    return {
      showViewFlg: false,
      bodyScrollTop: 0
    }
  },
  methods: {
    closeView () {
      this.$emit('closeView')
    }
  },
  computed: {
    ...mapState('categories', ['categories'])
  },
  components: {
    CategoryCard
  },
  created () {
    ssq('#header').css('z-index', '9999')
    const currScroll = document.body.scrollTop | document.documentElement.scrollTop
    this.bodyScrollTop = currScroll * -1
    document.body.style.top = this.bodyScrollTop + 'px'
    addClass(document.body, 'no_scroll')
  },
  destroyed () {
    ssq('#header').css('z-index', '9994')
    removeClass(document.body, 'no_scroll')
    document.body.style.top = '0px'
    window.scrollTo(0, this.bodyScrollTop * -1)
  }
}
</script>

<style>
.icon > span {
  position: absolute;
  margin-top: 0.6rem;
  margin-left: 1.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 1px solid rgb(204, 204, 204);
  background-repeat: no-repeat;
  background-color: rgb(255, 255, 255);
  background-position: 50%;
  background-size: 3.5rem;
}

#header .category_aside_menu {
  display: block;
  -webkit-animation: asideActionRtl 0.3s ease;
  animation: asideActionRtl 0.3s ease;
}

#header .category_aside_menu + .aside_menu_bg {
  display: block;
}
</style>
