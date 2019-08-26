<template>
  <header id="header" class="etc_header" style="margin-top: 0px;">
    <h2 class="logo">
      <router-link to="/">{{mallName}}</router-link>
    </h2>
  </header>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      mallName: config.mallName
    }
  }
}
</script>


<style>

</style>
