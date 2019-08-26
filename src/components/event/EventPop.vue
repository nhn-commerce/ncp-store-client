<template>
  <div class="basic_popup" :class="popType === 'notice' ? 'notice_popup' : 'coupon_popup'" :id="popType === 'notice' ? 'noticePopup' : 'couponPopup'" style="display: block;">
    <div class="popup_wrap">
      <div class="popup_inner">
        <template v-if="popType === 'notice'">
          <div class="popup_title">
            <h3>쿠폰 유의사항</h3>
          </div>
          <div class="coupon_notice_info" v-html="infoHtml">
          </div>
          <button @click.prevent="close" type="button" class="btn_close">팝업 닫기</button>
        </template>
        <template v-else>
          <div class="coupon_popup_txt">
            <img src="../../assets/images/sub/img_event_popup1.jpg" alt="">
          </div>
          <a @click.prevent="close" class="btn_ok">확인</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['popType', 'infoHtml'],
  methods: {
    close () {
      this.$emit('closePop')
    }
  }
}
</script>

<style>

</style>
