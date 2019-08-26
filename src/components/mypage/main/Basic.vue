<template>
  <div v-if="member" class="mypage_top">
    <div class="profile_area">
      <div class="btn_box btn_3">
        <router-link to="/etc/faq" class="btn_style4">고객센터</router-link>
        <router-link to="/etc/boardinquire" class="btn_style4">1:1 문의하기</router-link>
      </div>
    </div>
    <ul v-if="mySummary" class="mypage_state">
      <li>
        <router-link to="/mypage/orderlist">
          <div>
            <em>{{mySummary.deliveringCnt}}</em>
            <strong>배송중</strong>
          </div>
        </router-link>
      </li>
      <li>
        <router-link to="/mypage/mycoupon">
          <div>
            <em>{{mySummary.usableCouponCnt}}</em>
            <strong>내쿠폰</strong>
          </div>
        </router-link>
      </li>
      <li>
        <router-link to="/mypage/myreviewable">
          <div>
            <em>{{mySummary.reviewCnt}}</em>
            <strong>상품평 쓰기</strong>
          </div>
        </router-link>
      </li>
      <li>
        <router-link to="/mypage/likeproducts">
          <div>
            <em>{{mySummary.likeCnt}}</em>
            <strong>찜상품</strong>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    isMobileWeb () {
      return process.env.BUILD_TARGET === 'mobileweb'
    },
    ...mapState('member', ['member', 'mySummary'])
  },
  methods: {
    // logout () {
    //   this.$store.dispatch('authentication/logout')
    // }
  }
}
</script>

