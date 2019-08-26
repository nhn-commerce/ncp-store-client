<template>
  <div class="validation">
    <ul>
      <li>
        <p class="dsc">임직원사번 :</p>
        <span class="bx_input">
          <input type="text" ref="empNo" maxlength="7">
        </span>
      </li>
      <li>
        <p class="dsc">주민등록번호(앞자리7개) : </p>
        <span class="bx_input">
          <input type="password" ref="empCd">
        </span>
      </li>
      <div class="bx_btn">
        <button type="button" class="btn btn_style5" @click.prevent="internalCheck">입력</button>
      </div>
    </ul>
  </div>
</template>

<script>
import Validator from '@/utils/validateUtils'

export default {
  methods: {
    internalCheck () {
      const internalValidate = new Validator([
        {
          inputValue: this.$refs.empNo.value,
          message: '임직원 사번을 입력해주세요.',
          pattern: /^\S+/,
          input: this.$refs.empNo
        },
        {
          inputValue: this.$refs.empNo.value,
          message: '임직원 사번이 유효하지 않습니다.',
          pattern: /^ne12152$/i,
          input: this.$refs.empNo
        },
        {
          inputValue: this.$refs.empCd.value,
          message: '주민등록번호를 입력해주세요.',
          pattern: /^\S+/,
          input: this.$refs.empCd
        },
        {
          inputValue: this.$refs.empCd.value,
          message: '주민등록번호가 유효하지 않습니다.',
          pattern: /^7507301$/i,
          input: this.$refs.empCd
        }
      ])
      if (internalValidate.validate()) {
        return false
      }
      sessionStorage.setItem('empNo', this.$refs.empNo.value)
      window.location.href = this.$route.query.next
    }
  }
}
</script>
