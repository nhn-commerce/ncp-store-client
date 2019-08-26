<template>
  <div class="tab_con" style="" v-if="product">
    <div class="pdt_refund">
      <dl class="pdt_r_info">
        <dt>판매자 정보</dt>
        <dd>
          <table class="pd_table">
            <caption class="acc-hidden">상품정보제공고시 테이블</caption>
            <tbody>
              <tr>
                <th>판매자명</th>
                <td>{{product.partner.partnerName}}</td>
              </tr>
              <tr>
                <th>상호명</th>
                <td>{{product.partner.companyName}}</td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td>{{product.partner.ownerName}}</td>
              </tr>
              <tr>
                <th>대표 번호</th>
                <td>{{product.partner.phoneNo}}</td>
              </tr>
              <tr>
                <th>FAX 번호</th>
                <td>{{product.partner.faxNo}}</td>
              </tr>
              <tr>
                <th>대표 이메일</th>
                <td>{{product.partner.email}}</td>
              </tr>
              <tr>
                <th>사업자 번호</th>
                <td>{{product.partner.businessRegistrationNo}}</td>
              </tr>
              <tr>
                <th>통신판매신고 번호</th>
                <td>{{product.partner.onlineMarketingBusinessDeclarationNo}}</td>
              </tr>
              <tr>
                <th>사업자 주소</th>
                <td v-html="product.partner.officeAddressLabel">
                </td>
              </tr>
            </tbody>
          </table>
        </dd>
      </dl>
      <dl class="pdt_r_info">
        <dt>반품 / 교환 정보</dt>
        <dd v-if="product && product.deliveryFee">
          <table class="pd_table">
            <caption class="acc-hidden">상품정보제공고시 테이블</caption>
            <tbody>
              <tr>
                <th>택배사</th>
                <td>{{product.deliveryFee.deliveryType === 'DIRECT_DELIVERY' ? '직접배송' : product.deliveryFee.deliveryCompanyTypeLabel}}</td>
              </tr>
              <tr>
                <th>반품 배송비</th>
                <td>
                  편도{{miliFormat(product.deliveryFee.returnDeliveryAmt)}} 원<br>
                  <template v-if="product.deliveryFee.deliveryConditionType === 'FREE'">
                    (최초 배송비 무료인 경우 {{ miliFormat(product.deliveryFee.returnDeliveryAmt*2) }}원 부과)
                  </template>
                </td>
              </tr>
              <tr>
                <th>교환 배송비</th>
                <td>{{miliFormat(product.deliveryFee.returnDeliveryAmt*2)}}원</td>
              </tr>
              <tr>
                <th>반품/교환 주소지</th>
                <td>
                  ({{product.deliveryFee.returnWarehouse.zipCd}})<br> {{product.deliveryFee.returnWarehouse.address}}
                  <br>{{product.deliveryFee.returnWarehouse.detailAddress}}
                </td>
              </tr>
            </tbody>
          </table>
        </dd>
        <dd class="notice">
          <strong>상품 수령 후 7일 이내 반품/교환을 신청하실 수 있습니다. <br>단, 다음의 각 내용에 해당하는 반품/교환은 신청이 불가능할 수 <br>있습니다.</strong>
          <ol class="pdt_r_txt numbering">
            <li>
              <i>1.</i>소비자의 책임있는 사유로 상품 등이 멸실/훼손된 경우 (단지 상품 확인을 위한 포장 훼손 제외)</li>
            <li>
              <i>2.</i>소비자의 사용/소비에 의해 상품 등의 가치가 현저히 감소한 경우</li>
            <li>
              <i>3.</i>시간의 경과에 의해 재판매가 곤란할 정도로 상품 등의 가치가 현저히 감소한 경우</li>
            <li>
              <i>4.</i>복제가 가능한 상품 등의 포장을 훼손한 경우</li>
            <li>
              <i>5.</i>소비자의 주문에 따라 개별 생산되는 상품이 제작이 들어간 경우 사용 중 발생한 하자의 환불/수리/교환 등을 ‘공정거래위원회 소비자 분쟁 해결기준’에 준하여 처리됩니다. 그 절차와 내용은 제조사/판매자의 책임으로 진행되오니, 제조사의 A/S센터 또는 판매자에게 문의하시기 바랍니다.</li>
          </ol>
          <em class="warn">통신판매중개자인 {{mallName}}은 반품/교환에 따른 판매자의 책임을 부담하지 않습니다.</em>
        </dd>
      </dl>
      <dl class="pdt_r_caution">
        <dt>주의 사항</dt>
        <dd>
          <ul class="pdt_r_txt">
            <li>
              <i>-</i>미성년자가 물품을 구매하는 경우, 법정대리인이 동의하지않으면 미성년자 본인 또는 법정대리인이 구매를 취소할 수 있습니다.</li>
            <li>
              <i>-</i>안전검사 대상 공산품이나 어린이 보호포장대상 공산품을 구매하는 경우 품질경영 및 공산품 안전관리법에 따른 안전검사 표시가 있는 제품이거나 어린이 보호포장 적용제품인지를 확인하시기 바랍니다.</li>
            <li>
              <i>-</i>정보, 전기통신기기를 구매하는 경우 관련법률에 따라 인증 또는 승인을 받은 상품인지 확인하시기 바랍니다.</li>
            <li>
              <i>-</i>예약 및 입장권 티켓 등의 여행상품을 구매할 경우, 배송이 되지 않고 현장 이용하는 상품이 많으니, 구매전 이용방법 및 판매자 약관을 꼭 확인하시기 바랍니다.</li>
            <li>
              <i>-</i>{{mallName}}의 결제시스템을 이용하지 않고 판매자와 직거래 하실 경우 상품을 받지 못하거나 구매한 상품과 상이한 상품을 받는 등 피해가 발생할 수 있으니 유의하시기 바랍니다.</li>
            <li>
              <i>-</i>{{mallName}}에 등록된 판매물품과 내용은 개별판매자가 등록한 것으로 NHN엔터테인먼트㈜가 운영하는 {{mallName}}은 중개시스템만 제공하며 등록된 내용에 대하여 일체의 책임을 지지않습니다.</li>
          </ul>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import config from '@/config'

export default {
  data () {
    return {
      mallName: config.mallName
    }
  },
  metaInfo: {
    title: '상품상세',
    bodyAttrs: {
      class: 'floating_bottom'
    }
  },
  methods: {
    miliFormat (num) {
      return formatCurrency(num)
    }
  },
  computed: {
    ...mapState('product', ['product'])
  }
}
</script>

<style>

</style>
