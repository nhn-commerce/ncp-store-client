<template>
  <div id="contents" class="mypage_wrap">
    <basic></basic>
    <div class="mypage_menu">
      <div class="my_mn_list">
        <h3 class="title">주문배송정보</h3>
        <ul class="list">
          <li>
            <router-link to="/mypage/orderlist">주문내역&middot;배송조회</router-link>
          </li>
          <li>
            <router-link to="/mypage/cancellist">취소&middot;반품내역</router-link>
          </li>
        </ul>
      </div>
      <div class="my_mn_list">
        <h3 class="title">나의 혜택</h3>
        <ul class="list">
          <li>
            <router-link to="/mypage/mycoupon">내 쿠폰함</router-link>
          </li>
          <li>
            <router-link to="/mypage/registcoupon">쿠폰코드 등록</router-link>
          </li>
        </ul>
      </div>
      <div class="my_mn_list">
        <h3 class="title">내가 쓴글</h3>
        <ul class="list">
          <li>
            <router-link to="/mypage/myreviewable">상품평</router-link>
          </li>
          <li>
            <router-link to="/mypage/myproductinquirys">상품 문의</router-link>
          </li>
          <li>
            <router-link to="/mypage/myprofileinquirys">1:1 문의</router-link>
          </li>
        </ul>
      </div>
      <div class="my_mn_list">
        <h3 class="title">나의 관심</h3>
        <ul class="list">
          <li>
            <router-link to="/mypage/likeproducts">찜한 상품</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import basic from '@/components/mypage/main/Basic'

export default {
  metaInfo: {
    title: '마이페이지 메인'
  },
  name: 'MyPage',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  components: {
    basic
  }
}
</script>
<style>

</style>
