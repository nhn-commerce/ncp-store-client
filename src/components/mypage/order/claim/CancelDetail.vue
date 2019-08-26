<template>
  <div v-if="claimResult" class="mypage_wrap">
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">취소 상세정보</h3>
      </div>
      <div class="os_con myorder_claim">
        <div class="claim_item">
          <!-- ctl_item_info -->
          <div class="ctl_item_info">
            <div class="ctl_photo">
              <router-link :to="`/product/${claimResult.claimedOption.productNo}`"><img :src="claimResult.claimedOption.imageUrl?claimResult.claimedOption.imageUrl:''" alt=""></router-link>
            </div>
            <div class="ctl_txt_box">
              <p class="ctl_name">
                <strong>{{claimResult.claimedOption.brandName}}</strong>
                <router-link :to="`/product/${claimResult.claimedOption.productNo}`">{{claimResult.claimedOption.productName}}</router-link>
              </p>
              <div class="ctl_option">
                <span v-for="showOption in claimResult.showOptions" :key="showOption.index">{{showOption}}</span>
              </div>
            </div>
          </div>
          <!-- // ctl_item_info -->
          <div class="ctl_item_bottom">
            <strong>{{claimResult.claimedOption.orderStatusType === 'CANCEL_DONE' ? '취소완료' : '취소처리중'}}</strong>
            <span class="quantity">{{claimResult.claimedOption.orderCnt}}개</span>
          </div>
        </div>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">취소 사유</h3>
      </div>
      <div class="os_con">
        <div class="basic_info">
          <dl>
            <dt>취소사유 구분</dt>
            <dd v-for="claimReasonType in claimReasonTypes" :key="claimReasonType.value" v-if="claimReasonType.value===claimResult.claimReasonType">
              {{claimReasonType.label}}
            </dd>
          </dl>
          <dl v-if="claimResult.claimReasonDetail">
            <dt>취소 상세 사유</dt>
            <dd>{{claimResult.claimReasonDetail}}</dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section" v-if="claimResult.claimReasonType !== 'CANCEL_BEFORE_PAY' && claimResult.refundType !== 'CANCEL_DEPOSIT'">
      <div class="os_top" >
        <h3 class="title_style1 title">환불 정보</h3>
      </div>
      <div class="os_con">
        <div class="buy_discount">
          <dl>
            <dt>환불 상품금액</dt>
            <dd>
              <strong>{{miliFormat(claimResult.claimPriceInfo.productAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 배송비</dt>
            <dd>
              <strong>{{miliFormat(claimResult.claimPriceInfo.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 차감금액</dt>
            <dd>
              <strong>(-) {{miliFormat(claimResult.claimPriceInfo.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
        </div>
        <dl class="buy_total" >
          <template v-if="claimResult.claimPriceInfo.refundPayType !== 'ACCOUNT' && claimResult.claimPriceInfo.refundPayType !== 'REALTIME_ACCOUNT_TRANSFER'">
            <dt>환불금액
              <span>(신용카드)</span>
            </dt>
            <dd>
            <strong>{{miliFormat(claimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
          </dd>
          </template>
          <template v-if="claimResult.claimPriceInfo.refundPayType === 'ACCOUNT'">
            <dt>환불금액
              <span>(현금환불)</span>
            </dt>
            <dd>
              <strong>{{miliFormat(claimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
            </dd>
            
          </template>
          <template v-if="claimResult.claimPriceInfo.refundPayType === 'REALTIME_ACCOUNT_TRANSFER'">
            <dt>환불금액
              <span>(계좌이체)</span>
            </dt>
            <dd>
            <strong>{{miliFormat(claimResult.claimPriceInfo.refundPayAmt)}}</strong> 원
          </dd>
          </template>
        </dl>
        <div class="term_discount" v-if="claimResult.claimPriceInfo.refundPayType === 'ACCOUNT'">
          <dl>
            <dt>은행</dt>
            <dd>
              {{claimResult.refundBankAccount.bankName}}
            </dd>
          </dl>
          <dl>
            <dt>계좌번호</dt>
            <dd>
              {{claimResult.refundBankAccount.bankAccount}}
            </dd>
          </dl>
          <dl>
            <dt>예금주</dt>
            <dd>
              {{claimResult.refundBankAccount.bankDepositorName}}
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
      title: '취소 상세정보'
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
      ...mapState('myorder', ['claimResult'])
    }
  }
</script>
