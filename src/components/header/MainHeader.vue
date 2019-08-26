<template>
  <BaseHeader type="main">
    <h2 class="logo">
      <a @click.prevent="callMain">{{mallName}}</a>
    </h2>
  </BaseHeader>
</template>

<script>
import BaseHeader from './BaseHeader'
import config from '@/config'

export default {
  data () {
    return {
      mallName: config.mallName
    }
  },
  components: {
    BaseHeader
  },
  methods: {
    callMain () {
      if (this.$route.fullPath === '/') {
        window.location.reload()
      } else {
        this.$router.push({
          path: '/'
        })
      }
    }
  }
}
</script>

<style>

</style>
