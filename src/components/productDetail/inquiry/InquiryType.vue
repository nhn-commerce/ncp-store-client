<template>
  <li>
    <a @click.prevent="selected">
      {{inquiryType.label}}
    </a>
  </li>
</template>

<script>
export default {
  props: ['inquiryType'],
  methods: {
    selected () {
      this.$emit('selectedType', this.inquiryType)
    }
  }
}
</script>

<style>

</style>
