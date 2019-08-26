<template>
  <div v-show="imageLoaded" id="layerPopup" style="position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 999999;">
    <div id="mainPopupBg" style="background-color:black; filter: alpha(opacity=50); -khtml-opacity:0.5; -moz-opacity:0.5; opacity:0.5; width:100%; height: 100%; position:fixed; left:0; top:0; ">&nbsp;</div>
    <div id="mainPopup" class="_layer_content _text" style="position: fixed; " data-type="text">
      <div class="main_popup">
        <div class="main_popup_con" ref="content" v-html="popupInfo.content">
        </div>
        <div class="main_popup_btn">
          <button type="button" class="todayClose" @click.prevent="close('oneday')">오늘 하루 안보기</button>
          <button type="button" id="closeBtn1" class="popClose" @click.prevent="close('close')">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils/utils'
import { getToday } from '@/utils/dateUtils'
import cookies from 'js-cookie'
import $ from 'jquery'

export default {
  data () {
    return {
      imageLoaded: false
    }
  },
  props: ['popupInfo'],
  methods: {
    close (type) {
      if (type === 'oneday') {
        cookies.set('ncpMainPop', getToday(), { 'max-age': (2 * 24 * 60 * 60) })
      }
      removeClass(document.body, 'no_scroll')
      this.$emit('closePop')
    }
  },
  created () {
    addClass(document.body, 'no_scroll')
  },
  mounted () {
    Promise.all($(this.$refs.content).find('img').map((i, img) => {
      return new Promise((resolve, reject) => {
        $(img).on('load', () => {
          resolve()
        })
        // $(img).on('error', () => {
        //   reject()
        // })
      })
    })).then(() => {
      this.imageLoaded = true
    })
  }
}
</script>

<style>

</style>
