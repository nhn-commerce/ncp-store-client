<template>
  <div>
    <div class="pdt_review" v-if="productReviews && productReviews.length > 0">
      <div class="pdt_review_top" v-if="averageRate !== 0">
        <productReviewStar :averageRate="averageRate"></productReviewStar>
      </div>
      <ul class="review_list">
        <productReview v-for="productReviewsitem in productReviews" :key="productReviewsitem.inquiryNo" :productReviewsitem="productReviewsitem" @showPop="reportPop"></productReview>
      </ul>
      <mugen-scroll :handler="fetchMore" :should-handle="loading">
        <div id="loader" v-show="loading">
          <div class="loader_img"></div>
          <p class="loader_txt">불러오는 중입니다...</p>
        </div>
      </mugen-scroll>
    </div>
    <div v-if="productReviews && productReviews.length === 0" class="no_review">
      <p>작성 된 상품평이 없습니다.</p>
      <div class="btn" v-if="isLogin()">
        <a @click.prevent="toReviewable" class="btn_style1 btn_write">상품평 작성하기</a>
      </div>
    </div>
    <div class="reviewLoader">
      <div id="loader" v-show="!productReviews">
        <div class="loader_img"></div>
        <p class="loader_txt">불러오는 중입니다...</p>
      </div>
    </div>
    <reviewReportPop v-show="reviewReportPopflg" @closePop="closeReportPop" :reviewNo="reviewNo" :productReviewReportTypes="productReviewReportTypes"></reviewReportPop>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
import productReview from '@/components/productDetail/review/ProductReviewItem'
import reviewReportPop from '@/components/productDetail/review/ReviewReportPop'
import productReviewStar from '@/components/productDetail/review/ProductReviewStar'
export default {
  metaInfo: {
    title: '상품상세',
    bodyAttrs: {
      class: 'floating_bottom'
    }
  },
  data () {
    return {
      reviewReportPopflg: false,
      reviewNo: ''
    }
  },
  methods: {
    reportPop (reviewNo) {
      this.reviewReportPopflg = true
      this.reviewNo = reviewNo
    },
    closeReportPop () {
      this.reviewReportPopflg = false
    },
    toReviewable () {
      window.location.href = '/mypage/myreviewable'
    },
    isLogin () {
      return this.$store.getters.isLogined
    },
    ...mapActions('productreview', ['fetchMore'])
  },
  components: {
    productReview,
    reviewReportPop,
    productReviewStar,
    MugenScroll
  },
  computed: {
    ...mapState('productreview', ['productReviews', 'loading', 'averageRate']),
    ...mapGetters('common', ['productReviewReportTypes'])
  }
}
</script>

<style>
.pdt_review #loader {
  position: static;
  transform: none;
}
.reviewLoader #loader {
  position: static;
  transform: none;
  margin-top: 30%;
  margin-bottom: 50%;
}
</style>
