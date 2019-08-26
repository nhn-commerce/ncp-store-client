<template>
  <div id="CouponPayPop" class="_layer_content _text" style="position:fixed; " data-type="text">
    <div class="basic_popup add_cart_popup">
      <div class="popup_wrap">
        <div class="popup_inner">
          <div class="add_cart_area">
            <p>로그인인증 완료 되었습니다.</p>
            <p>{{ mallName }} 앱 종료후 다시 접속해주시기 바랍니다.</p>
          </div>
          <div class="btn_box btn_1">
            <a @click.prevent="close" class="btn_style1" id="closeBtn1">확인</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'

export default {
  metaInfo: {
    title: '로그인인증'
  },
  data () {
    return {
      mallName: config.mallName
    }
  },
  methods: {
    close () {
      window.location.href = `${config.urlScheme}://close`
    }
  }
}
</script>

<style>

</style>
