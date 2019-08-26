<template>
  <div class="my_review">
    <div class="myorder_menu">
      <router-link to="/mypage/myreviewable">상품평 쓰기</router-link>
      <router-link to="/mypage/myreviews" class="is_curr">내가 쓴 상품평</router-link>
    </div>
    <div v-if="profileProductReviews" class="my_review">
      <template v-if="profileProductReviews.length > 0">
        <ul class="my_rw_list">
          <reviewItem v-for="productReviewsitem in profileProductReviews" :key="productReviewsitem.reviewNo" :productReviewsitem="productReviewsitem"></reviewItem>
          <mugen-scroll :handler="pageDownReviews" :should-handle="reviewsLoading">
            <div id="loader" v-show="reviewsLoading">
              <div class="loader_img"></div>
              <p class="loader_txt">불러오는 중입니다...</p>
            </div>
          </mugen-scroll>
        </ul>
      </template>
      <div v-if="profileProductReviews && profileProductReviews.length === 0" class="no_contents">
        <p>작성하신 상품평이 없습니다.</p>
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
import reviewItem from '@/components/mypage/review/ReviewItem'
import { mapState } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
export default {
  data () {
    return {
      reviewflg: true
    }
  },
  metaInfo: {
    title: '내가쓴상품평'
  },
  methods: {
    pageDownReviews () {
      this.$store.dispatch('profilereview/fetchReviewsMore')
    },
    pageDownReviewable () {
      this.$store.dispatch('profilereview/fetchReviewableMore')
    }
  },
  computed: {
    ...mapState('profilereview', ['profileProductReviews', 'reviewsLoading'])
  },
  components: {
    reviewItem,
    MugenScroll
  }
}
</script>

<style>
.my_rw_list #loader {
  position: static;
  transform: none;
}
</style>


