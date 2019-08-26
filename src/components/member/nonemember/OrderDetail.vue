<template>
  <div v-if="order">
    <div class="myorder_top">
      <dl class="date">
        <dt>주문일</dt>
        <dd>{{order.showYmd}}</dd>
      </dl>
      <dl class="number">
        <dt>주문번호</dt>
        <dd>{{order.orderNo}}</dd>
      </dl>
    </div>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">주문자정보</h3>
      </div>
      <div class="os_con myorder_addr">
        <div class="basic_info_table">
          <dl>
            <dt>주문자명</dt>
            <dd>{{order.orderer.ordererName}}</dd>
          </dl>
          <dl>
            <dt>휴대전화</dt>
            <dd>{{order.orderer.contact1}}
              <i class="char">-</i>{{order.orderer.contact2}}
              <i class="char">-</i>{{order.orderer.contact3}}</dd>
          </dl>
          <dl>
            <dt>이메일</dt>
            <dd>{{order.orderer.ordererEmail}}</dd>
          </dl>
        </div>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">주문 상품 정보</h3>
      </div>
      <div class="os_con">
        <ul class="my_odl_box">
          <OrderOption v-for="option in order.showOptions" :key="option.orderOptionNo" :option="option" :noneMember="true"></OrderOption>
        </ul>
      </div>
    </section>
    <section class="order_section">
      <div class="os_top">
        <h3 class="title_style1 title">결제정보</h3>
      </div>
      <div class="os_con">
        <div class="buy_info">
          <div class="buy_i_box">
            <dl>
              <dt>결제수단</dt>
              <dd>{{order.payTypeLabel}}</dd>
            </dl>
            <template v-if="order.payInfo && order.payInfo.cardInfo">
              <dl>
                <dt>카드번호</dt>
                <dd>{{order.payInfo.cardInfo.cardName}} {{order.payInfo.cardInfo.cardCode}}</dd>
              </dl>
              <dl>
                <dt>할부정보</dt>
                <dd>{{order.payInfo.cardInfo.installmentLabel}}</dd>
              </dl>
            </template>
          </div>
          <div class="buy_i_box" v-if="order.showPriceInfo">
            <dl>
              <dt>주문금액</dt>
              <dd>
                총 상품금액
                <span>
                  <strong>{{order.showPriceInfo.showStandardAmt}}</strong> 원
                </span>
              </dd>
              <dd>
                총 할인금액
                <span>-
                  <strong>{{order.showPriceInfo.totalDisAmt}}</strong> 원
                </span>
                <div class="buy_i_price" v-if="order.showPriceInfo.totalDisAmt !== 0">
                  <dl v-if="order.showPriceInfo.immDisAmt !== 0">
                    <dt>즉시 할인</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.immDisAmt}}</strong> 원
                    </dd>
                  </dl>
                  <dl v-if="order.showPriceInfo.addDisAmt !== 0">
                    <dt>추가 할인</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.addDisAmt}}</strong> 원
                    </dd>
                  </dl>
                  <dl v-if="order.showPriceInfo.proCouDisAmt !== 0">
                    <dt>상품 할인쿠폰</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.proCouDisAmt}}</strong> 원
                    </dd>
                  </dl>
                  <dl v-if="order.showPriceInfo.cartCouDisAmt !== 0">
                    <dt>장바구니 할인쿠폰</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.cartCouDisAmt}}</strong> 원
                    </dd>
                  </dl>
                </div>
              </dd>
              <dd>
                총 배송비 (착불배송비 제외)
                <span>+
                  <strong>{{order.showPriceInfo.totalDeliveryAmt}}</strong> 원
                </span>
                <div class="buy_i_price" v-if="order.showPriceInfo.totalDeliveryAmt !== 0">
                  <dl v-if="order.showPriceInfo.deliveryAmt !== 0">
                    <dt>배송비</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.deliveryAmt}}</strong> 원
                    </dd>
                  </dl>
                  <dl v-if="order.showPriceInfo.delCouDisAmt !== 0">
                    <dt>배송비 할인쿠폰</dt>
                    <dd>-
                      <strong>{{order.showPriceInfo.delCouDisAmt}}</strong> 원
                    </dd>
                  </dl>
                  <dl v-if="order.showPriceInfo.remDelAmt !== 0">
                    <dt>지역별 추가배송비</dt>
                    <dd>
                      <strong>{{order.showPriceInfo.remDelAmt}}</strong> 원
                    </dd>
                  </dl>
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <dl class="buy_total" v-if="order.showPriceInfo">
          <dt>결제금액</dt>
          <dd>
            <strong>{{order.showPriceInfo.payAmt}}</strong> 원</dd>
        </dl>
      </div>
    </section>

    <section class="order_section" v-if="order.showPriceInfo && order.showPriceInfo.refundPayAmt">
      <div class="os_top">
        <h3 class="title_style1 title">환불정보</h3>
      </div>
      <div class="os_con">
        <div class="buy_discount">
          <dl>
            <dt>환불 상품금액</dt>
            <dd>
              <strong>{{order.showPriceInfo.claimProductAmt}}</strong> 원</dd>
          </dl>
          <dl>
            <dt>환불 배송비</dt>
            <dd>
              <strong>{{order.showPriceInfo.claimDeliveryAmt}}</strong> 원
            </dd>
          </dl>
          <dl>
            <dt>환불 차감금액</dt>
            <dd>
              <strong>(-) {{order.showPriceInfo.claimSubtractionAmt}}</strong> 원</dd>
          </dl>
        </div>
        <dl class="buy_total">
          <dt>환불금액
            <span>(신용카드)</span>
          </dt>
          <dd>
            <strong>{{order.showPriceInfo.refundPayAmt}}</strong> 원</dd>
        </dl>
      </div>
    </section>
    <OrderAddress :orderAddress="order.orderAddress" v-if="order.orderAddress" :noneMember="true"></OrderAddress>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import OrderOption from '@/components/mypage/order/OrderOption'
import OrderAddress from '@/components/mypage/order/detail/OrderAddress'

export default {
  metaInfo: {
    title: '주문상세정보'
  },
  components: {
    OrderOption,
    OrderAddress
  },
  computed: {
    ...mapState('guestorder', ['order'])
  }
}
</script>
