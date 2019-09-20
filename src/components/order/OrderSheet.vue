<template>
  <div id="contents" class="escrow_wrap" v-if="ordersheet">
    <form>
      <fieldset>
        <legend class="acc-hidden">회원 주문 결제 정보 입력/선택 폼</legend>

        <order-address ref="memberInput" v-if="recentAddresses && logined" :input="input" :recent="recentAddresses" :foreign="ordersheet.requireCustomsIdNumber" @newAddress="setNewAddress" :ordererContact="ordersheet.ordererContact"></order-address>
        <order-address-no-member ref="noMemberInput" v-if="!logined" :orderinfo="orderinfo" :input="input" :foreign="ordersheet.requireCustomsIdNumber"></order-address-no-member>

        <section class="order_section">
          <div class="os_top">
            <h3 v-if="orderProductOptionNos" class="title_style1 title">주문 상품 정보 (총{{orderProductOptionNos.length}}개)</h3>
          </div>
          <template v-if="orderinfoGetter">
            <div class="os_con">
              <div :class="[productMoreFlag?'os_ctl is_open':'os_ctl']">
                <ul class="ctl_box">
                  <order-product v-for="option in orderinfoGetter" :key="option.optionNo" :option="option"></order-product>
                </ul>
                <!-- ctl_box -->
                <button @click="showMore" type="button" class="btn_ctl_view" v-if="orderProductOptionNos && orderProductOptionNos.length > 1">
                  <span>주문상품
                    <i></i>
                  </span>
                </button>
              </div>
            </div>
          </template>
        </section>
        <!-- // 배송지 정보 -->
        <section class="order_section" v-if="logined">
          <div class="os_top">
            <h3 class="title_style1 title">쿠폰 적용</h3>
          </div>
          <div class="os_con">
            <dl class="order_coupon">
              <dt>쿠폰 할인금액</dt>
              <dd>
                <div class="price">
                  <strong>{{MyMiliForma(couponAmt)}}</strong> 원
                </div>
                <a @click.prevent="showCouponSelect" class="btn_style3 btn_coupon" id="btnCouponPop">{{couponBtnTXT}}</a>
              </dd>
            </dl>
          </div>
        </section>
        <!-- // 쿠폰적용 -->
        <section class="order_section" v-if="logined">
          <div class="os_top">
            <h3 class="title_style1 title">적립금 사용</h3>
          </div>
          <div class="os_con">
            <dl class="order_acc">
              <dt style="width:55%">
                <table style="width: 100%">
                  <tr>
                    <th style="width: 50%;text-align:left;font-weight: normal">내 적립금</th>
                    <td>{{MyMiliForma(ordersheet.paymentInfo.accumulationAmt)}} 원</td>
                  </tr>
                  <tr>
                    <th style="width: 50%;text-align:left;font-weight: normal">사용 가능 적립금</th>
                    <td>{{MyMiliForma(ordersheet.paymentInfo.availableMaxAccumulationAmt)}} 원</td>
                  </tr>
                </table>
              </dt>
              <dt style="width:20%;line-height: 64px">적립금 사용</dt>
              <dd style="width:24%;line-height: 64px">
                <input id="accumulations" type="number" v-model="input.accumulation" @change.prevent="preventAccmulation" style="vertical-align: middle">
                <span style="line-height: 64px"> 원</span>
              </dd>
            </dl>
          </div>
        </section>
        <!-- // 적립금사용 -->
        <order-amount v-if="ordersheet" :ordersheet="ordersheet"></order-amount>
        <!-- // 결제 정보 -->
        <!-- // 결제수단 선택 -->
        <section class="order_agree">
          <div class="oa_all title_style2">
            <h3 class="check_style1">
              <input type="checkbox" id="agreeAll" v-model="agreenCheckALL">
              <label for="agreeAll">
                <span></span>전체 필수 동의</label>
            </h3>
          </div>
          <ul class="oa_box">
            <li v-if="PRIVACY_USAGE_AGREEMENT" :class="{'is_open':agreen.txt0}">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck0" v-model="agreenCheck.txt0">
                  <label for="agreeCheck0">
                    <span></span>개인정보 수집 · 이용 동의</label>
                </div>
                <button type="button" class="oa_btn" @click="agreenTxtShow('0')">
                  <span></span>
                </button>
              </div>
              <div class="oa_con size_12">
                1. 수집목적<br> 물품 구매 및 배송처리<br><br>
                2. 수집항목<br> 주문자의 이름, 이메일, 휴대폰번호 및 수령인의 이름, 휴대폰번호, 배송지 주소.해외배송상품인 경우 개인통관고유부호, 수령인 영문명<br><br>
                <strong class="hold size_13">3. 보유이용기간<br> 서비스 탈퇴시까지 보관함. 단 관련 법령에 따라 보관이 필요한 정보의 경우 해당 기간 동안 보관함.</strong><br><br>
                4. 쇼핑몰 이용을 위한 필요 최소한의 개인정보이므로 동의를 해주셔야 서비스를  이용하실 수 있습니다.
              </div>
            </li>

            <li v-if="NONE_MEMBER_PRIVACY_USAGE_AGREEMENT" :class="{'is_open':agreen.txt1}">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck1" v-model="agreenCheck.txt1">
                  <label for="agreeCheck1">
                    <span></span>비회원 개인정보 수집 · 이용 동의</label>
                </div>
                <button type="button" class="oa_btn" @click="agreenTxtShow('1')">
                  <span></span>
                </button>
              </div>
              <div class="oa_con">
                1. 수집목적<br> 물품 구매 및 배송처리<br><br> 
                2. 수집항목<br> 주문자의 이름, 이메일, 휴대폰번호 및 수령인의 이름, 휴대폰번호, 배송지 주소<br><br>
                <span class="txt_em">3. 보유이용기간<br> 주문 완료 시부터 1년 동안 보관함. 단, 관련 법령에서 별도의 보존기간을 명시한 경우에는 그 기간을 따름.</span>
              </div>
            </li>
            <li v-if="SELLER_PRIVACY_USAGE_AGREEMENT" :class="{'is_open':agreen.txt2}">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck2" v-model="agreenCheck.txt2">
                  <label for="agreeCheck2">
                    <span></span>개인정보판매자 제공 동의</label>
                </div>
                <button type="button" class="oa_btn" @click="agreenTxtShow('2')">
                  <span></span>
                </button>
              </div>
              <div class="oa_con">
                <span class="txt_em">
                  <strong class="hold size_13">1. 제공받는자<br>
                  <template v-for="txt in sellerList">
                    {{txt}}<br :key="txt" />
                  </template></strong><br>
                  <strong class="hold size_13">2. 제공목적<br> 판매자와구매자의원활한거래진행, 본인의사의확인, 고객상담및불만처리, 물품배송</strong>
                </span><br><br>
                <span class="txt_em">
                  3. 제공하는개인정보항목<br> 주문자성명, 주문자이메일, 주문자휴대전화, 상품구매정보, 상품수령인정보(이름, 주소, 연락처), 해외배송상품인경우‘개인통관고유부호’<br><br>
                </span>
                <span class="txt_em"><strong class="hold size_13">4. 개인정보를제공받는자의개인정보보유및이용기간<br> 배송 및 관련 CS처리 완료시까지</strong></span><br><br>
                <span class="txt_em">5. 귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 배송이 제한될 수 있습니다.</span>
              </div>
            </li>
            <li v-if=" CUSTOMS_CLEARANCE_AGREEMENT" :class="{'is_open':agreen.txt3}">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck3" v-model="agreenCheck.txt3">
                  <label for="agreeCheck3">
                    <span></span>통관정보 수집· 이용 동의</label>
                </div>
                <button type="button" class="oa_btn" @click="agreenTxtShow('3')">
                  <span></span>
                </button>
              </div>
              <div class="oa_con size_12">
                1. 수집 목적<br> 해외 구매 대행 상품의 통관(수입신고)<br><br>
                2. 수집 항목<br> 수령자의 개인통관고유부호<br><br>
                <strong class="size_13">3. 보유·이용 기간<br> 서비스 탈퇴 시까지 보관함. 단, 관련 법령에 따라 보관이 필요한 정보의 경우 해당 기간 동안 보관함.</strong><br><br>
                4.귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.
            </div>
            </li>
            <li v-if="OVERSEA_PRIVACY_USAGE_AGREEMENT && ordersheet.foreignPartners && ordersheet.foreignPartners.length > 0" :class="{'is_open':agreen.txt4}">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck4" v-model="agreenCheck.txt4">
                  <label for="agreeCheck4">
                    <span></span>개인정보 국외 이전 동의</label>
                </div>
                <button type="button" class="oa_btn" @click="agreenTxtShow('4')">
                  <span></span>
                </button>
              </div>
              <div class="oa_con size_12">
                <strong class="size_13">1. 이전 받는 자와 국적<br>
                <div v-for="foreign in ordersheet.foreignPartners" :key="foreign.partnerName">
                  회사명: {{foreign.partnerName}}<br> 
                  국적: {{foreign.countryCd}}<br> 
                  정보관리책임자: {{foreign.privacyManagerName }}({{foreign.privacyManagerPhoneNo}})<br><br>
                </div>
                </strong>
                <strong class="size_13">2. 이전 목적<br> 판매자와 구매자의 원활한 거래진행, 본인 의사의 확인, 고객 상담 및 불만 처리, 물품 배송</strong><br><br>
                3. 이전되는 개인정보 항목<br> 주문자 성명, 주문자 이메일, 주문자 휴대전화, 상품 구매정보, 상품 수령인 정보(이름, 주소, 연락처), ‘개인통관고유부호’<br><br>
                4. 이전 시기 및 이전 방법<br> 주문 완료 시 전용관리자 페이지를 통한 조회 및 출력<br><br>
                <strong class="size_13">5. 개인정보를 이전받는 자의 개인정보 보유 및 이용 기간<br> 개인정보 이용 목적 달성 시까지 보존함</strong><br><br>
                6. 귀하는 동의를 거부할 권리가 있습니다. 다만 동의를 거부하시는 경우 주문 및 결제가 제한될 수 있습니다.
                </div>
            </li>
            <!-- <li v-if="TERMS_OF_USE">
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck5" v-model="agreenCheck.txt5">
                  <label for="agreeCheck5">
                    <span></span>위 구매조건을 확인하였으며, 결제진행에 동의합니다.</label>
                </div>
              </div>
            </li> -->
            <li>
              <div class="oa_check">
                <div class="check_style1">
                  <input type="checkbox" id="agreeCheck6" v-model="agreenCheck.txt6">
                  <label for="agreeCheck6">
                    <span></span>위 구매조건을 확인하였으며, 결제진행에 동의합니다.</label>
                </div>
              </div>
            </li>
          </ul>
        </section>
        <div class="order_buy_btn btn_1">
          <a v-if="isShowPayco" href="" @click.prevent="paments('PAYCO')" class="btn_payco btn_style1">
            <span>PAYCO</span> 결제하기</a>
          <div class="payment_list">
            <a v-if="isShowCreditCard" href="" @click.prevent="paments('CREDIT_CARD')" class="btn_payco btn_style3">신용카드</a>
            <a v-if="isShowVirtualAccount" href="" @click.prevent="paments('VIRTUAL_ACCOUNT')" class="btn_payco btn_style3">무통장입금</a>
            <a v-if="isShowRealTimeAcocountTransfer" href="" @click.prevent="paments('REALTIME_ACCOUNT_TRANSFER')" class="btn_payco btn_style3">실시간 계좌이체</a>
          </div>
        </div>
        <!-- // 전체 필수동의 -->
        <!-- <div class="order_buy_btn btn_1" v-if="!orderAvailablePayTypes('CREDIT_CARD')">
          <a @click.prevent="paments('PAYCO')" class="btn_payco btn_style1">
            <span>PAYCO</span> 결제하기</a>
        </div>

        <div class="order_buy_btn btn_2" v-else>
          <a @click.prevent="paments('PAYCO')" class="btn_payco btn_style1">
            <span>PAYCO</span> 결제하기
          </a>
          <a @click.prevent="paments('CREDIT_CARD')" class="btn_style3">신용카드 결제하기</a>
        </div> -->
      </fieldset>
    </form>
    <coupon-apply v-if="couponSelect" :orderPaycoCouponCount="orderPaycoCouponCount" :couponRequestGroup="couponRequest" :orderCoupons="orderCoupons" :orderCoponsOptionCnt="orderCoponsOptionCnt" :hasProductCoupon="hasProductCoupon" :orderSelectedPaycoCoupon="orderSelectedPaycoCoupon" @closePop="showCouponSelect"></coupon-apply>
  </div>
</template>

<script>
/* global NCPPay */

import { mapState, mapGetters } from 'vuex'
import { addClass, removeClass, scriptLoader } from '@/utils/utils'
import { formatCurrency } from '@/utils/StringUtils'
import cookies from 'js-cookie'
import config from '@/config/index'
import Addresses from '../common/Addresses'
import OrderAddress from './OrderAddress'
import OrderAddressNoMember from './OrderAddressNoMember'
import OrderProduct from './OrderProduct'
import OrderAmount from './OrderAmount'
import CouponApply from './CouponApply'
export default {
  name: 'OrderSheet',
  metaInfo: {
    title: '주문결제'
  },
  beforeCreate () {
    scriptLoader(config.payPlusJs)
  },
  data () {
    return {
      agreen: {
        txt0: false,
        txt1: false,
        txt2: false,
        txt3: false,
        txt4: false
      },
      agreenCheck: {
        txt0: false,
        txt1: false,
        txt2: false,
        txt3: false,
        txt4: false,
        txt5: false,
        txt6: false
      },
      orderSheetNo: this.$store.state.route.params.orderSheetNo,
      logined: this.$store.getters.isLogined,
      couponSelect: false,
      divshowFlagArray: [],
      productMoreFlag: false,
      payTypeConfirm: false,
      // newAddress: false,
      defaultAddress: {},
      input: {
        receiverName: '',
        zipCode: '',
        dispAddress: '',
        address: '',
        detialAddress: '',
        jibunAddress: '',
        customsIdNumber: '',
        receiverContact1_one: '',
        receiverContact1_two: '',
        receiverContact1_three: '',
        receiverContact2_one: '',
        receiverContact2_two: '',
        receiverContact2_three: '',
        accumulation: ''
      },
      orderinfo: {
        useDefaultAddress: true,
        saveAddressBook: true,
        orderMemo: '',
        deliveryMemo: '',
        updateMember: true,
        member: true,
        orderTitle: '',
        orderer: {
          ordererName: '',
          ordererContact1: '',
          ordererContact2: '',
          ordererEmail: '',
          ordererContact1_one: '',
          ordererContact1_two: '',
          ordererContact1_three: '',
          orderrEmailName: '',
          orderrEmailDomain: ''
        },
        applyInsurance: false,
        agreementEmail: false,
        agreementSMS: false,
        // sex: 'MALE',
        insuranceType: 'USAFE',
        birthYmd: '',
        tempPassword: '',
        tempPasswordConfirm: '',
        payType: 'PAYCO',
        pgType: 'PAYCO',
        payBtnOnce: false
      }
    }
  },
  components: {
    Addresses,
    OrderAddress,
    OrderAddressNoMember,
    OrderProduct,
    OrderAmount,
    CouponApply
  },
  methods: {
    preventAccmulation () {
      if (this.input.accumulation > this.ordersheet.paymentInfo.availableMaxAccumulationAmt) {
        this.input.accumulation = this.ordersheet.paymentInfo.availableMaxAccumulationAmt
      } else if (this.input.accumulation < 0 || this.input.accumulation === '') {
        this.input.accumulation = 0
      }

      this.input.accumulation = parseInt(this.input.accumulation)
      this.$store.commit('ordersheet/CHANGE_ACCUMULATION_AMT', this.input.accumulation)
    },
    MyMiliForma (val) {
      return formatCurrency(val)
    },
    agreenTxtShow (txtKey) {
      switch (txtKey) {
        case '0':
          this.agreen.txt0 = !this.agreen.txt0
          break
        case '1':
          this.agreen.txt1 = !this.agreen.txt1
          break
        case '2':
          this.agreen.txt2 = !this.agreen.txt2
          break
        case '3':
          this.agreen.txt3 = !this.agreen.txt3
          break
        case '4':
          this.agreen.txt4 = !this.agreen.txt4
          break
      }
    },
    showMore () {
      this.productMoreFlag = !this.productMoreFlag
    },
    setNewAddress (newAddr) {
      this.$store.commit('ordersheet/CHANGE_NEWADDRESS', newAddr)
      // this.newAddress = newAddr
    },
    showCouponSelect () {
      const hasCartCoupon = this.orderCoupons.cartCoupons && this.orderCoupons.cartCoupons.length > 0
      const hasDeliverCoupon = this.orderCoupons.deliveryCoupons && this.orderCoupons.deliveryCoupons.length > 0
      if (!this.hasProductCoupon && !hasCartCoupon && !hasDeliverCoupon) {
        alert('적용 가능한 쿠폰이 없습니다.')
      } else {
        this.couponSelect = !this.couponSelect
        if (this.couponSelect) {
          addClass(document.body, 'no_scroll')
          addClass(document.body, 'is_layer_open')
        } else {
          removeClass(document.body, 'is_layer_open')
          removeClass(document.body, 'no_scroll')
        }
      }
    },
    isNewAddress () {
      return Object.keys(this.input)
        .some(key => this.input[key] !== '')
    },
    validateInput () {
      const inputRefs = this.logined ? this.$refs.memberInput.$refs : this.$refs.noMemberInput.$refs

      const Validater = (valiInfos) => {
        this.valiInfos = valiInfos
      }
      const checkLengthFn = () => {
        let isBreak = false
        let hasError = false
        this.valiInfos.forEach((item) => {
          item.hasError = false
          if (!isBreak) {
            if (item.eqTarget) {
              if (item.inputValue !== item.eqTarget) {
                item.hasError = true
                item.message = item.eqTargetMessage
              }
            } else if (item.pattern) {
              if (!item.pattern.test(item.inputValue)) {
                item.hasError = true
              }
            } else if (item.length) {
              if (item.inputValue.length !== item.length) {
                item.hasError = true
              }
            } else if (item.minLength && item.maxLength) {
              if (item.inputValue.length < item.minLength || item.inputValue.length > item.maxLength) {
                item.hasError = true
              }
            } else if (item.minLength) {
              if (item.inputValue.length < item.minLength) {
                item.hasError = true
              }
            } else {
              if (item.inputValue.length > item.maxLength) {
                item.hasError = true
              }
            }
            if (item.hasError) {
              alert(item.message)
              isBreak = true
              hasError = true
              item.input.focus()
            }
          }
        })
        return hasError
      }
      Validater.prototype.validate = checkLengthFn

      const validateRole = []
      if (!this.logined) {
        const nomember =
          [{
            inputValue: this.orderinfo.orderer.ordererName,
            message: '주문자명을 입력해주세요',
            pattern: /\S+/,
            input: inputRefs.ordererName
          },
          {
            inputValue: this.orderinfo.orderer.ordererContact1_one,
            message: '휴대전화를 입력해주세요.',
            pattern: /^01[0|1|6|7|8|9]$/,
            input: inputRefs.ordererContact1_one
          },
          {
            inputValue: this.orderinfo.orderer.ordererContact1_two,
            message: '휴대전화를 입력해주세요.',
            pattern: /\d{3,4}/,
            input: inputRefs.ordererContact1_two
          },
          {
            inputValue: this.orderinfo.orderer.ordererContact1_three,
            message: '휴대전화를 입력해주세요.',
            pattern: /\d{4}/,
            input: inputRefs.ordererContact1_three
          },
          {
            inputValue: this.orderinfo.orderer.orderrEmailName,
            message: '이메일 주소가 유효하지 않습니다.',
            pattern: /^[\w-.]+$/,
            input: inputRefs.orderrEmailName
          },
          {
            inputValue: this.orderinfo.orderer.orderrEmailDomain,
            message: '이메일 주소가 유효하지 않습니다.',
            pattern: /^[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/,
            input: inputRefs.orderrEmailDomain
          },
          {
            inputValue: this.orderinfo.tempPassword,
            message: '주문비밀번호를 입력해주세요.',
            pattern: /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*? ]).*$/,
            input: inputRefs.tempPassword
          },
          {
            inputValue: this.orderinfo.tempPasswordConfirm,
            message: '주문비밀번호를 입력해주세요.',
            minLength: 8,
            maxLength: 20,
            eqTarget: this.orderinfo.tempPassword,
            eqTargetMessage: '비밀번호가 일치하지 않습니다.',
            input: inputRefs.tempPasswordConfirm
          }
          ]
        validateRole.push(...nomember)
      } else {
        if (!this.ordersheet.ordererContact.ordererContact1_one ||
          !this.ordersheet.ordererContact.ordererContact1_two ||
          !this.ordersheet.ordererContact.ordererContact1_three
        ) {
          const ordererContact1 =
            [{
              inputValue: this.ordersheet.ordererContact.ordererContact1_one,
              message: '휴대전화를 입력해주세요.',
              pattern: /^01[0|1|6|7|8|9]$/,
              input: inputRefs.ordererContact1_one
            },
            {
              inputValue: this.ordersheet.ordererContact.ordererContact1_two,
              message: '휴대전화를 입력해주세요.',
              pattern: /\d{3,4}/,
              input: inputRefs.ordererContact1_two
            },
            {
              inputValue: this.ordersheet.ordererContact.ordererContact1_three,
              message: '휴대전화를 입력해주세요.',
              pattern: /\d{4}/,
              input: inputRefs.ordererContact1_three
            }]
          validateRole.push(...ordererContact1)
        }
        const email =
          [{
            inputValue: this.ordersheet.ordererContact.ordererEmailName,
            message: '이메일 주소가 유효하지 않습니다.',
            pattern: /^[\w-.]+$/,
            input: inputRefs.ordererEmailName
          },
          {
            inputValue: this.ordersheet.ordererContact.ordererEmailDomain,
            message: '이메일 주소가 유효하지 않습니다.',
            pattern: /^[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/,
            input: inputRefs.ordererEmailDomain
          }]
        validateRole.push(...email)
      }

      const memberRole = [{
        inputValue: this.input.receiverName,
        message: '받는사람을 입력해주세요.',
        pattern: /\S+/,
        input: inputRefs.receiverName
      },
      {
        inputValue: this.input.zipCode,
        message: '주소를 입력하세요.',
        pattern: /\S+/,
        input: inputRefs.detialAddress
      },
      {
        inputValue: this.input.dispAddress,
        message: '주소를 입력하세요.',
        pattern: /\S+/,
        input: inputRefs.detialAddress
      },
      {
        inputValue: this.input.receiverContact1_one,
        message: '휴대전화를 입력해주세요.',
        pattern: /^01[0|1|6|7|8|9]$/,
        input: inputRefs.receiverContact1_one
      },
      {
        inputValue: this.input.receiverContact1_two,
        message: '휴대전화를 입력해주세요.',
        pattern: /^\d{3,4}$/,
        input: inputRefs.receiverContact1_two
      },
      {
        inputValue: this.input.receiverContact1_three,
        message: '휴대전화를 입력해주세요.',
        pattern: /^\d{4}$/,
        input: inputRefs.receiverContact1_three
      }
      ]
      validateRole.push(...memberRole)
      if (this.input.receiverContact2_one !== '' ||
        this.input.receiverContact2_two !== '' ||
        this.input.receiverContact2_three !== ''
      ) {
        const telno2 = [
          {
            inputValue: this.input.receiverContact2_one,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{2,3}$/,
            input: inputRefs.receiverContact2_one
          },
          {
            inputValue: this.input.receiverContact2_two,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{3,4}$/,
            input: inputRefs.receiverContact2_two
          },
          {
            inputValue: this.input.receiverContact2_three,
            message: '연락처를 입력해주세요.',
            pattern: /^\d{4}$/,
            input: inputRefs.receiverContact2_three
          }]
        validateRole.push(...telno2)
      }
      /** 개인통관 고유부호 */
      if (this.ordersheet.requireCustomsIdNumber) {
        validateRole.push(
          {
            inputValue: this.input.customsIdNumber,
            message: '개인통관고유부호가 유효하지 않습니다. ',
            pattern: /^[p|P]\d{12}$/,
            input: inputRefs.customsIdNumber
          }
        )
      }
      const addressValidate = new Validater(validateRole)

      return !addressValidate.validate()
    },
    validateContact () {
      const inputRefs = this.logined ? this.$refs.memberInput.$refs : this.$refs.noMemberInput.$refs

      const Validater = (valiInfos) => {
        this.valiInfos = valiInfos
      }
      const checkLengthFn = () => {
        let isBreak = false
        let hasError = false
        this.valiInfos.forEach((item) => {
          item.hasError = false
          if (!isBreak) {
            if (item.eqTarget) {
              if (item.inputValue !== item.eqTarget) {
                item.hasError = true
                item.message = item.eqTargetMessage
              }
            } else if (item.pattern) {
              if (!item.pattern.test(item.inputValue)) {
                item.hasError = true
              }
            } else if (item.length) {
              if (item.inputValue.length !== item.length) {
                item.hasError = true
              }
            } else if (item.minLength && item.maxLength) {
              if (item.inputValue.length < item.minLength || item.inputValue.length > item.maxLength) {
                item.hasError = true
              }
            } else if (item.minLength) {
              if (item.inputValue.length < item.minLength) {
                item.hasError = true
              }
            } else {
              if (item.inputValue.length > item.maxLength) {
                item.hasError = true
              }
            }
            if (item.hasError) {
              alert(item.message)
              isBreak = true
              hasError = true
              item.input.focus()
            }
          }
        })
        return hasError
      }
      Validater.prototype.validate = checkLengthFn

      const validateRole = []
      if (!this.ordersheet.ordererContact.ordererContact1_one ||
        !this.ordersheet.ordererContact.ordererContact1_two ||
        !this.ordersheet.ordererContact.ordererContact1_three
      ) {
        const ordererContact1 =
          [{
            inputValue: this.ordersheet.ordererContact.ordererContact1_one,
            message: '휴대전화를 입력해주세요.',
            pattern: /^01[0|1|6|7|8|9]$/,
            input: inputRefs.ordererContact1_one
          },
          {
            inputValue: this.ordersheet.ordererContact.ordererContact1_two,
            message: '휴대전화를 입력해주세요.',
            pattern: /\d{3,4}/,
            input: inputRefs.ordererContact1_two
          },
          {
            inputValue: this.ordersheet.ordererContact.ordererContact1_three,
            message: '휴대전화를 입력해주세요.',
            pattern: /\d{4}/,
            input: inputRefs.ordererContact1_three
          }]
        validateRole.push(...ordererContact1)
      }
      const email =
        [{
          inputValue: this.ordersheet.ordererContact.ordererEmailName,
          message: '이메일 주소가 유효하지 않습니다.',
          pattern: /^[\w-.]+$/,
          input: inputRefs.ordererEmailName
        },
        {
          inputValue: this.ordersheet.ordererContact.ordererEmailDomain,
          message: '이메일 주소가 유효하지 않습니다.',
          pattern: /^[0-9A-Za-z]+(\.[0-9A-Za-z]+)+$/,
          input: inputRefs.ordererEmailDomain
        }]
      validateRole.push(...email)

      const addressValidate = new Validater(validateRole)

      return !addressValidate.validate()
    },
    paments (paytype) {
      if (!this.recentAddresses || this.recentAddresses.length === 0 || this.newAddress) {
        if (!this.validateInput()) {
          return
        }
      } else {
        if (!this.validateContact()) {
          return
        }
      }

      this.paymentType = paytype
      const inputRefs = this.logined ? this.$refs.memberInput.$refs : this.$refs.noMemberInput.$refs
      if (this.ordersheet.requireCustomsIdNumber) {
        const pattern = /^[p|P]\d{12}$/
        let cusid = this.logined && this.currRecent ? this.currRecent.customsIdNumber : this.input.customsIdNumber
        if (cusid === '' && this.input.customsIdNumber !== '') {
          cusid = this.input.customsIdNumber
        }
        if (!pattern.test(cusid)) {
          alert('개인통관고유부호가 유효하지 않습니다.')
          if (inputRefs.customsIdNumber) {
            inputRefs.customsIdNumber.focus()
          }
          return
        }
      }
      if (this.deliveryMemo.length > 50) {
        alert('배송 메모최대 50자까지 입력가능. ')
        inputRefs.myDeliveryMemo.focus()
        return
      }
      if (!this.agreenCheckALL) {
        alert('동의 항목에 체크하여야 결제를 진행할 수 있습니다.')
        return
      }

      if (!this.$store.state.memberIsLogin()) {
        this.orderinfo.member = false
        this.orderinfo.updateMember = false
        this.orderinfo.useDefaultAddress = false
        this.orderinfo.saveAddressBook = false
      }

      let addressData = {}
      if (this.currRecent) {
        addressData = this.currRecent
      }
      if (!this.recentAddresses || this.recentAddresses.length === 0 || this.newAddress) {
        addressData.addressName = ''
        addressData.addressNo = 0
        addressData.receiverName = this.input.receiverName
        addressData.receiverContact1 =
          this.input.receiverContact1_one +
          '-' +
          this.input.receiverContact1_two +
          '-' +
          this.input.receiverContact1_three
        addressData.receiverContact2 =
          this.input.receiverContact2_one +
          '-' +
          this.input.receiverContact2_two +
          '-' +
          this.input.receiverContact2_three
        if (addressData.receiverContact2 === '--') {
          addressData.receiverContact2 = ''
        }
        addressData.receiverZipCd = this.input.zipCode
        addressData.receiverAddress = this.input.address
        addressData.receiverJibunAddress = this.input.jibunAddress
        addressData.receiverDetailAddress = this.input.detialAddress
        addressData.customsIdNumber = this.input.customsIdNumber
        this.orderinfo.useDefaultAddress = false

        this.orderinfo.orderer.ordererContact1 = this.orderinfo.orderer.ordererContact1_one + '-' +
          this.orderinfo.orderer.ordererContact1_two + '-' +
          this.orderinfo.orderer.ordererContact1_three
        this.orderinfo.orderer.ordererEmail = this.orderinfo.orderer.orderrEmailName + '@' +
          this.orderinfo.orderer.orderrEmailDomain
      }
      if (this.logined) {
        if (!!this.ordersheet.ordererContact.ordererContact1_one &&
          !!this.ordersheet.ordererContact.ordererContact1_two &&
          !!this.ordersheet.ordererContact.ordererContact1_three
        ) {
          this.ordersheet.ordererContact.ordererContact1 = this.ordersheet.ordererContact.ordererContact1_one + '-' +
            this.ordersheet.ordererContact.ordererContact1_two + '-' +
            this.ordersheet.ordererContact.ordererContact1_three
        } else {
          this.ordersheet.ordererContact.ordererContact1 = ''
        }

        this.ordersheet.ordererContact.ordererEmail = this.ordersheet.ordererContact.ordererEmailName + '@' +
          this.ordersheet.ordererContact.ordererEmailDomain
        this.orderinfo.orderer = this.ordersheet.ordererContact
      }

      if (this.ordersheet.requireCustomsIdNumber && addressData.customsIdNumber === '') {
        addressData.customsIdNumber = this.input.customsIdNumber
        this.$store.dispatch('shippingaddresses/putRecentAddress', addressData)
      }
      addressData.countryCd = 'KR'
      this.orderinfo.countryCd = 'KR'
      this.orderinfo.deliveryMemo = this.deliveryMemo
      this.orderinfo.payType = this.payType
      if (this.payType === 'PAYCO') {
        this.orderinfo.pgType = 'PAYCO'
      } else {
        this.orderinfo.pgType = 'KCP'
      }
      // this.orderinfo.pgType = this.pgType

      const coupon = JSON.parse(JSON.stringify(this.couponRequest))
      if (coupon.productCoupons && coupon.productCoupons.length > 0) {
        coupon.productCoupons = coupon.productCoupons.filter(item => item.couponIssueNo !== 0 || item.plusCouponIssueNo !== 0)
      }

      if (!this.orderinfo.orderer.ordererEmail) {
        this.orderinfo.orderer.ordererEmail = ''
      }
      if (!this.orderinfo.orderer.ordererContact1) {
        this.orderinfo.orderer.ordererContact1 = ''
      }
      const data = {
        orderSheetNo: this.orderSheetNo,
        ...this.orderinfo,
        addressNo: addressData.addressNo,
        addressName: addressData.addressName,
        shippingAddress: {
          ...addressData
        },
        coupons: coupon,
        paymentAmtForVerification: this.ordersheet.paymentInfo.paymentAmt - this.input.accumulation,
        subPayAmt: this.input.accumulation
      }
      let confirmUrl = `${location.protocol}//${location.host}/order/paymentconfirm`
      let flg = false
      if (this.$store.state.route.query.cartnos) {
        confirmUrl += '?cartnos=' + encodeURIComponent(this.$store.state.route.query.cartnos)
        flg = true
      }
      const searchProductID = this.$store.state.route.query.searchProductID
      const productNo = this.$store.state.route.query.productNo
      if (productNo) {
        if (flg) {
          confirmUrl += '&productNo=' + productNo
        } else {
          confirmUrl += '?productNo=' + productNo
          flg = true
        }
      }
      if (searchProductID) {
        if (flg) {
          confirmUrl += '&searchProductID=' + searchProductID
        } else {
          confirmUrl += '?searchProductID=' + searchProductID
        }
      }
      if (!this.payBtnOnce) {
        this.payBtnOnce = true
        NCPPay.setConfiguration({
          clientId: config.ncpClientId,
          accessToken: cookies.get('ncpAccessToken'),
          confirmUrl: confirmUrl,
          platform: config.platform()
        })
        NCPPay.reservation(data, (response) => {
          this.payBtnOnce = false
        })
      }
    }
  },
  computed: {
    agreenCheckALL: {
      get () {
        return (this.agreenCheck.txt0 === this.PRIVACY_USAGE_AGREEMENT) &&
          (this.agreenCheck.txt1 === this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreenCheck.txt2 === this.SELLER_PRIVACY_USAGE_AGREEMENT) &&
          (this.agreenCheck.txt3 === this.CUSTOMS_CLEARANCE_AGREEMENT) &&
          (this.agreenCheck.txt4 === this.OVERSEA_PRIVACY_USAGE_AGREEMENT) &&
          // (this.agreenCheck.txt5 === this.TERMS_OF_USE) &&
          (this.agreenCheck.txt6 === true)
      },
      set (val) {
        if (this.PRIVACY_USAGE_AGREEMENT) {
          this.agreenCheck.txt0 = val
        }
        if (this.NONE_MEMBER_PRIVACY_USAGE_AGREEMENT) {
          this.agreenCheck.txt1 = val
        }
        if (this.SELLER_PRIVACY_USAGE_AGREEMENT) {
          this.agreenCheck.txt2 = val
        }
        if (this.CUSTOMS_CLEARANCE_AGREEMENT) {
          this.agreenCheck.txt3 = val
        }
        if (this.OVERSEA_PRIVACY_USAGE_AGREEMENT) {
          this.agreenCheck.txt4 = val
        }
        if (this.TERMS_OF_USE) {
          this.agreenCheck.txt5 = val
        }
        this.agreenCheck.txt6 = val
      }
    },
    sellerList: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.deliveryGroups.map(item => item.partnerName)
        }
      }
    },
    TERMS_OF_USE: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'TERMS_OF_USE')
        }
      }
    },
    NONE_MEMBER_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'NONE_MEMBER_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    OVERSEA_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'OVERSEA_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    CUSTOMS_CLEARANCE_AGREEMENT: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'CUSTOMS_CLEARANCE_AGREEMENT')
        }
      }
    },
    SELLER_PRIVACY_USAGE_AGREEMENT: {
      get () {
        if (this.ordersheet) {
          return this.ordersheet.agreementTypes.some(item => item === 'SELLER_PRIVACY_USAGE_AGREEMENT')
        }
      }
    },
    paymentType: {
      get () {
        return this.payType
      },
      set (val) {
        this.$store.commit('ordersheet/CHANGE_PAYTYPE', val)
      }
    },
    couponBtnTXT: {
      get () {
        if (this.couponAmt === 0) {
          return '쿠폰적용'
        } else {
          return '쿠폰변경'
        }
      }
    },
    isShowPayco () {
      return this.ordersheet.availablePayTypes && this.ordersheet.availablePayTypes.some((type) => type.payType === 'PAYCO' && type.pgTypes.some((pg) => pg === 'PAYCO'))
    },
    isShowCreditCard () {
      return this.ordersheet.availablePayTypes && this.ordersheet.availablePayTypes.some((type) => type.payType === 'CREDIT_CARD' && type.pgTypes.some((pg) => pg === 'KCP'))
    },
    isShowVirtualAccount () {
      return this.ordersheet.availablePayTypes && this.ordersheet.availablePayTypes.some((type) => type.payType === 'VIRTUAL_ACCOUNT' && type.pgTypes.some((pg) => pg === 'KCP'))
    },
    isShowRealTimeAcocountTransfer () {
      return this.ordersheet.availablePayTypes && this.ordersheet.availablePayTypes.some((type) => type.payType === 'REALTIME_ACCOUNT_TRANSFER' && type.pgTypes.some((pg) => pg === 'KCP'))
    },
    ...mapGetters('ordersheet', ['orderinfoGetter', 'orderProductOptionNos', 'orderCoponsOptionCnt', 'hasProductCoupon', 'orderAvailablePayTypes', 'orderSelectedPaycoCoupon', 'orderPaycoCouponCount']),
    ...mapState('ordersheet', ['ordersheet', 'orderCoupons', 'couponAmt', 'couponRequest', 'newAddress', 'currRecent', 'deliveryMemo', 'payType', 'pgType']),
    // ...mapState('profile', ['profile']),
    ...mapState('shippingaddresses', ['recentAddresses'])
  }
}
</script>

<style>
.oa_con.size_12 {
  font-size: 12px;
}
strong.size_13 {
  line-height: 2rem;
  font-size: 1.44rem
}
</style>
