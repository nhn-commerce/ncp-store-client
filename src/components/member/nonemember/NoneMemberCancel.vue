<template>
  <div id="contents" class="mypage_wrap" v-if="guestClaim">
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
                  <router-link :to="`/product/${guestClaim.originalOption.productNo}`"><img :src="guestClaim.originalOption.imageUrl?guestClaim.originalOption.imageUrl:''" alt=""></router-link>
                </div>
                <div class="ctl_txt_box">
                  <p class="ctl_name">
                    <strong>{{guestClaim.originalOption.brandName}}</strong>
                    <router-link :to="`/product/${guestClaim.originalOption.productNo}`">{{guestClaim.originalOption.productName}}</router-link>
                  </p>
                  <div class="ctl_option">
                    <span v-for="showOption in guestClaim.showOptions" :key="showOption.index">{{showOption}}</span>
                  </div>
                  <div class="ctl_price">
                    <div class="ctl_p_top">
                      <p class="total">
                        <strong>{{miliFormat(guestClaim.originalOption.price.buyAmt)}}</strong>원</p>
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
                    <option v-for="selectProductCnt in guestClaim.originalOption.orderCnt" :value="selectProductCnt" :key="selectProductCnt">
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
                    <option v-for="selectClaimReasonType in guestClaim.claimReasonTypes" :value="selectClaimReasonType.claimReasonType" :key="selectClaimReasonType.claimReasonType">
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
        <section class="order_section" v-if="guestClaimEstimate">
          <div class="os_top">
            <h3 class="title_style1 title">환불예정 정보</h3>
          </div>
          <div class="os_con">
            <div class="buy_discount">
              <dl>
                <dt>환불 상품금액</dt>
                <dd>
                  <strong>{{miliFormat(guestClaimEstimate.productAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 배송비</dt>
                <dd>
                  <strong>{{miliFormat(guestClaimEstimate.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
              <dl>
                <dt>환불 차감금액</dt>
                <dd>
                  <strong>(-) {{miliFormat(guestClaimEstimate.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
              </dl>
            </div>
            <dl class="buy_total">
              <dt>환불금액
                <span>(신용카드)</span>
              </dt>
              <dd>
                <strong>{{miliFormat(guestClaimEstimate.refundPayAmt)}}</strong> 원</dd>
            </dl>
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
import { mapState, mapGetters } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'

export default {
  data () {
    return {
      running: false,
      claimReasonType: '',
      claimReasonDetail: '',
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
    updateProductCnt () {
      const claimParams = {
        orderOptionNo: this.$store.state.route.params.orderOptionNo,
        claimType: 'CANCEL',
        productCnt: this.productCnt,
        claimReasonType: this.claimReasonType
      }

      this.$store.dispatch('guestorder/getGuestCancelEstimate', claimParams)
    },
    claimReasonTypeSelect () {
      const claimParams = {
        orderOptionNo: this.$store.state.route.params.orderOptionNo,
        claimType: 'CANCEL',
        productCnt: this.productCnt === 0 ? this.maxProductCnt : this.productCnt,
        claimReasonType: this.claimReasonType
      }
      this.$store.dispatch('guestorder/getGuestCancelEstimate', claimParams)
    },
    cancelOrderOption () {
      const cancelparam = {
        orderOptionNo: this.$store.state.route.params.orderOptionNo,
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
      if (this.running) {
        return
      } else {
        this.running = true
      }
      if (this.guestClaim.originalOption.orderStatusType === 'PRODUCT_PREPARE' || this.guestClaim.originalOption.orderStatusType === 'DELIVERY_PREPARE') {
        alert('택배 포장중인 상품입니다.\n이미 출고된 상품인 경우 취소가 철회되고 문자를 발송해 드립니다.\n상품 수령후 반품신청 부탁드립니다.')
      }
      this.$store.dispatch('guestorder/postOrderOptionClaimCancel', cancelparam).then(() => {
        alert('취소신청이 완료되었습니다.')
        const fromUrl = this.$store.state.route.query.fromUrl
        window.location.href = fromUrl
        this.running = false
      }).catch((e) => {
        if (e.data.code === 'CL904') {
          alert(`판매자 귀책사유로 인해 초도배송비가 발생합니다. 고객센터(${this.servicePhoneNo})를 통해 취소신청 해 주세요.`)
        }
        this.running = false
      })
    }
  },
  components: {
  },
  computed: {
    maxProductCnt: {
      get () {
        if (this.guestClaim && this.productCnt === 0) {
          return this.guestClaim.originalOption.orderCnt
        } else {
          return this.productCnt
        }
      },
      set (val) {
        this.productCnt = val
      }
    },
    ...mapState('guestorder', ['guestClaim', 'guestClaimEstimate']),
    ...mapGetters('common', ['servicePhoneNo'])
  }
}
</script>
