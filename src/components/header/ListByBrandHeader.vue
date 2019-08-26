<template>
  <BaseHeader type="sub">
    <h2 class="title" v-if="currentBrandName">{{ currentBrandName }}</h2>
  </BaseHeader>
</template>

<script>
import BaseHeader from './BaseHeader'
import { mapGetters } from 'vuex'
export default {
  components: {
    BaseHeader
  },
  computed: {
    ...mapGetters('brand', ['currentBrandName'])
  }
}
</script>

<style>

</style>
