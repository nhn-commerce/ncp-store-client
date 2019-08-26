<template>
  <div id="contents" class="escrow_wrap">
    <div class="order_complete">
      <h2 class="o_cpt_title" :class="result !== 'SUCCESS' ? 'error_title' : ''">
        <template v-if="result === 'SUCCESS'">
          주문이 정상적으로 완료되었습니다.
        </template>
        <template v-else>
          결제 승인에 실패했습니다.
        </template>
      </h2>
      <div class="o_cpt_con">
        <table class="o_cpt_table" v-if="order && result === 'SUCCESS'">
          <caption class="acc-hidden">주문자 정보 테이블</caption>
          <tbody>
            <tr>
              <th>주문번호</th>
              <td>{{orderNo}}</td>
            </tr>
            <tr>
              <th>주문자</th>
              <td> {{order.orderer.ordererName}}</td>
            </tr>
            <tr>
              <th>배송지정보</th>
              <td>
                <dl class="o_cpt_info">
                  <dt> {{order.shippingAddress.receiverName}}</dt>
                  <dd>{{contactFormat(order.shippingAddress.receiverContact1)[0]}}-{{contactFormat(order.shippingAddress.receiverContact1)[1]}}-{{contactFormat(order.shippingAddress.receiverContact1)[2]}}
                    <template v-if="order.shippingAddress.receiverContact2 && order.shippingAddress.receiverContact2.length > 2">
                      / {{contactFormat(order.shippingAddress.receiverContact2)[0]}}-{{contactFormat(order.shippingAddress.receiverContact2)[1]}}-{{contactFormat(order.shippingAddress.receiverContact2)[2]}}
                    </template>
                  </dd>
                  <dd>
                    ({{order.shippingAddress.receiverZipCd}})<br> {{order.shippingAddress.receiverAddress}}<br> {{order.shippingAddress.receiverDetailAddress}}
                  </dd>
                </dl>
              </td>
            </tr>
            <tr>
              <th>배송메모</th>
              <td> {{order.deliveryMemo}}</td>
            </tr>
            <tr>
              <th>결제수단</th>
              <td>
                <template v-if="order.payType !== 'VIRTUAL_ACCOUNT'">
                  {{order.payTypeLabel}}
                </template>
                <template v-else>
                  <dl class="o_pay_info">
                    <dt>{{order.payTypeLabel}}</dt>
                    <dd>
                      예금주 : {{order.payInfo.bankInfo.depositorName}}<br>
                      입금은행 : {{order.payInfo.bankInfo.bankName}}<br>
                      입금계좌 : {{order.payInfo.bankInfo.account}}<br>
                      입금기한 : <strong>{{order.payInfo.bankInfo.paymentExpirationYmdt}}</strong>
                    </dd>
                  </dl>
                </template>
                <template v-if="order.payInfo.cardInfo">
                  {{order.payInfo.cardInfo.cardName}} {{order.payInfo.cardInfo.cardNo}}
                  <template v-if="order.payInfo.cardInfo.installmentPeriod && order.payInfo.cardInfo.installmentPeriod > 0">
                    <br> {{order.payInfo.cardInfo.installmentPeriod}}개월
                    <template v-if="order.payInfo.cardInfo.noInterest">
                      무이자
                    </template>
                  </template>
                  <template v-else>
                    일시불
                  </template>
                </template>
              </td>
            </tr>
            <tr>
              <th>결제금액</th>
              <td>
                <strong class="price">{{MyMiliForma(order.payInfo.payAmt) || 0}}</strong> 원</td>
            </tr>
          </tbody>
        </table>
        <table class="o_cpt_table" v-if="!order && result === 'SUCCESS'">
          <caption class="acc-hidden">주문자 정보 테이블</caption>
          <tbody>
            <tr>
              <th>주문번호</th>
              <td>{{orderNo}}</td>
            </tr>
          </tbody>
        </table>
        <div class="o_cpt_txt" v-if="!order && result === 'SUCCESS'">
          <p>주문내역 확인으로 배송상태를 확인하실 수 있습니다.</p>
        </div>
        <table class="o_cpt_table" v-if="result !== 'SUCCESS'">
          <caption class="acc-hidden">결제 실패 정보 테이블</caption>
          <tbody>
            <tr>
              <th>실패사유</th>
              <td>{{message}}</td>
            </tr>
          </tbody>
        </table>

        <div class="o_cpt_txt" v-if="result !== 'SUCCESS'">
          <p>
            실패사유를 확인하신 후 ‘이전페이지 가기’버튼을 통해 주문/결제를 다시 시도하시거나, 계속 실패되시는 경우 고객센터({{telNum}})로 문의 주시기 바랍니다.
          </p>
        </div>

        <div class="o_cpt_btn" v-if="result === 'SUCCESS'">
          <a class="btn_style3" @click.prevent="gotoOrder">주문내역 확인</a>
          <a class="btn_style1" @click.prevent="gotoHome">쇼핑 계속하기</a>
        </div>

        <div class="o_cpt_btn" v-if="result !== 'SUCCESS'">
          <a href="" class="btn_style3" @click.prevent="gotoPre">이전페이지</a>
          <a href="" class="btn_style1" @click.prevent="gotoHome">쇼핑 계속하기</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* global NCPSearch */
import { mapState } from 'vuex'
import { formatCurrency, telnoFormat } from '@/utils/StringUtils'
import { loadNCPSearchScript } from '@/store'
import cookies from 'js-cookie'
import config from '@/config'

export default {
  name: 'PaymentConfirm',
  metaInfo: {
    title: '주문완료'
  },
  data () {
    return {
      params: '',
      bankName: '',
      account: '',
      vaDate: '',
      payType: '',
      resp: '',
      nonemember: false,
      telNum: config.telNum
    }
  },
  methods: {
    MyMiliForma (val) {
      return formatCurrency(val)
    },
    contactFormat (str) {
      return telnoFormat(str)
    },
    gotoOrder () {
      if (this.order) {
        if (opener) {
          opener.location.href = `/mypage/orderdetail/${this.order.orderNo}`
          self.close()
        } else {
          location.href = `/mypage/orderdetail/${this.order.orderNo}`
        }
      } else {
        if (opener) {
          opener.location.href = '/member/nonemember/ordersearch'
          self.close()
        } else {
          location.href = '/member/nonemember/ordersearch'
        }
      }
    },
    gotoHome () {
      if (opener) {
        opener.location.href = '/'
        self.close()
      } else {
        location.href = '/'
      }
    },
    gotoPre () {
      if (opener) {
        opener.location.href = `/order/${this.orderSheetNo}`
        self.close()
      } else {
        location.href = `/order/${this.orderSheetNo}`
      }
    },
    doHistoryBack () {
      if (!window.location.hash) {
        let redirectUrl = '/'
        if (this.$route.query.result === 'FAIL') {
          redirectUrl = `/order/${this.orderSheetNo}`
        }
        this.$router.push(redirectUrl)
      }
    },
    openReceipt (url, title) {
      window.open(url, title, 'width=490, height=600')
    }
  },
  computed: {
    result: {
      get () {
        return this.$store.state.route.query.result
      }
    },
    orderSheetNo: {
      get () {
        return this.$store.state.route.query.orderSheetNo
      }
    },
    orderNo: {
      get () {
        return this.$store.state.route.query.orderNo
      }
    },
    message: {
      get () {
        return this.$store.state.route.query.message
      }
    },
    ...mapState('myorder', ['order'])
  },
  beforeMount () {
    if (!window.location.hash) {
      this.$router.push(`${this.$route.fullPath}#complete`)
    }
  },
  mounted () {
    if (this.$store.state.route.query.cartnos && this.$store.state.route.query.cartnos.length > 0) {
      const cartnos = JSON.parse(this.$store.state.route.query.cartnos)
      if (cartnos && cartnos.length > 0 && this.result === 'SUCCESS') {
        this.$store.dispatch('cart/deleteCartByCartNos', cartnos)
      }
    }
    const searchid = this.$store.state.route.query.searchProductID
    const productNo = this.$store.state.route.query.productNo
    const targetURL = `${location.protocol}//${location.host}/product/${productNo}`
    if (searchid && productNo) {
      loadNCPSearchScript().then(() => {
        NCPSearch.sendClickLog(targetURL, searchid, 'buy', cookies.get('adId') ? cookies.get('adId') : '')
      })
    }
    if (this.result !== 'SUCCESS') {
      document.getElementById('headTitle').innerHTML = '결제실패'
    }
    delete window.localStorage.orderinfo
  },
  watch: {
    '$route': 'doHistoryBack'
  }
}
</script>
