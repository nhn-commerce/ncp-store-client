<template>
  <BaseHeader type="sub">
    <h2 class="title">{{ event && event.label }}</h2>
  </BaseHeader>
</template>

<script>
import BaseHeader from './BaseHeader'
import { mapState } from 'vuex'

export default {
  components: {
    BaseHeader
  },
  computed: {
    ...mapState('event', ['event'])
  }
}
</script>

<style>

</style>
