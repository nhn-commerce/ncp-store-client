<template>
  <div id="contents" class="mypage_wrap">
    <div class="myorder_menu">
      <router-link to='/mypage/mycoupon' exact-active-class="is_curr">
        사용가능 쿠폰
      </router-link>
      <router-link to='/mypage/mycoupon/novalidcoupon' active-class="is_curr">
        사용완료 / 기간만료 쿠폰
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
</script>
<style>

</style>

