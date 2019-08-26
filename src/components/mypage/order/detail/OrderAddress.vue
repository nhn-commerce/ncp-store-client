<template>
  <section class="order_section" v-if="editFlg">
    <div class="os_top">
      <h3 class="title_style1 title">배송지정보</h3>
      <div class="btn_done">
        <a @click.prevent="cancelAddress" class="btn_style4">변경취소</a>
        <a @click.prevent="saveAdderss" class="btn_style5">변경완료</a>
      </div>
    </div>
    <div class="os_con order_modify">
      <form action="">
        <fieldset>
          <legend class="acc-hidden">배송지 변경 폼</legend>
          <div class="order_info">
            <dl class="">
              <dt>
                <label for="receiverName">
                  <span class="important">받는사람</span>
                </label>
              </dt>
              <dd>
                <input type="text" id="receiverName" v-model="addressInfo.receiverName" ref="receiverName">
              </dd>
            </dl>
            <dl class="">
              <dt>
                <label for="receiverDetailAddress">
                  <span class="important">주소</span>
                </label>
              </dt>
              <dd>
                <div class="inp_addr">
                  <input type="text" v-model="addressInfo.receiverZipCd" maxlength="7" disabled>
                  <a @click.prevent="searchAddress" class="btn_style3 btn_addr" id="btnAddrPop">주소찾기</a>
                </div>
                <input type="text" v-model="addressInfo.receiverAddress" disabled>
                <input type="text" id="receiverDetailAddress" v-model="addressInfo.receiverDetailAddress" ref="detialAddress" placeholder="상세주소를 입력하세요">
              </dd>
            </dl>
            <dl class="">
              <dt>
                <label for="contact1">
                  <span class="important">휴대전화</span>
                </label>
              </dt>
              <dd>
                <div class="inp_tel">
                  <input type="tel" id="contact1" v-model="showContact1One" maxlength="3" ref="receiverContact1_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  <i class="char">-</i>
                  <input type="tel" v-model="showContact1Two" maxlength="4" ref="receiverContact1_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  <i class="char">-</i>
                  <input type="tel" v-model="showContact1Three" maxlength="4" ref="receiverContact1_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                </div>
              </dd>
            </dl>
            <dl>
              <dt>
                <label for="contact2">연락처</label>
              </dt>
              <dd>
                <div class="inp_tel">
                  <input type="tel" id="contact2" v-model="showContact2One" maxlength="3" ref="receiverContact2_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  <i class="char">-</i>
                  <input type="tel" v-model="showContact2Two" maxlength="4" ref="receiverContact2_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                  <i class="char">-</i>
                  <input type="tel" v-model="showContact2Three" maxlength="4" ref="receiverContact2_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                </div>
              </dd>
            </dl>
            <template v-if="foreign">
              <dl class="oi_w">
                <dt>
                  <label for="customsId">
                    <span class="important">개인통관 고유부호</span>
                  </label>
                  <div class="oi_unipass" :class="unipassOpenFlg ? 'is_open' : ''">
                    <a @click.prevent="unipassOpen" class="unipass_btn">notice</a>
                    <div class="unipass_layer">
                      <strong>개인통관고유부호란?</strong>
                      <p>
                        해외에서 한국으로 배송되는 직배송 상품 구매시 국내 세관의 통관절차를 위해 ‘개인통관고유부호’를 제출해야 합니다.
                      </p>
                      <a @click.prevent="gotounipass()" class="btn_go">발급 바로가기</a>
                    </div>
                    <div class="unipass_bg" @click.prevent="unipassOpen"></div>
                  </div>
                </dt>
                <dd>
                  <input type="text" id="customsId" v-model="addressInfo.customsIdNumber" maxlength="13" ref="customsIdNumber">
                  <p>※ 받는 분 명의로 통관이 진행되오니, 반드시 받는 분 정보를 입력 해 주시기 바랍니다.</p>
                </dd>
              </dl>
            </template>
            <dl class="oi_w">
              <dt>
                <label for="deliveryMemo">배송메모</label>
              </dt>
              <dd>
                <textarea id="deliveryMemo" cols="30" rows="10" placeholder="배송 메모를 입력하세요." maxlength="50" v-model="addressInfo.deliveryMemo"></textarea>
              </dd>
            </dl>
          </div>
        </fieldset>
      </form>
    </div>
    <Addresses v-show="openSearch" @closePop="addressPopClose" @enterAndClose="selectAddressPopClose"></Addresses>
  </section>
  <section class="order_section" v-else>
    <div class="os_top">
      <h3 class="title_style1 title">배송지정보</h3>
      <a @click.prevent="editAddress" class="btn_modify btn_style4" v-if="orderAddress.showButtonFlg">배송지 정보 변경</a>
    </div>
    <div class="os_con myorder_addr">
      <div class="basic_info_table">
        <dl>
          <dt>받는사람</dt>
          <dd>{{orderAddress.receiverName}}</dd>
        </dl>
        <dl>
          <dt>주소</dt>
          <dd>
            {{orderAddress.receiverZipCd}}
            <br>{{orderAddress.receiverAddress}}
            <br>{{orderAddress.receiverDetailAddress}}
          </dd>
        </dl>
        <dl>
          <dt>휴대전화</dt>
          <dd>
            {{orderAddress.contact1_1}}
            <i class="char">-</i>
            {{orderAddress.contact1_2}}
            <i class="char">-</i>
            {{orderAddress.contact1_3}}
          </dd>
        </dl>
        <dl>
          <dt>연락처</dt>
          <dd>
            <template v-if="orderAddress.contact2_1">
              {{orderAddress.contact2_1}}
              <i class="char">-</i>
              {{orderAddress.contact2_2}}
              <i class="char">-</i>
              {{orderAddress.contact2_3}}
            </template>
          </dd>
        </dl>
        <template v-if="foreign">
          <dl>
            <dt>개인통관고유부호</dt>
            <dd>{{orderAddress.customsIdNumber}}</dd>
          </dl>
        </template>
        <dl>
          <dt>배송메모</dt>
          <dd>{{orderAddress.deliveryMemo}}</dd>
        </dl>
      </div>
      <div class="notice" v-if="orderAddress.showLabelFlg">
        <p>
          상품/배송준비중 상태인 경우 배송지 직접변경이 불가하오니 변경을 원하실 경우 상품문의를 이용 해 주세요.
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import Addresses from '@/components/common/Addresses'
import { gotoOutLink } from '@/utils/utils'
import Validater, { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'

export default {
  props: ['orderAddress', 'noneMember', 'foreign'],
  data () {
    return {
      openSearch: false,
      editFlg: false,
      unipassOpenFlg: false,
      addressInfo: {
        addressType: 'BOOK',
        countryCd: 'KR',
        defaultYn: '',
        receiverJibunAddress: '',
        receiverName: '',
        receiverZipCd: '',
        receiverAddress: '',
        receiverDetailAddress: '',
        receiverContact1: '',
        receiverContact2: '',
        contact1_1: '',
        contact1_2: '',
        contact1_3: '',
        contact2_1: '',
        contact2_2: '',
        contact2_3: '',
        customsIdNumber: '',
        deliveryMemo: ''
      }
    }
  },
  methods: {
    validateNumber (event) {
      validateNumber(event)
    },
    editAddress () {
      this.addressInfo.receiverName = this.orderAddress.receiverName
      this.addressInfo.receiverZipCd = this.orderAddress.receiverZipCd
      this.addressInfo.receiverAddress = this.orderAddress.receiverAddress
      this.addressInfo.receiverDetailAddress = this.orderAddress.receiverDetailAddress
      this.addressInfo.receiverJibunAddress = this.orderAddress.receiverJibunAddress
      this.addressInfo.contact1_1 = this.orderAddress.contact1_1
      this.addressInfo.contact1_2 = this.orderAddress.contact1_2
      this.addressInfo.contact1_3 = this.orderAddress.contact1_3
      this.addressInfo.contact2_1 = this.orderAddress.contact2_1
      this.addressInfo.contact2_2 = this.orderAddress.contact2_2
      this.addressInfo.contact2_3 = this.orderAddress.contact2_3
      this.addressInfo.customsIdNumber = this.orderAddress.customsIdNumber
      this.addressInfo.deliveryMemo = this.orderAddress.deliveryMemo
      this.editFlg = true
    },
    gotounipass () {
      gotoOutLink('https://unipass.customs.go.kr/csp/persIndex.do')
    },
    unipassOpen () {
      this.unipassOpenFlg = !this.unipassOpenFlg
    },
    searchAddress () {
      this.openSearch = true
    },
    addressPopClose () {
      this.openSearch = false
    },
    selectAddressPopClose (type, zipCode, address, jibunAddress, detialAddress) {
      this.openSearch = false
      this.addressInfo.receiverZipCd = zipCode
      if (type === 'address') {
        this.addressInfo.receiverAddress = address
      } else {
        this.addressInfo.receiverAddress = jibunAddress
      }
      this.addressInfo.jibunAddress = jibunAddress
      this.addressInfo.receiverDetailAddress = detialAddress
    },
    saveAdderss () {
      const validateRole = [
        {
          inputValue: this.addressInfo.receiverName,
          message: '받는사람 입력해주세요.',
          pattern: /\S+/,
          input: this.$refs.receiverName
        },
        {
          inputValue: this.addressInfo.receiverZipCd,
          message: '주소를 입력하세요.',
          pattern: /\S+/,
          input: this.$refs.detialAddress
        },
        {
          inputValue: this.addressInfo.receiverAddress,
          message: '주소를 입력하세요.',
          pattern: /\S+/,
          input: this.$refs.detialAddress
        },
        {
          inputValue: this.addressInfo.contact1_1,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3}$/,
          input: this.$refs.receiverContact1_one
        },
        {
          inputValue: this.addressInfo.contact1_2,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{3,4}$/,
          input: this.$refs.receiverContact1_two
        },
        {
          inputValue: this.addressInfo.contact1_3,
          message: '휴대전화를 입력해주세요.',
          pattern: /^\d{4}$/,
          input: this.$refs.receiverContact1_three
        }
      ]
      if (this.addressInfo.contact2_1 !== '' ||
        this.addressInfo.contact2_2 !== '' ||
        this.addressInfo.contact2_3 !== ''
      ) {
        const telno2 = [
          {
            inputValue: this.addressInfo.contact2_1,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{2,3}$/,
            input: this.$refs.receiverContact2_one
          },
          {
            inputValue: this.addressInfo.contact2_2,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{3,4}$/,
            input: this.$refs.receiverContact2_two
          },
          {
            inputValue: this.addressInfo.contact2_3,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{4}$/,
            input: this.$refs.receiverContact2_three
          }]
        validateRole.push(...telno2)
      }
      if (this.foreign) {
        validateRole.push(
          {
            inputValue: this.addressInfo.customsIdNumber,
            message: '개인통관고유부호가 유효하지 않습니다. ',
            pattern: /^[p|P]\d{12}$/,
            input: this.$refs.customsIdNumber
          }
        )
      }

      const addressValidate = new Validater(validateRole)

      if (!addressValidate.validate()) {
        this.addressInfo.receiverContact1 = this.addressInfo.contact1_1 + '-' + this.addressInfo.contact1_2 + '-' + this.addressInfo.contact1_3
        if (this.addressInfo.contact2_1 !== '' ||
          this.addressInfo.contact2_2 !== '' ||
          this.addressInfo.contact2_3 !== ''
        ) {
          this.addressInfo.receiverContact2 = this.addressInfo.contact2_1 + '-' + this.addressInfo.contact2_2 + '-' + this.addressInfo.contact2_3
        }
        const deliveriesParam = {
          orderNo: this.orderAddress.orderNo,
          addressRequest: this.addressInfo
        }
        let dispatchUrl = 'myorder/editDeliveries'
        if (this.noneMember) {
          dispatchUrl = 'guestorder/editDeliveries'
        }
        this.$store.dispatch(dispatchUrl, deliveriesParam).then(() => {
          this.orderAddress.receiverName = this.addressInfo.receiverName
          this.orderAddress.receiverZipCd = this.addressInfo.receiverZipCd
          this.orderAddress.receiverAddress = this.addressInfo.receiverAddress
          this.orderAddress.receiverDetailAddress = this.addressInfo.receiverDetailAddress
          this.orderAddress.receiverJibunAddress = this.addressInfo.receiverJibunAddress
          this.orderAddress.contact1_1 = this.addressInfo.contact1_1
          this.orderAddress.contact1_2 = this.addressInfo.contact1_2
          this.orderAddress.contact1_3 = this.addressInfo.contact1_3
          this.orderAddress.contact2_1 = this.addressInfo.contact2_1
          this.orderAddress.contact2_2 = this.addressInfo.contact2_2
          this.orderAddress.contact2_3 = this.addressInfo.contact2_3
          this.orderAddress.customsIdNumber = this.addressInfo.customsIdNumber
          this.orderAddress.deliveryMemo = this.addressInfo.deliveryMemo

          this.editFlg = false
        })
      }
    },
    cancelAddress () {
      if (confirm('배송지 정보 변경을 취소하시겠습니까?  수정 한 내용은 저장되지 않습니다. ')) {
        this.addressInfo = {
          addressType: 'BOOK',
          countryCd: 'KR',
          defaultYn: '',
          receiverJibunAddress: '',
          receiverName: '',
          receiverZipCd: '',
          receiverAddress: '',
          receiverDetailAddress: '',
          receiverContact1: '',
          receiverContact2: '',
          contact1_1: '',
          contact1_2: '',
          contact1_3: '',
          contact2_1: '',
          contact2_2: '',
          contact2_3: '',
          customsIdNumber: '',
          deliveryMemo: ''
        }

        this.editFlg = false
      }
    }
  },
  components: {
    Addresses
  },
  computed: {
    showContact1One: {
      get () {
        return this.addressInfo.contact1_1
      },
      set (value) {
        this.addressInfo.contact1_1 = changeKoreanToEmptyString(value)
      }
    },
    showContact1Two: {
      get () {
        return this.addressInfo.contact1_2
      },
      set (value) {
        this.addressInfo.contact1_2 = changeKoreanToEmptyString(value)
      }
    },
    showContact1Three: {
      get () {
        return this.addressInfo.contact1_3
      },
      set (value) {
        this.addressInfo.contact1_3 = changeKoreanToEmptyString(value)
      }
    },
    showContact2One: {
      get () {
        return this.addressInfo.contact2_1
      },
      set (value) {
        this.addressInfo.contact2_1 = changeKoreanToEmptyString(value)
      }
    },
    showContact2Two: {
      get () {
        return this.addressInfo.contact2_2
      },
      set (value) {
        this.addressInfo.contact2_2 = changeKoreanToEmptyString(value)
      }
    },
    showContact2Three: {
      get () {
        return this.addressInfo.contact2_3
      },
      set (value) {
        this.addressInfo.contact2_3 = changeKoreanToEmptyString(value)
      }
    }
  }
}
</script>

<style>

</style>
