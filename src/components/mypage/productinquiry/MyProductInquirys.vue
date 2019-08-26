<template>
  <div class="mypage_wrap">
    <div v-if="productInquiries" class="my_qna">
      <template v-if="productInquiries.length > 0">
        <ul class="qna_list">
          <myInquiryItem v-for="myInquiryItem in productInquiries" :key="myInquiryItem.inquiryNo" :myInquiryItem="myInquiryItem" :inquiryTypes="productInquiryTypes">
          </myInquiryItem>
        </ul>
        <mugen-scroll :handler="pageDown" :should-handle="loading">
          <div id="loader" v-show="loading">
            <div class="loader_img"></div>
            <p class="loader_txt">불러오는 중입니다...</p>
          </div>
        </mugen-scroll>
      </template>
      <div v-if="productInquiries && productInquiries.length === 0" class="no_contents">
        <p>작성하신 상품문의가 없습니다.</p>
      </div>
    </div>
    <template v-else>
      <div id="loader">
        <div class="loader_img"></div>
        <p class="loader_txt">불러오는 중입니다...</p>
      </div>
    </template>

  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
import myInquiryItem from '@/components/mypage/productinquiry/MyProductInquiryItem'
export default {
  data () {
    return {
    }
  },
  metaInfo: {
    title: '상품문의내역'
  },
  methods: {
    pageDown () {
      this.$store.dispatch('productinquiry/fetchProductInquiriesMore')
    }
  },
  computed: {
    ...mapState('productinquiry', ['loading', 'productInquiries']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  components: {
    myInquiryItem,
    MugenScroll
  }
}
</script>

<style>
.my_qna #loader {
  position: static;
  transform: none;
}
</style>