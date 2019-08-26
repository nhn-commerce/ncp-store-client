<template>
  <div v-if="event.top.mobile.type==='FILE'" class="visual_banner">
    <img :src="event.top.mobile.url" alt="">
  </div>
  <div v-else-if="event.top.mobile.type==='HTML'" class="visual_banner" style="claer: both; zoom: 1; overflow: hidden" v-html="event.top.mobile.url">
  </div>
</template>

<script>
export default {
  props: ['event']
}
</script>
