<template>
  <header id="header" :class="className">
    <router-link v-if="type!=='main'" to="/" class="btn_home">home</router-link>
    <slot></slot>
    <TopMenu :type="type"></TopMenu>
  </header>
</template>

<script>
import TopMenu from './TopMenu'

export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: val => ['main', 'sub', 'search'].indexOf(val) > -1
    }
  },
  computed: {
    className () {
      return {
        'main_header': this.type === 'main',
        'sub_header': this.type === 'sub' || this.type === 'search',
        'sch_header': this.type === 'search'
      }
    }
  },
  components: {
    TopMenu
  }
}
</script>

<style>

</style>
