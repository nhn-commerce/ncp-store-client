<template>
  <div id="contents" class="mypage_wrap">
    <form>
      <fieldset>
        <legend class="acc-hidden">탈퇴하기 입력 폼</legend>
        <section class="mbr_out">
          <h3 class="title">그동안 {{mallName}}을 이용 해주셔서 감사합니다.</h3>
          <div class="txt">
            <p>
              회원탈퇴 시 회원전용 서비스 이용은 불가능 합니다. 보유하셨던 쿠폰은 탈퇴와 함께 삭제되며 복구되지 않습니다.
            </p>
            <p>
              {{mallName}} 주문내역이 있는 경우, 전자상거래등에서의 소비자 보호에 관한 법률에 따라 계약 또는 청약철회에 관한 기록, 대금결제 및 재화 등의 공급에 관한 기록은 5년동안 보존됩니다.
            </p>
            <p>
              탈퇴 완료 시 회원님의 개인정보는 삭제되지만 회원이실때 작성하셨던 상품문의 및 상품평은 삭제되지 않습니다. 상품문의 및 상품평 삭제를 원하실 경우 먼저 게시물을 삭제하신후 탈퇴를 신청하시기바랍니다.
            </p>
            <p>
              탈퇴 완료시 PAYCO 탈퇴는 되지 않습니다. PAYCO 탈퇴는 PAYCO 사이트에서 진행해주세요.
            </p>
          </div>
          <dl class="mbr_out_check">
            <dt>탈퇴 서비스 선택</dt>
            <dd>
              <div class="radio_style1">
                <input v-model="msg" type="radio" id="mbrOut1" value="delBuywow" name="mbrOut">
                <label for="mbrOut1">
                  <span></span>{{mallName}} 탈퇴</label>
              </div>
            </dd>
          </dl>
          <dl class="mbr_out_txt">
            <dt>
              <label for="">탈퇴사유 입력 (선택)</label>
            </dt>
            <dd>
              <div class="inp_txt inp_placeholder" @click="showContent">
                <div class="placeholder" :style="showContentFlg?'display: none;':'display: block;'">
                  특별한 탈퇴사유가 있다면 말씀해주세요. <br> 이후 운영에 반영하여 더 좋은 {{mallName}}로 거듭나겠습니다.
                </div>
                <textarea v-model="textMsg" cols="30" rows="10" class="inp" @focusout="closeContent" ref="content"></textarea>
              </div>
            </dd>
          </dl>
        </section>
        <div class="mbr_out_btn">
          <a href="javascript:;" @click="escClick" class="btn_style1">탈퇴 완료</a>
        </div>
      </fieldset>
    </form>
  </div>
</template>
<script>

import { mapState } from 'vuex'
import { logoutRemoveCookie } from '@/utils/utils'
import config from '@/config'

export default {
  data () {
    return {
      msg: 'delBuywow',
      textMsg: '',
      placeholderInfo: 'true',
      showContentFlg: false,
      mallName: config.mallName
    }
  },
  metaInfo: {
    title: '개인정보 수정(공통)'
  },
  name: 'Cart',
  computed: {
    ...mapState('authentication', ['shopAgreement'])
  },
  methods: {
    escClick () {
      this.$store.dispatch('authentication/setShopAgreementY')
      this.$store.dispatch('authentication/delOnlyBuywow', this.textMsg).then(() => {
        this.writeOff()
      })
    },
    writeOff () {
      alert(`${config.mallName}에서 탈퇴처리가 완료되었습니다. 그동안 이용 해 주셔서 감사합니다.`)
      logoutRemoveCookie()
      window.location.href = '/'
    },
    showContent () {
      this.showContentFlg = true
      this.$refs.content.focus()
    },
    closeContent () {
      if (this.textMsg.length === 0) {
        this.showContentFlg = false
      }
    }
  }
}
</script>

<style>

</style>
