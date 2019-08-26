<template>
  <div id="backTop">
    <a @click.prevent="toTop">Back to TOP</a>
  </div>
</template>

<script>
import ssq from 'jquery'
export default {
  methods: {
    toTop () {
      // document.body.scrollTop = 0
      // document.documentElement.scrollTop = 0
      ssq('body,html').animate({
        scrollTop: 0
      }, 800)
    }
  },
  mounted () {
    const btnBackTop = ssq('#backTop')
    btnBackTop.hide()
    ssq(window).scroll(function () {
      if (ssq(this).scrollTop() > 100) {
        btnBackTop.fadeIn()
      } else {
        btnBackTop.fadeOut()
      }
    })
  }
}
</script>


