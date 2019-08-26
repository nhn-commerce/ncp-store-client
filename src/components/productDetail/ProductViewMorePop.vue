<template>
  <div class="viewmore_layer" id="viewMorePop" style="display: block;">
    <div class="viewmore_layer_inner">
      <div class="viewmore_layer_title">
        <h3>{{productNameOverFlow}}</h3>
        <a type="button" class="btn_close" @click.prevent="closeView">레이어 닫기</a>
      </div>
      <div class="viewmore_layer_con">
        <div class="layer_info_con">
          <slick class="moreSlider" ref="slick" :options="options" @beforeChange="beforeChange">
            <div v-for="item in productOptionsImgs" :key="item.optionNo">
              <img v-for="img in item.imgs" :key="img" :src="img" alt="">
            </div>
          </slick>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slick from 'vue-slick'
import { mapState, mapGetters, mapMutations } from 'vuex'
import ssq from 'jquery'

export default {
  props: ['optionNo'],
  data () {
    return {
      options: {
        accessibility: false,
        initialSlide: 0
      }
    }
  },
  methods: {
    closeView () {
      this.$emit('closePop')
    },
    beforeChange (event, slick, currentSlide, nextSlide) {
      ssq('.moreSlider .slick-slide').scrollTop(0)
      this.SELECT_OPTION(this.productOptionsImgs[nextSlide].optionNo)
    },
    ...mapMutations('product', ['SELECT_OPTION'])
  },
  components: {
    Slick
  },
  computed: {
    ...mapGetters('product', ['productOptionsImgs']),
    ...mapState('product', ['product']),
    productNameOverFlow () {
      return this.product.baseInfo.productName.length > 25 ? this.product.baseInfo.productName.substring(0, 25) + '...' : this.product.baseInfo.productName
    }
  },
  created () {
    if (this.productOptionsImgs && this.optionNo) {
      this.productOptionsImgs.forEach((item, index) => {
        if (item.optionNo === this.optionNo) {
          this.options.initialSlide = index
        }
      })
    }
  }
}
</script>

<style>

</style>
