<template>
  <div class="sub_menu">
    <router-link to="/">홈</router-link>
    <router-link to="/best" class="best">베스트</router-link>
    <router-link to="/today">오늘의특가</router-link>

    <router-link :to="`/category/${item.categoryNo}`" v-for="item in categories" :key="item.categoryNo">{{ item.label }}</router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'main-nav',
  computed: {
    ...mapState('categories', ['categories'])
  }
}
</script>

<style>
.sub_menu > a.router-link-exact-active {
  position: relative;
  border-bottom: 0.2rem solid var( --theme-color ); 
  color: var( --theme-color );
}

.sub_menu > .best.router-link-active {
  position: relative;
  color: var( --theme-color );
}
</style>
