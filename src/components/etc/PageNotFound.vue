<template>
  <div id="contents" class="error_wrap">
    <div class="error_box">
      <p class="txt sorry">요청하신 페이지를 찾을 수 없습니다.</p>
      <div class="btn_box">
        <a @click.prevent="goBlack()" class="btn_style3">이전페이지</a>
        <a @click.prevent="goMain()" class="btn_style1">{{mallName}} 홈</a>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  data () {
    return {
      mallName: config.mallName
    }
  },
  methods: {
    goBlack () {
      window.history.back()
    },
    goMain () {
      window.location.href = '/'
    }
  },
  metaInfo: {
    title: '페이지없음'
  }
}
</script>
