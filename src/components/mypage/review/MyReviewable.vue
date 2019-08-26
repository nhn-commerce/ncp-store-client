<template>
  <div class="my_review">
    <div class="myorder_menu">
      <router-link to="/mypage/myreviewable" class="is_curr">상품평 쓰기</router-link>
      <router-link to="/mypage/myreviews">내가 쓴 상품평</router-link>
    </div>
    <div v-if="productReviewable" class="my_review">
      <template v-if="productReviewable.length > 0">
        <ul class="review_w_list">
          <reviewableItem v-for="productReviewableitem in productReviewable" :key="productReviewableitem.orderOptionNo" :productReviewableitem="productReviewableitem" :orderStatusTypes="orderStatusTypes"></reviewableItem>
          <mugen-scroll :handler="pageDownReviewable" :should-handle="reviewableLoading">
            <div id="loader" v-show="reviewableLoading">
              <div class="loader_img"></div>
              <p class="loader_txt">불러오는 중입니다...</p>
            </div>
          </mugen-scroll>
        </ul>
      </template>
      <div v-if="productReviewable && productReviewable.length === 0" class="no_contents">
        <span>상품평 작성가능 주문내역이 없습니다.</span>
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
import reviewableItem from '@/components/mypage/review/ReviewableItem'
import { mapState, mapGetters } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
export default {
  data () {
    return {
    }
  },
  metaInfo: {
    title: '상품평쓰기'
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
    ...mapState('profilereview', ['productReviewable', 'reviewableLoading']),
    ...mapGetters('common', ['orderStatusTypes'])
  },
  components: {
    reviewableItem,
    MugenScroll
  }
}
</script>

<style>
.review_w_list #loader {
  position: static;
  transform: none;
}
</style>


