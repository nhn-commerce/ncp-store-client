<template>
  <BaseHeader type="sub">
    <h2 class="title" id="headTitle">{{ title }}</h2>
  </BaseHeader>
</template>

<script>
import BaseHeader from './BaseHeader'
export default {
  props: ['title'],
  components: {
    BaseHeader
  }
}
</script>

