<template>
  <div class="back_capture" v-if="loading">
    <div id="loader">
      <span class="loading_img"></span>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('loading', ['loading'])
  }
}
</script>


<style>
.back_capture {
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background-color: white;
  text-align: center;
  z-index: 999;
  padding: 100px;
}
.loading_img {
  display: block;
  width: 18px;
  height: 18px;
  margin: 0 auto;
  background-image: url('../../assets/images/common/waiting.gif');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
