<template>
  <div id="layerPopup" style="position: fixed;left: 0px;top: 0px;width: 0px;height: 0px;z-index: 999999;">
    <div id="addCartPop" class="_layer_content _text" style="position:fixed; " data-type="text">
      <div class="basic_popup add_cart_popup">
        <div class="popup_wrap">
          <div class="popup_inner">
            <div class="add_cart_area">
              <h2>장바구니 담기 완료</h2>
              <p>장바구니를 확인하시겠습니까?</p>
            </div>
            <div class="btn_box">
              <a class="btn_style3" id="closeBtn1" @click.prevent="close">아니오</a>
              <router-link to="/cart" class="btn_style1">예</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('closePop')
    }
  }
}
</script>

