<template>
  <div v-if="multipleGuestClaimResult" class="mypage_wrap">
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">반품 상세정보</h3>
      </div>
      <div class="os_con myorder_claim">
        <template v-if="multipleGuestClaimResult.claimedOptions" v-for="claimedOption in multipleGuestClaimResult.claimedOptions">
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
            <dd v-for="claimReasonType in claimReasonTypes" :key="claimReasonType.value" v-if="claimReasonType.value===multipleGuestClaimResult.claimReasonType">
              {{claimReasonType.label}}
            </dd>
          </dl>
          <dl v-if="multipleGuestClaimResult.claimReasonDetail">
            <dt>반품 상세 사유</dt>
            <dd>{{multipleGuestClaimResult.claimReasonDetail}}</dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section" v-if="multipleGuestClaimResult.showReturnAddress">
      <div class="os_top">
        <h3 class="title_style1 title">반품 수거정보</h3>
      </div>
      <div class="os_con refund_addr">
        <div class="basic_info_table">
          <dl>
            <dt>받는사람</dt>
            <dd>{{multipleGuestClaimResult.showReturnAddress.name}}</dd>
          </dl>
          <dl>
            <dt>수거지 주소</dt>
            <dd>{{multipleGuestClaimResult.showReturnAddress.address}}</dd>
            <dd>
              {{multipleGuestClaimResult.showReturnAddress.addressStr}}
            </dd>
          </dl>
          <dl>
            <dt>휴대전화</dt>
            <dd>{{multipleGuestClaimResult.showReturnAddress.contact1_1}}
              <i class="char">-</i>{{multipleGuestClaimResult.showReturnAddress.contact1_2}}
              <i class="char">-</i>{{multipleGuestClaimResult.showReturnAddress.contact1_3}}</dd>
          </dl>
          <dl>
            <dt>연락처</dt>
            <dd>{{multipleGuestClaimResult.showReturnAddress.contact2_1}}
              <i class="char">-</i>{{multipleGuestClaimResult.showReturnAddress.contact2_2}}
              <i class="char">-</i>{{multipleGuestClaimResult.showReturnAddress.contact2_3}}</dd>
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
              <strong>{{miliFormat(multipleGuestClaimResult.claimPriceInfo.productAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 배송비</dt>
            <dd>
              <strong>{{miliFormat(multipleGuestClaimResult.claimPriceInfo.deliveryAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 차감금액</dt>
            <dd>
              <strong>(-) {{miliFormat(multipleGuestClaimResult.claimPriceInfo.subtractionAmtInfo.totalAmt)}}</strong> 원</dd>
          </dl>
        </div>
        <dl class="buy_total">
          <dt>환불금액
            <span>(신용카드)</span>
          </dt>
          <dd>
            <strong>{{miliFormat(multipleGuestClaimResult.claimPriceInfo.refundPayAmt)}}</strong> 원</dd>
        </dl>
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
      ...mapState('guestorder', ['multipleGuestClaimResult'])
    }
  }
</script>
