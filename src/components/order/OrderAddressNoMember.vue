<template>
  <div>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">주문자 정보</h3>
      </div>
      <div class="os_con no_mbr_order">
        <div class="order_info">
          <dl class="">
            <dt>
              <label for="ordererName">
                <span class="important">주문자명</span>
              </label>
            </dt>
            <dd>
              <input id="ordererName" type="text" v-model="orderinfo.orderer.ordererName" ref="ordererName">
            </dd>
          </dl>
          <dl class="">
            <dt>
              <label for="ordererContact1_one">
                <span class="important">휴대전화</span>
              </label>
            </dt>
            <dd>
              <div class="inp_tel">
                <input id="ordererContact1_one" type="tel" v-model="showReceiverContactOne" size="3" maxlength="3" ref="ordererContact1_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContactTwo" size="4" maxlength="4" ref="ordererContact1_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContactThree" size="4" maxlength="4" ref="ordererContact1_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
              </div>
            </dd>
          </dl>
          <dl>
            <dt>
              <label for="orderrEmailName">
                <span class="important">이메일</span>
              </label>
            </dt>
            <dd>
              <div class="inp_mail">
                <input id="orderrEmailName" type="text" v-model="orderinfo.orderer.orderrEmailName" ref="orderrEmailName">
                <i class="char">@</i>
                <input type="text" v-model="orderinfo.orderer.orderrEmailDomain" ref="orderrEmailDomain">
              </div>
            </dd>
          </dl>
          <dl class="oi_w">
            <dt>
              <label for="tempPassword">
                <span class="important">주문 비밀번호</span>
              </label>
              <div class="order_pw_txt">
                <span v-if="pwdErr" class="warn">비밀번호 조합기준에 적합하지 않습니다.</span>
              </div>
            </dt>
            <dd>
              <input id="tempPassword" type="password" placeholder="영문, 숫자, 특수문자 8~20자" @input="confirmPassword" v-model="orderinfo.tempPassword" ref="tempPassword" maxlength="20" @blur="pwdValidate">
            </dd>
          </dl>
          <dl class="oi_w">
            <dt>
              <label for="tempPasswordConfirm">
                <span class="important">주문 비밀번호 확인</span>
              </label>
              <div class="order_pw_txt">
                <span v-if="confirm === 1" class="success">비밀번호가 일치합니다.</span>
                <span v-if="confirm === 2" class="warn">비밀번호가 일치하지 않습니다.</span>
              </div>
            </dt>
            <dd>
              <input id="tempPasswordConfirm" type="password" placeholder="동일 비밀번호 재입력" @input="confirmPassword" v-model="orderinfo.tempPasswordConfirm" ref="tempPasswordConfirm" maxlength="20">
            </dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">배송지 정보</h3>
        <div class="check_style1 txt">
          <input type="checkbox" id="checkDelivery" v-model="copyOrderer">
          <label for="checkDelivery">
            <span></span>주문자 정보와 동일</label>
        </div>
      </div>
      <div class="os_con no_mbr_order">
        <div class="order_info">
          <dl class="">
            <dt>
              <label for="receiverName">
                <span class="important">받는사람</span>
              </label>
            </dt>
            <dd>
              <input id="receiverName" type="text" v-model="input.receiverName" ref="receiverName">
            </dd>
          </dl>
          <dl class="">
            <dt>
              <label for="">
                <span class="important">주소</span>
              </label>
            </dt>
            <dd>
              <div class="inp_addr">
                <input type="text" v-model="input.zipCode" ref="zipCode" disabled>
                <a @click.prevent="searchAddress" class="btn_style3 btn_addr" id="btnAddrPop">주소찾기</a>
              </div>
              <input type="text" v-model="input.dispAddress" ref="dispAddress" disabled>
              <input type="text" v-model="input.detialAddress" ref="detialAddress" placeholder="상세주소를 입력하세요">
            </dd>
          </dl>
          <dl class="">
            <dt>
              <label for="receiverContact1_one">
                <span class="important">휴대전화</span>
              </label>
            </dt>
            <dd>
              <div class="inp_tel">
                <input id="receiverContact1_one" type="tel" v-model="showReceiverContact1One" maxlength="3" ref="receiverContact1_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContact1Two" maxlength="4" ref="receiverContact1_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContact1Three" maxlength="4" ref="receiverContact1_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
              </div>
            </dd>
          </dl>
          <dl>
            <dt>
              <label for="receiverContact2_one">연락처</label>
            </dt>
            <dd>
              <div class="inp_tel">
                <input id="receiverContact2_one" type="tel" v-model="showReceiverContact2One" maxlength="3" ref="receiverContact2_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContact2Two" maxlength="4" ref="receiverContact2_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showReceiverContact2Three" maxlength="4" ref="receiverContact2_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
              </div>
            </dd>
          </dl>

          <template v-if="foreign">
            <dl class="oi_w">
              <dt>
                <label for="customsIdNumber">
                  <span class="important">개인통관 고유부호</span>
                </label>
                <div :class="{'oi_unipass is_open':unipassShow,'oi_unipass':!unipassShow}">
                  <a @click.prevent="openUnipassShow" class="unipass_btn">notice</a>
                  <div class="unipass_layer">
                    <strong>개인통관고유부호란?</strong>
                    <p>
                      해외에서 한국으로 배송되는 직배송 상품 구매시 국내 세관의 통관절차를 위해 ‘개인통관고유부호’를 제출해야 합니다.
                    </p>
                    <a @click.prevent="gotounipass()" class="btn_go">발급 바로가기</a>
                  </div>
                  <div class="unipass_bg" @click.prevent="openUnipassShow"></div>
                </div>
              </dt>
              <dd>
                <input id="customsIdNumber" type="text" v-model="input.customsIdNumber " ref="customsIdNumber" maxlength="13">
                <p>※ 받는 분 명의로 통관이 진행되오니, 반드시 받는 분 정보를 입력 해 주시기 바랍니다.</p>
              </dd>
            </dl>
          </template>
          <dl class="oi_w">
            <dt>
              <label for="myDeliveryMemo">배송메모</label>
            </dt>
            <dd>
              <select name="" id="" v-model="myDeliveryMemoSelect">
                <option value="">택배 기사님께 요청하실 내용을 선택하세요</option>
                <option>배송 전에 미리 연락 바랍니다</option>
                <option>부재 시 경비실에 맡겨 주세요</option>
                <option>부재 시 연락 바랍니다</option>
              </select>
              <input id="myDeliveryMemo" type="text" placeholder="배송 메모를 입력하세요." @keypress.enter.prevent="myDeliveryMemoEnter" maxlength="50" v-model="myDeliveryMemo" ref="myDeliveryMemo">
            </dd>
          </dl>
        </div>
      </div>
    </section>

    <Addresses v-show="openSearch" @closePop="addressPopClose" @enterAndClose="selectAddressPopClose"></Addresses>
  </div>
</template>

<script>
import Addresses from '../common/Addresses'
import { mapState } from 'vuex'
import { gotoOutLink } from '@/utils/utils'
import { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
export default {
  props: ['input', 'orderinfo', 'foreign'],
  data () {
    return {
      pwdErr: false,
      confirm: 0,
      copyOrdererFlag: false,
      openSearch: false,
      myOrderTel_one: '',
      myOrderTel_tow: '',
      myOrderTel_three: '',
      selectedMemo: '',
      unipassShow: false
    }
  },
  methods: {
    validateNumber (event) {
      validateNumber(event)
    },
    gotounipass () {
      gotoOutLink('https://unipass.customs.go.kr/csp/persIndex.do')
    },
    openUnipassShow () {
      this.unipassShow = !this.unipassShow
    },
    searchAddress () {
      this.openSearch = true
    },
    myDeliveryMemoEnter () {
      return ''
    },
    confirmPassword () {
      if (this.orderinfo.tempPasswordConfirm !== this.orderinfo.tempPassword) {
        this.confirm = 2
      } else {
        this.confirm = 1
      }
    },
    addressPopClose () {
      this.openSearch = false
    },
    selectAddressPopClose (type, zipCode, address, jibunAddress, detialAddress) {
      this.openSearch = false
      this.input.zipCode = zipCode
      if (type === 'address') {
        this.input.address = address
      } else {
        this.input.address = jibunAddress
      }
      this.input.jibunAddress = jibunAddress
      this.input.dispAddress = this.input.address
      this.input.detialAddress = detialAddress

      const addressRequest = {
        addressRequest: {
          addressType: 'RECENT',
          countryCd: 'KR',
          customsIdNumber: '',
          defaultYn: '',
          receiverAddress: this.input.address,
          receiverContact1: '',
          receiverContact2: '',
          receiverDetailAddress: '',
          receiverJibunAddress: jibunAddress,
          receiverName: '',
          receiverZipCd: zipCode
        }
      }
      const orderSheetNo = this.$store.state.route.params.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderConpons', { orderSheetNo, addressRequest })
    },
    pwdValidate () {
      if (this.orderinfo.tempPassword !== '') {
        const pwdPattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*? ]).*$/
        if (!pwdPattern.test(this.orderinfo.tempPassword)) {
          this.pwdErr = true
        } else {
          this.pwdErr = false
        }
      }
    }
  },
  components: {
    Addresses
  },
  computed: {
    copyOrderer: {
      get () {
        return this.copyOrdererFlag
      },
      set (val) {
        this.copyOrdererFlag = val
        if (val) {
          this.input.receiverName = this.orderinfo.orderer.ordererName
          this.input.receiverContact1_one = this.orderinfo.orderer.ordererContact1_one
          this.input.receiverContact1_two = this.orderinfo.orderer.ordererContact1_two
          this.input.receiverContact1_three = this.orderinfo.orderer.ordererContact1_three
        } else {
          this.input.receiverName = ''
          this.input.receiverContact1_one = ''
          this.input.receiverContact1_two = ''
          this.input.receiverContact1_three = ''
        }
      }
    },
    myDeliveryMemoSelect: {
      get () {
        return this.selectedMemo
      },
      set (val) {
        this.$store.commit('ordersheet/CHANGE_DEVLI_MEMO', val)
        this.selectedMemo = val
      }
    },
    myDeliveryMemo: {
      get () {
        return this.deliveryMemo
      },
      set (val) {
        this.$store.commit('ordersheet/CHANGE_DEVLI_MEMO', val)
      }
    },
    showReceiverContactOne: {
      get () {
        return this.orderinfo.orderer.ordererContact1_one
      },
      set (value) {
        this.orderinfo.orderer.ordererContact1_one = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContactTwo: {
      get () {
        return this.orderinfo.orderer.ordererContact1_two
      },
      set (value) {
        this.orderinfo.orderer.ordererContact1_two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContactThree: {
      get () {
        return this.orderinfo.orderer.ordererContact1_three
      },
      set (value) {
        this.orderinfo.orderer.ordererContact1_three = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1One: {
      get () {
        return this.input.receiverContact1_one
      },
      set (value) {
        this.input.receiverContact1_one = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1Two: {
      get () {
        return this.input.receiverContact1_two
      },
      set (value) {
        this.input.receiverContact1_two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1Three: {
      get () {
        return this.input.receiverContact1_three
      },
      set (value) {
        this.input.receiverContact1_three = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2One: {
      get () {
        return this.input.receiverContact2_one
      },
      set (value) {
        this.input.receiverContact2_one = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Two: {
      get () {
        return this.input.receiverContact2_two
      },
      set (value) {
        this.input.receiverContact2_two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Three: {
      get () {
        return this.input.receiverContact2_three
      },
      set (value) {
        this.input.receiverContact2_three = changeKoreanToEmptyString(value)
      }
    },
    ...mapState('ordersheet', ['deliveryMemo'])
  }
}
</script>
