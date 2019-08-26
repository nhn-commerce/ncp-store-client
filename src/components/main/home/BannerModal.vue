<template>
  <div class="main_layer" id="mainLayer">
    <div class="main_layer_title">
      <h3 v-if="label">{{label}}</h3>
      <h3 v-else>추천 이벤트</h3>
      <button type="button" class="btn_close" @click="close()">레이어 닫기</button>
    </div>
    <div class="main_layer_inner">
      <div class="main_layer_con">
        <div v-for="banner in banners" :key="banner.imageUrl">
          <banner-link :banner="banner">
            <img :src="banner.imageUrl" alt="">
          </banner-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BannerLink from '@/components/common/BannerLink'

export default {
  props: ['banners', 'label'],
  components: {
    BannerLink
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    document.body.classList.add('is_main_layer_open')
  },
  destroyed () {
    document.body.classList.remove('is_main_layer_open')
  }
}
</script>

<style>
/* @keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
} */
</style>
