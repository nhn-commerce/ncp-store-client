<template>
  <div id="contents" class="mypage_wrap">
    <form action="">
      <fieldset>
        <legend class="acc-hidden">쿠폰 코드 입력 폼</legend>
        <div class="coupon_code order_info">
          <dl class="oi_w">
            <dt>코드를 입력하시면 쿠폰을 받으실 수 있습니다.</dt>
            <dd>
              <div class="inp_code">
                <input type="text" v-model="promotionCode" placeholder="쿠폰코드 입력" @keypress.enter.prevent="clickEnter">
                <a href="javascript:;" class="btn_style3 btn_code" @click="regCoupon">쿠폰받기</a>
              </div>
            </dd>
          </dl>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: '쿠폰코드 등록'
  },
  data () {
    return {
      promotionCode: ''
    }
  },
  methods: {
    regCoupon () {
      if (!this.promotionCode) {
        return window.alert('쿠폰번호를 정확하게 입력해 주세요.')
      }
      this.$store.dispatch('validCoupon/registCoupon', this.promotionCode).then(() => {
        alert('쿠폰발급이 완료 되었습니다.')
        window.location.href = '/mypage/mycoupon'
      })
    },
    clickEnter () {
      return ''
    }
  },
  mounted () {
    const code = this.$route.query.promotionCode
    if (code) {
      this.promotionCode = decodeURIComponent(code)
    }
  }
}
</script>
<style>

</style>

