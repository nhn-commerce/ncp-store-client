<template>
  <div v-if="multipleClaimResult" class="mypage_wrap">
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">반품 상세정보</h3>
      </div>
      <div class="os_con myorder_claim">
        <template v-if="multipleClaimResult.claimedOptions" v-for="claimedOption in multipleClaimResult.claimedOptions">
          <div class="claim_item">
            <!-- ctl_item_info -->
            <div class="ctl_item_info">
              <div class="ctl_photo">
                <router-link :to="`/product/${claimedOption.productNo}`"><img :src="claimedOption.imageUrl?claimedOption.imageUrl:''" alt=""></router-link>
              </div>
              <div class="ctl_txt_box">
                <p class="ctl_name">
                  <strong>{{claimedOption.brandName}}</strong>
                  <router-link :to="`/product/${claimedOption.productNo}`">{{claimedOption.productName}}</router-link>
                </p>
                <div class="ctl_option">
                  <span v-for="showOption in claimedOption.showOptions" :key="showOption.index">{{showOption}}</span>
                </div>
              </div>
            </div>
            <!-- // ctl_item_info -->
            <div class="ctl_item_bottom">
              <strong>{{claimedOption.claimStatusType === 'RETURN_DONE' ? '반품완료' : '반품처리중'}}</strong>
              <span class="quantity">{{claimedOption.orderCnt}}개</span>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">반품 사유</h3>
      </div>
      <div class="os_con">
        <div class="basic_info">
          <dl>
            <dt>반품사유 구분</dt>
            <dd v-for="claimReasonType in claimReasonTypes" :key="claimReasonType.value" v-if="claimReasonType.value===multipleClaimResult.claimReasonType">
              {{claimReasonType.label}}
            </dd>
          </dl>
          <dl v-if="multipleClaimResult.claimReasonDetail">
            <dt>반품 상세 사유</dt>
            <dd>{{multipleClaimResult.claimReasonDetail}}</dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section" v-if="multipleClaimResult.showReturnAddress">
      <div class="os_top">
        <h3 class="title_style1 title">반품 수거정보</h3>
      </div>
      <div class="os_con refund_addr">
        <div class="basic_info_table">
          <dl>
            <dt>받는사람</dt>
            <dd>{{multipleClaimResult.showReturnAddress.name}}</dd>
          </dl>
          <dl>
            <dt>수거지 주소</dt>
            <dd>{{multipleClaimResult.showReturnAddress.address}}</dd>
            <dd>
              {{multipleClaimResult.showReturnAddress.addressStr}}
            </dd>
          </dl>
          <dl>
            <dt>휴대전화</dt>
            <dd>{{multipleClaimResult.showReturnAddress.contact1_1}}
              <i class="char">-</i>{{multipleClaimResult.showReturnAddress.contact1_2}}
              <i class="char">-</i>{{multipleClaimResult.showReturnAddress.contact1_3}}</dd>
          </dl>
          <dl>
            <dt>연락처</dt>
            <dd>{{multipleClaimResult.showReturnAddress.contact2_1}}
              <i class="char">-</i>{{multipleClaimResult.showReturnAddress.contact2_2}}
              <i class="char">-</i>{{multipleClaimResult.showReturnAddress.contact2_3}}</dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">환불 정보</h3>
      </div>
      <div class="os_con">
        <div class="buy_discount">
          <dl>
            <dt>환불 상품금액</dt>
            <dd>
              <strong>{{miliFormat(multipleClaimResult.claimPriceInfo.productAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 배송비</dt>
            <dd>
              <strong>{{miliFormat(multipleClaimResult.claimPriceInfo.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 차감금액</dt>
            <dd>
              <strong>(-) {{miliFormat(multipleClaimResult.claimPriceInfo.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
        </div>
        <dl class="buy_total">
          <template v-if="multipleClaimResult.claimPriceInfo.refundPayType !== 'ACCOUNT' && multipleClaimResult.claimPriceInfo.refundPayType !== 'REALTIME_ACCOUNT_TRANSFER'">
            <dt>환불금액
              <span>(신용카드)</span>
            </dt>
            <dd>
            <strong>{{miliFormat(multipleClaimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
          </dd>
          </template>
          <template v-if="multipleClaimResult.claimPriceInfo.refundPayType === 'ACCOUNT'">
            <dt>환불금액
              <span>(현금환불)</span>
            </dt>
            <dd>
              <strong>{{miliFormat(multipleClaimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
            </dd>
            
          </template>
          <template v-if="multipleClaimResult.claimPriceInfo.refundPayType === 'REALTIME_ACCOUNT_TRANSFER'">
            <dt>환불금액
              <span>(계좌이체)</span>
            </dt>
            <dd>
            <strong>{{miliFormat(multipleClaimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
          </dd>
          </template>
        </dl>
        <div class="term_discount" v-if="multipleClaimResult.claimPriceInfo.refundPayType === 'ACCOUNT'">
          <dl>
            <dt>은행</dt>
            <dd>
              {{multipleClaimResult.refundBankAccount.bankName}}
            </dd>
          </dl>
          <dl>
            <dt>계좌번호</dt>
            <dd>
              {{multipleClaimResult.refundBankAccount.bankAccount}}
            </dd>
          </dl>
          <dl>
            <dt>예금주</dt>
            <dd>
              {{multipleClaimResult.refundBankAccount.bankDepositorName}}
            </dd>
          </dl>
        </div>
      </div>
    </section>

    <div class="claim_btn">
      <a @click.prevent="beforeEnterPage" class="btn_style5">이전 페이지</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { formatCurrency } from '@/utils/StringUtils'

  export default {
    data () {
      return {
      }
    },
    metaInfo: {
      title: '반품 상세정보'
    },
    methods: {
      miliFormat (num) {
        return formatCurrency(num)
      },
      beforeEnterPage () {
        const fromUrl = this.$store.state.route.query.fromUrl
        window.location.href = fromUrl
      }
    },
    components: {
    },
    computed: {
      ...mapGetters('common', ['claimReasonTypes']),
      ...mapState('myorder', ['multipleClaimResult'])
    }
  }
</script>
