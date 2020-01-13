<template>
  <div>
    <section class="order_section" v-if="ordererContact">
      <div class="os_top">
        <h3 class="title_style1 title">주문자 정보</h3>
      </div>
      <div class="os_con no_mbr_order">
        <div class="order_info">
          <dl :class="{'order_info_complete':ordererContact.ordererNameInputFlg === 'true'}">
            <dt>
              <label for="ordererName">
                <span class="important">주문자명</span>
              </label>
            </dt>
            <dd>
              <label v-if="ordererContact.ordererNameInputFlg === 'true'">
                <span>{{ordererContact.ordererName}}</span>
              </label>
              <input v-if="ordererContact.ordererNameInputFlg === 'false'" id="ordererName" type="text" v-model="inputOrdererName" ref="ordererName">
            </dd>
          </dl>
          <dl :class="{'order_info_complete':ordererContact.ordererContact1}">
            <dt>
              <label for="ordererContact1_one">
                <span class="important">휴대전화</span>
              </label>
            </dt>
            <dd>
              <template v-if="ordererContact.ordererContact1">
                {{ordererContact.ordererContact1_one}}
                <i class="char">-</i>
                {{ordererContact.ordererContact1_two}}
                <i class="char">-</i>
                {{ordererContact.ordererContact1_three}}
              </template>
              <div class="inp_tel" v-else>
                <input id="ordererContact1_one" type="tel" v-model="showOrdererContactOne" size="3" maxlength="3" ref="ordererContact1_one" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showOrdererContactTwo" size="4" maxlength="4" ref="ordererContact1_two" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
                <i class="char">-</i>
                <input type="tel" v-model="showOrdererContactThree" size="4" maxlength="4" ref="ordererContact1_three" @keyup="validateNumber" @keydown="validateNumber" @blur="validateNumber">
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
                <input id="orderrEmailName" type="text" v-model="ordererContact.ordererEmailName" ref="ordererEmailName">
                <i class="char">@</i>
                <input type="text" v-model="ordererContact.ordererEmailDomain" ref="ordererEmailDomain">
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">배송지 정보</h3>
      </div>
      <div class="os_con">
        <section class="os_delivery_tab" id="osDeliveryTab">
          <h3 :class="[!newAddress? 'tab_menu is_open' : 'tab_menu']" @click.prevent="showAddress(false)">
            <a>최근 배송지 선택</a>
          </h3>
          <div v-if="!newAddress && recentAddresses" class="tab_con" style="">
            <ul class="order_recent_btn">
              <li :class="{'is_curr':addr.addressNo===currAddrNo}" v-for="(addr,idx) in recent" :key="addr.addressNo">
                <a href="javascript:;" @click.prevent="loadAddress(addr.addressNo)">{{addr.receiverName}}</a>
                <a href="javascript:;" @click.prevent="delAddress(addr.addressNo)" class="del">삭제</a>
              </li>
            </ul>
            <div class="order_recent_con">
              <div class="order_recent_info">
                <dl>
                  <dt>받는사람</dt>
                  <dd>{{recentAddresses.receiverName}}</dd>
                </dl>
                <dl>
                  <dt>주소</dt>
                  <dd>
                    {{recentAddresses.receiverZipCd}}<br> {{recentAddresses.receiverAddress}}<br> {{recentAddresses.receiverDetailAddress}}
                  </dd>
                </dl>
                <dl>
                  <dt>휴대전화</dt>
                  <dd>{{contactFormat(recentAddresses.receiverContact1)[0]}}
                    <i class="char">-</i>{{contactFormat(recentAddresses.receiverContact1)[1]}}
                    <i class="char">-</i>{{contactFormat(recentAddresses.receiverContact1)[2]}}</dd>
                </dl>
                <dl v-if="recentAddresses.receiverContact2 !== '--' && recentAddresses.receiverContact2 !== ''">
                  <dt>연락처</dt>
                  <dd>
                    {{contactFormat(recentAddresses.receiverContact2)[0]}}
                    <i class="char">-</i>{{contactFormat(recentAddresses.receiverContact2)[1]}}
                    <i class="char">-</i>{{contactFormat(recentAddresses.receiverContact2)[2]}}
                  </dd>
                </dl>
              </div>
              <!-- 기존에 입력된 개인통관 고유부호 있을 경우 -->
              <div :class="{'order_recent_info':customsIdNumberClass,'order_recent_info order_info':!customsIdNumberClass}" v-if="foreign">

                <dl v-if="recentAddresses.customsIdNumber && recentAddresses.customsIdNumber.length > 0">
                  <dt>개인통관 고유부호</dt>
                  <dd>{{recentAddresses.customsIdNumber}}</dd>
                </dl>

                <dl class="oi_w" v-else>
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
                    <input id="customsIdNumber" type="text" v-model="myInput.customsIdNumber" ref="customsIdNumber" maxlength="13">
                    <p>※ 받는 분 명의로 통관이 진행되오니, 반드시 받는 분 정보를 입력 해 주시기 바랍니다.</p>
                  </dd>
                </dl>
              </div>
              <!-- // 기존에 입력된 개인통관 고유부호 있을 경우 -->
              <!-- 기존에 입력된 개인통관 고유부호 없을 경우 -->
              <!-- <div class="order_info"> -->
              <!-- // 기존에 입력된 개인통관 고유부호 없을 경우 -->
              <div class="order_info">
                <dl class="oi_w">
                  <dt>
                    <label for="myDeliveryMemo1">배송메모</label>
                  </dt>
                  <dd>
                    <select name="" v-model="myDeliveryMemoSelect">
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
          </div>
          <h3 :class="[newAddress? 'tab_menu is_open' : 'tab_menu']" @click.prevent="showAddress(true)">
            <a>신규 배송지 입력</a>
          </h3>
          <div v-if="newAddress" class="tab_con">
            <div class="order_info">
              <dl class="">
                <dt>
                  <label for="receiverName">
                    <span class="important">받는사람</span>
                  </label>
                </dt>
                <dd>
                  <input id="receiverName" type="text" v-model="myInput.receiverName" ref="receiverName">
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
                    <input type="text" v-model="myInput.zipCode" maxlength="7" ref="zipCode" disabled>
                    <a @click.prevent="searchAddress" class="btn_style3 btn_addr" id="btnAddrPop">주소찾기</a>
                  </div>
                  <input type="text" v-model="myInput.dispAddress" ref="dispAddress" disabled>
                  <input type="text" v-model="myInput.detialAddress" ref="detialAddress" placeholder="상세주소를 입력하세요">
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
                    <input id="customsIdNumber" type="text" v-model="myInput.customsIdNumber" ref="customsIdNumber" maxlength="13">
                    <p>※ 받는 분 명의로 통관이 진행되오니, 반드시 받는 분 정보를 입력 해 주시기 바랍니다.</p>
                  </dd>
                </dl>
              </template>
              <dl class="oi_w">
                <dt>
                  <label for="myDeliveryMemo">배송메모</label>
                </dt>
                <dd>
                  <select name="" v-model="myDeliveryMemoSelect">
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
          <Addresses v-show="openSearch" @closePop="addressPopClose" @enterAndClose="selectAddressPopClose"></Addresses>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Addresses from '../common/Addresses'
import { telnoFormat } from '@/utils/StringUtils'
import { gotoOutLink } from '@/utils/utils'
import { validateNumber, changeKoreanToEmptyString } from '@/utils/validateUtils'
export default {
  props: ['input', 'recent', 'foreign', 'ordererContact'],
  data () {
    return {
      currAddrNo: this.recent.length > 0 ? this.recent[0].addressNo : 0,
      unipassShow: false,
      myInput: this.input,
      newAddress: this.recent.length === 0,
      openSearch: false,
      recentAddresses: this.recent.length > 0 ? JSON.parse(JSON.stringify(this.recent[0])) : null,
      selectedMemo: ''
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
    myDeliveryMemoEnter () {
      return ''
    },
    contactFormat (str) {
      return telnoFormat(str)
    },
    showAddress (isNew) {
      if (!isNew && this.recent.length === 0) {
        return
      }
      this.newAddress = isNew
      this.$emit('newAddress', this.newAddress)
      if (!isNew && this.recent.length > 0) {
        this.recentAddresses = JSON.parse(JSON.stringify(this.recent.filter(item => item.addressNo === this.currAddrNo)[0]))
        this.$store.commit('ordersheet/CHANGE_CURRRECENT', this.recentAddresses)
      }
    },
    searchAddress () {
      this.openSearch = true
    },
    delAddress (addrNo) {
      const _this = this
      this.$store.dispatch('shippingaddresses/deleteRecentAddresses', addrNo).then(() => {
        if (_this.recent.length > 0) {
          _this.currAddrNo = _this.recent.length > 0 ? _this.recent[0].addressNo : 0
          _this.recentAddresses = JSON.parse(JSON.stringify(_this.recent[0]))
          _this.$store.commit('ordersheet/CHANGE_CURRRECENT', _this.recentAddresses)
        } else {
          _this.recentAddresses = {}
          _this.newAddress = true
          _this.$emit('newAddress', true)
        }
      })
    },
    loadAddress (addrNo) {
      this.currAddrNo = addrNo
      this.recentAddresses = this.recent.filter((item, idx) => item.addressNo === addrNo)[0]
      this.$store.commit('ordersheet/CHANGE_CURRRECENT', this.recentAddresses)

      const addressRequest = {
        addressRequest: {
          addressType: 'RECENT',
          countryCd: 'KR',
          customsIdNumber: '',
          defaultYn: '',
          receiverAddress: this.recentAddresses.receiverAddress,
          receiverContact1: '',
          receiverContact2: '',
          receiverDetailAddress: '',
          receiverJibunAddress: this.recentAddresses.receiverJibunAddress,
          receiverName: '',
          receiverZipCd: this.recentAddresses.receiverZipCd
        },
        couponRequest: this.couponRequest
      }
      const orderSheetNo = this.$store.state.route.params.orderSheetNo
      this.$store.dispatch('ordersheet/calculateOrderConpons', { orderSheetNo, addressRequest })
    },
    addressPopClose () {
      this.openSearch = false
    },
    selectAddressPopClose (type, zipCode, address, jibunAddress, detialAddress) {
      this.openSearch = false
      this.myInput.zipCode = zipCode
      if (type === 'address') {
        this.myInput.address = address
      } else {
        this.myInput.address = jibunAddress
      }
      this.myInput.jibunAddress = jibunAddress
      this.myInput.dispAddress = this.input.address
      this.myInput.detialAddress = detialAddress

      const orderSheetNo = this.$store.state.route.params.orderSheetNo

      const addressRequest = {
        addressRequest: {
          addressType: 'RECENT',
          countryCd: 'KR',
          customsIdNumber: '',
          defaultYn: '',
          receiverAddress: this.myInput.address,
          receiverContact1: '',
          receiverContact2: '',
          receiverDetailAddress: '',
          receiverJibunAddress: this.myInput.jibunAddress,
          receiverName: '',
          receiverZipCd: this.myInput.zipCode
        },
        couponRequest: this.couponRequest
      }
      this.$store.dispatch('ordersheet/calculateOrderConpons', { orderSheetNo, addressRequest })
    }
  },
  components: {
    Addresses
  },
  computed: {
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
    customsIdNumberClass: {
      get () {
        if (this.recentAddresses.customsIdNumber && this.recentAddresses.customsIdNumber.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    showOrdererContactOne: {
      get () {
        return this.ordererContact.ordererContact1_one
      },
      set (value) {
        this.ordererContact.ordererContact1_one = changeKoreanToEmptyString(value)
      }
    },
    showOrdererContactTwo: {
      get () {
        return this.ordererContact.ordererContact1_two
      },
      set (value) {
        this.ordererContact.ordererContact1_two = changeKoreanToEmptyString(value)
      }
    },
    showOrdererContactThree: {
      get () {
        return this.ordererContact.ordererContact1_three
      },
      set (value) {
        this.ordererContact.ordererContact1_three = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1One: {
      get () {
        return this.myInput.receiverContact1_one
      },
      set (value) {
        this.myInput.receiverContact1_one = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1Two: {
      get () {
        return this.myInput.receiverContact1_two
      },
      set (value) {
        this.myInput.receiverContact1_two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact1Three: {
      get () {
        return this.myInput.receiverContact1_three
      },
      set (value) {
        this.myInput.receiverContact1_three = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2One: {
      get () {
        return this.myInput.receiverContact2_one
      },
      set (value) {
        this.myInput.receiverContact2_one = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Two: {
      get () {
        return this.myInput.receiverContact2_two
      },
      set (value) {
        this.myInput.receiverContact2_two = changeKoreanToEmptyString(value)
      }
    },
    showReceiverContact2Three: {
      get () {
        return this.myInput.receiverContact2_three
      },
      set (value) {
        this.myInput.receiverContact2_three = changeKoreanToEmptyString(value)
      }
    },
    inputOrdererName: {
      get () {
        return this.ordererContact.ordererName
      },
      set (value) {
        this.ordererContact.ordererName = value
      }
    },
    ...mapState('ordersheet', ['deliveryMemo', 'couponRequest']),
    ...mapGetters('ordersheet', ['orderinfoGetter', 'orderProductOptionNos'])
  },
  mounted () {
    this.$emit('newAddress', this.newAddress)
    this.$store.commit('ordersheet/CHANGE_CURRRECENT', this.recentAddresses)
  }
}
</script>

<style>

</style>
