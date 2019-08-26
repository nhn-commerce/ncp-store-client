<template>
  <div id="CouponPayPop" class="_layer_content _text" style="position:fixed; " data-type="text">
    <div class="basic_popup add_cart_popup">
      <div class="popup_wrap">
        <div class="popup_inner">
          <div class="add_cart_area">
            <h3>
              <span>PAYCO</span> 결제 전용 할인쿠폰 적용 완료</h3>
            <p class="card">PAYCO 로 결제 진행 됩니다.</p>
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
export default {
  methods: {
    close () {
      this.$emit('closePaycoAlert')
    }
  }
}
</script>

<style>

</style>
