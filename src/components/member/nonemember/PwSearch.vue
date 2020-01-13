<template>
  <div>
    <fieldset>
      <legend class="acc-hidden">비회원 주문조회 폼</legend>
      <div class="login_area no_mbr_order_sch">
        <div class="login_box">
          <dl>
            <dt>
              <label for="orderNum">주문번호</label>
            </dt>
            <dd>
              <input id="orderNum" @input="removestr" class="login_inp" v-model="orderNo" ref="orderNumFocus" type="text">
            </dd>
          </dl>
          <dl>
            <dt>비밀번호 받기</dt>
            <dd class="radio_box">
              <span><input type="radio" name="receivePw" id="receivePw1" v-model="replyType" value="EMAIL">
                <label for="receivePw1">이메일</label>
              </span>
              <span><input type="radio" name="receivePw" id="receivePw2" v-model="replyType" value="SMS">
                <label for="receivePw2">SMS</label>
              </span>
            </dd>
          </dl>
          <a class="btn btn_style1" @click.prevent="getPassword">전송받기</a>
        </div>
        <div class="mbr_lst_txt">
          <p>주문 시 입력한 이메일 주소 또는 휴대폰번호로<br>임시 비밀번호를 보내 드립니다.</p>
          <p>전송 받기 불가 시 고객센터로 문의바랍니다. ({{ servicePhoneNo }})</p>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  metaInfo: {
    title: '비회원 주문 비밀번호 찾기'
  },
  name: 'Cart',
  data () {
    return {
      orderNo: '',
      replyType: 'EMAIL'
    }
  },
  components: {
  },
  computed: {
    ...mapGetters('common', ['servicePhoneNo'])
  },
  methods: {
    getPassword () {
      const noneMeberParams = {
        orderNo: this.orderNo,
        replyType: this.replyType
      }
      if (this.orderNo === '' && this.orderNo.length === 0) {
        alert('주문번호를 입력 해 주세요.')
        this.$refs.orderNumFocus.focus()
        return
      }
      if (!this.isNum(this.orderNo)) {
        alert('숫자만 입력가능합니다.')
        this.$refs.orderNumFocus.focus()
        return
      }
      this.$store.dispatch('guestorder/getPassword', noneMeberParams).then(ret => {
        alert('임시 비밀번호가 전송되었습니다.')
        this.$router.push({
          path: '/member/nonemember/ordersearch',
          query: {
            redirect: `${location.protocol}//${location.host}${this.$route.fullPath}`
          }
        })
      }).catch((e) => {
        if (e.data.code === 'E9001') {
          alert('주문번호를 정확하게 입력해주세요. ')
          this.$refs.orderNumFocus.focus()
        }
      })
    },
    isNum (val) {
      return val.match('^[0-9]*$')
    },
    removestr () {
      const p = /[^\d]/ig
      this.orderNo = this.orderNo.replace(p, '')
    }
  }
}
</script>

<style>

</style>
