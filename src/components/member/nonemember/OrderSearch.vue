<template>
  <div id="contents" class="member_wrap">
    <legend class="acc-hidden">비회원 주문조회 폼</legend>
    <div class="login_area no_mbr_order_sch">
      <div class="login_box">
        <dl>
          <dt>
            <label for="orderNum">주문번호</label>
          </dt>
          <dd>
            <input id="orderNum" @input="removestr" class="login_inp" v-model="orderNum" ref="orderNumFocus" type="text">
          </dd>
        </dl>
        <dl>
          <dt>
            <label for="orderPw">주문 비밀번호</label>
          </dt>
          <dd>
            <input type="password" id="orderPw" class="login_inp" v-model="orderPw">
          </dd>
        </dl>
        <a @click.prevent="search" class="btn btn_style1">주문내역 조회</a>
      </div>
      <div class="mbr_link">
        <router-link to="/member/nonemember/pwsearch">주문 비밀번호 찾기</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  metaInfo: {
    title: '비회원 주문조회'
  },
  name: 'OrderSearch',
  data () {
    return {
      orderNum: '',
      orderPw: ''
    }
  },
  methods: {
    search () {
      if (this.orderNum.length === 0 || this.orderPw.length === 0) {
        alert('주문번호 및 주문 비밀번호를 입력해주세요. ')
      } else {
        if (!this.isNum(this.orderNum)) {
          alert('숫자만 입력가능.')
          this.$refs.orderNumFocus.focus()
        } else {
          this.$store.dispatch('guestorder/getGuestOrder', { orderNo: this.orderNum, password: this.orderPw }).then(res => {
            router.push({
              path: `/member/nonemember/orderdetail/${res}`
            })
          }).catch((e) => {
            if (e.data.code === 'E0005' || e.data.code === 'O0009') {
              alert('주문번호 및 주문 비밀번호를  다시 확인하세요')
            }
          })
        }
      }
    },
    isNum (val) {
      return val.match('^[0-9]*$')
    },
    removestr () {
      const p = /[^\d]/ig
      this.orderNum = this.orderNum.replace(p, '')
    }
  }
}
</script>

<style>

</style>
