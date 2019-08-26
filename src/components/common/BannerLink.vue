<template>
  <router-link :to="landingUrl" :target="targetType" v-if="routerLinkFlg">
    <slot></slot>
  </router-link>
  <a :href="landingUrl" :target="targetType" v-else>
    <slot></slot>
  </a>
</template>
<script>

export default {
  props: ['banner'],
  computed: {
    landingUrl () {
      return this.banner && ((this.banner.landingUrlType === 'EVENT' && '/event/' + this.banner.landingUrl) || this.banner.landingUrl)
    },
    routerLinkFlg () {
      return this.landingUrl && this.landingUrl[0] === '/'
    },
    targetType () {
      if (this.banner.browerTargetType === 'NEW') {
        return '_blank'
      } else {
        return false
      }
    }
  }
}
</script>
