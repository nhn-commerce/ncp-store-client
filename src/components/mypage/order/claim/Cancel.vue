<template>
  <div id="contents" class="mypage_wrap" v-if="claimOrderOption">
    <form action="">
      <fieldset>
        <legend class="acc-hidden">취소 신청 폼</legend>
        <section class="order_section">
          <div class="os_top">
            <h3 class="title_style1 title">취소신청 상품정보</h3>
          </div>
          <div class="os_con myorder_claim">
            <div class="claim_item">
              <!-- ctl_item_info -->
              <div class="ctl_item_info">
                <div class="ctl_photo">
                  <router-link :to="`/product/${claimOrderOption.originalOption.productNo}`"><img :src="claimOrderOption.originalOption.imageUrl?claimOrderOption.originalOption.imageUrl:''" alt=""></router-link>
                </div>
                <div class="ctl_txt_box">
                  <p class="ctl_name">
                    <strong>{{claimOrderOption.originalOption.brandName}}</strong>
                    <router-link :to="`/product/${claimOrderOption.originalOption.productNo}`">{{claimOrderOption.originalOption.productName}}</router-link>
                  </p>
                  <div class="ctl_option">
                    <span v-for="showOption in claimOrderOption.originalOption.showOptions" :key="showOption.index">{{showOption}}</span>
                  </div>
                  <div class="ctl_price">
                    <div class="ctl_p_top">
                      <p class="total">
                        <strong>{{miliFormat(claimOrderOption.originalOption.price.buyAmt)}}</strong>원</p>
                    </div>
                  </div>
                </div>
              </div>
              <!-- // ctl_item_info -->
            </div>
            <div class="order_info">
              <dl class="oi_w">
                <dt>
                  <label for="">취소신청 수량</label>
                </dt>
                <dd>
                  <select v-model="maxProductCnt" @change.prevent="updateProductCnt">
                    <option v-for="selectProductCnt in claimOrderOption.originalOption.orderCnt" :value="selectProductCnt" :key="selectProductCnt">
                      {{selectProductCnt}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="oi_w">
                <dt>
                  <label for="">취소사유 구분</label>
                </dt>
                <dd>
                  <select v-model="claimReasonType" ref="claimReasonTypeFocus" @change.prevent="claimReasonTypeSelect">
                    <option value="">선택하세요</option>
                    <option v-for="selectClaimReasonType in claimOrderOption.claimReasonTypes" :value="selectClaimReasonType.claimReasonType" :key="selectClaimReasonType.claimReasonType">
                      {{selectClaimReasonType.label}}
                    </option>
                  </select>
                </dd>
              </dl>
              <dl class="oi_w">
                <dt>
                  <label for="">취소 상세 사유</label>
                </dt>
                <dd>
                  <textarea name="" id="" v-model="claimReasonDetail" cols="30" rows="10" placeholder="상세한 사유를 입력 해 주세요."></textarea>
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <!-- // 상품정보 || 취소 신청 -->
        <section class="order_section" v-if="claimEstimate && claimOrderOption.originalOption.orderStatusType !== 'DEPOSIT_WAIT'">
          <div class="os_top">
            <h3 class="title_style1 title">환불예정 정보</h3>
          </div>
          <div class="os_con">
            <div class="buy_discount">
              <dl>
                <dt>환불 상품금액</dt>
                <dd>
                  <strong>{{miliFormat(claimEstimate.productAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 배송비</dt>
                <dd>
                  <strong>{{miliFormat(claimEstimate.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 차감금액</dt>
                <dd>
                  <strong>(-) {{miliFormat(claimEstimate.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
            </div>
            <dl class="buy_total">
              <template v-if="claimOrderOption.payType !== 'VIRTUAL_ACCOUNT' && claimOrderOption.payType !== 'REALTIME_ACCOUNT_TRANSFER'">
                <dt>환불금액
                  <span>(신용카드)</span>
                </dt>
              </template>
              <template v-if="claimOrderOption.payType === 'VIRTUAL_ACCOUNT'">
                <dt>환불금액
                  <span>(현금환불)</span>
                </dt>
              </template>
              <template v-if="claimOrderOption.payType === 'REALTIME_ACCOUNT_TRANSFER'">
                <dt>환불금액
                  <span>(계좌이체)</span>
                </dt>
              </template>
              <dd>
                <strong>{{miliFormat(claimEstimate.refundPayAmt)}}</strong> 원
              </dd>
            </dl>
            <div class="term_discount" v-if="claimOrderOption.payType === 'VIRTUAL_ACCOUNT'">
              <dl>
                <dt>은행</dt>
                <dd>
                  <select v-model="refundBankCode" id="refundBankCode" ref="refundBankFocus">
                    <option value="">선택하세요</option>
                    <option v-for="bank in claimOrderOption.availableBanks" :value="bank.bank">{{bank.label}}</option>
                  </select>
                </dd>
              </dl>
              <dl>
                <dt>계좌번호</dt>
                <dd>
                  <input type="text" v-model="refundAccount" @input="handleInput" ref="refundAccountFocus">
                </dd>
              </dl>
              <dl>
                <dt>예금주</dt>
                <dd>
                  <input type="text" v-model="refundName" ref="refundNameFocus">
                </dd>
              </dl>
            </div>
          </div>
        </section>
        <!-- // 환불예정 정보 -->
        <div class="claim_btn">
          <a @click.prevent="cancelOrderOption" class="btn_style1">취소신청완료</a>
        </div>
        <dl class="claim_notice">
          <dt>유의사항</dt>
          <dd>
            상품이 발송되기 전 단계인 경우 취소신청을 할 수 있습니다. <br> 다만, 취소신청을 하였더라도 판매자가 이미 상품을 발송한 경우에는 취소가 거부될 수 있습니다.
          </dd>
          <dd>
            쿠폰을 사용한 경우 취소한 금액에 따라쿠폰적용이 취소될 수 있습니다. 이때, 쿠폰은 유효기간 내에서 복원됩니다.
          </dd>
          <dd>
            결제완료 상태에서 취소신청 하는 경우 즉시 환불되며, <br> 상품/배송준비중 상태에서 취소신청 하는 경우 판매자의 승인 후 환불됩니다. 단, 카드사의 상황에 따라 환불기간이 다소 길어질 수 있습니다
          </dd>
        </dl>
      </fieldset>
    </form>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import Addresses from '@/components/common/Addresses'
import config from '@/config'

export default {
  data () {
    return {
      running: false,
      claimReasonType: '',
      claimReasonDetail: '',
      refundBankCode: '',
      refundAccount: undefined,
      refundName: '',
      productCnt: 0
    }
  },
  metaInfo: {
    title: '취소신청'
  },
  methods: {
    miliFormat (num) {
      return formatCurrency(num)
    },
    handleInput (e) {
      this.refundAccount = e.target.value.replace(/[^\w]/g, '')
    },
    updateProductCnt () {
      if (this.claimReasonType !== '') {
        const claimParams = {
          orderOptionNo: this.$store.state.route.params.orderOptionNo,
          claimType: 'CANCEL',
          productCnt: this.productCnt,
          claimReasonType: this.claimReasonType
        }

        this.$store.dispatch('myorder/getCancelEstimate', claimParams)
      }
    },
    claimReasonTypeSelect () {
      const claimParams = {
        orderOptionNo: this.$store.state.route.params.orderOptionNo,
        claimType: 'CANCEL',
        productCnt: this.productCnt === 0 ? this.maxProductCnt : this.productCnt,
        claimReasonType: this.claimReasonType
      }
      this.$store.dispatch('myorder/getCancelEstimate', claimParams)
    },
    cancelOrderOption () {
      const cancelparam = {
        claimType: 'CANCEL',
        productCnt: this.productCnt === 0 ? this.maxProductCnt : this.productCnt,
        claimReasonType: this.claimReasonType,
        claimReasonDetail: this.claimReasonDetail,
        saveBankAccountInfo: 'false',
        returnWayType: 'SELLER_COLLECT'
      }
      if (cancelparam.claimReasonType === '') {
        alert('취소사유 구분을 선택 해 주세요.')
        this.$refs.claimReasonTypeFocus.focus()
        return
      }
      if (this.claimOrderOption.payType === 'VIRTUAL_ACCOUNT' && this.claimOrderOption.originalOption.orderStatusType !== 'DEPOSIT_WAIT') {
        cancelparam.bankAccountInfo = {
          bankAccount: this.refundAccount.toString(),
          bank: this.refundBankCode,
          bankDepositorName: this.refundName,
          bankName: $('#refundBankCode option:checked').text()
        }
        if (cancelparam.bankAccountInfo.bank === '') {
          alert('환불은행을 선택 해 주세요.')
          this.$refs.refundBankFocus.focus()
          return
        }
        if (cancelparam.bankAccountInfo.bankAccount === '') {
          alert('계좌번호를 입력 해 주세요.')
          this.$refs.refundAccountFocus.focus()
          return
        }
        if (cancelparam.bankAccountInfo.bankDepositorName === '') {
          alert('예금주명을 입력 해 주세요.')
          this.$refs.refundNameFocus.focus()
          return
        }
      }
      if (this.claimOrderOption.originalOption.orderStatusType === 'DEPOSIT_WAIT') {
        cancelparam.bankAccountInfo = {
          bankAccount: '',
          bankCode: '',
          bankDepositorName: '',
          bankName: ''
        }
        cancelparam.orderNo = this.claimOrderOption.originalOption.orderNo
      } else {
        cancelparam.orderOptionNo = this.$store.state.route.params.orderOptionNo
      }

      if (this.running) {
        return
      } else {
        this.running = true
      }
      if (this.claimOrderOption.originalOption.orderStatusType === 'PRODUCT_PREPARE' || this.claimOrderOption.originalOption.orderStatusType === 'DELIVERY_PREPARE') {
        alert('택배 포장중인 상품입니다.\n이미 출고된 상품인 경우 취소가 철회되고 문자를 발송해 드립니다.\n상품 수령후 반품신청 부탁드립니다.')
      }
      let dispathch = ''
      if (this.claimOrderOption.originalOption.orderStatusType === 'DEPOSIT_WAIT') {
        dispathch = 'myorder/postOrderClaimCancel'
      } else {
        dispathch = 'myorder/postOrderOptionClaimCancel'
      }
      this.$store.dispatch(dispathch, cancelparam).then(() => {
        alert('취소신청이 완료되었습니다. 환불관련 정보는 마이페이지의 취소반품 내역에서 확인 가능합니다.')
        this.running = false
        let fromUrl = this.$store.state.route.query.fromUrl
        if (fromUrl.indexOf('myclaim=done') === -1) {
          if (fromUrl.indexOf('?') === -1) {
            fromUrl += '?myclaim=done'
          } else {
            fromUrl += '&myclaim=done'
          }
        }
        window.location.href = fromUrl
      }).catch((e) => {
        if (e.data.code === 'CL904') {
          alert(`판매자 귀책사유로 인해 초도배송비가 발생합니다. 고객센터(${config.telNum})를 통해 취소신청 해 주세요.`)
        }
        this.running = false
      })
    }
  },
  components: {
    Addresses
  },
  computed: {
    maxProductCnt: {
      get () {
        // return (this.claimOrderOption && this.claimOrderOption.originalOption.orderCnt) || this.maxProductCnt
        if (this.claimOrderOption && this.productCnt === 0) {
          return this.claimOrderOption.originalOption.orderCnt
        } else {
          return this.productCnt
        }
      },
      set (val) {
        this.productCnt = val
      }
    },
    ...mapState('myorder', ['claimOrderOption', 'claimEstimate'])
  }
}
</script>
