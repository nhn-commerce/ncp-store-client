<template>
  <div id="contents" class="etc_wrap">
    <div class="privacy_scroll">
      회사는 상품판매 및 배송, 본인 확인 등 거래 이행을 위하여 필요한 최소한의 개인정보에 대해 이용자가 상품 구매 시 별도로 동의한 경우에만 아래의 개인정보를 제공하고 있습니다. <br><br> 제공받는 업체는 서비스 제휴계약에 따라 변경될 수 있으니 수시로 확인하시기 바랍니다.<br><br>
      <ul class="list">
        <li v-for="partner in mallsPartners" :key="partner.partnerNo">{{partner.companyName}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
    }
  },
  metaInfo: {
    title: '개인정보 제공 판매업체 리스트'
  },
  methods: {
  },
  computed: {
    ...mapState('common', ['mallsPartners'])
  }
}
</script>
