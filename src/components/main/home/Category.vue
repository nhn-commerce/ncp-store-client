<template>
  <div class="category_swipe_menu_wrap">
    <div class="category_swipe_menu">
      <router-link :to="`/category/${item.categoryNo}`" v-for="item in categories" :key="item.categoryNo">
        <span class="icon" :style="{ backgroundImage: `url('${item.icon}')`}"></span>
        {{ item.label}}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MainCategories',
  computed: {
    ...mapState('categories', ['categories'])
  }
}
</script>

<style>
.category_swipe_menu > a span {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4.1rem;
  height: 4.1rem;
  margin: 0 1.5rem 0;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid rgb(204, 204, 204);
  background-repeat: no-repeat;
  background-color: rgb(255, 255, 255);
  background-position: center;
  background-size: 4rem;
}
</style>
