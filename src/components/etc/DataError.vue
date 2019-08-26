<template>
  <div id="contents" class="error_wrap">
    <div class="error_box">
      <p class="txt warn">일시적으로 불러오지 못했습니다.<br>잠시 후 다시 시도해주세요.</p>
      <div class="btn_box">
        <a @click.prevent="goBlack" class="btn_style1">재시도</a>
      </div>
    </div>
  </div>
</template>

<<script>
export default {
  methods: {
    goBlack () {
      window.history.back()
    }
  },
  metaInfo: {
    title: '데이터오류'
  }
}
</script>
