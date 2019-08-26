<template>
  <div id="layerPopup" style="position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 999999;">
    <div id="reviewReportPopBg" style="background-color:black; filter: alpha(opacity=0); -khtml-opacity:0; -moz-opacity:0; opacity:0; width:100%; height: 100%; position:fixed; left:0; top:0; ">&nbsp;</div>
    <div id="reviewReportPop" class="_layer_content _text" style="position:fixed; " data-type="text">
      <div class="basic_popup review_photo_popup">
        <div class="popup_wrap">
          <div class="popup_inner" id="review_images">
            <div class="review_photo_slider">
              <div class="slider_b">
                <slick class="slider" ref="slick" :options="pdoptions1" @beforeChange="beforeChange">
                  <div v-for="(image, index) in fileUrls" :key="image" class="innerimg">
                    <img :src="image"/>
                  </div>
                </slick>
                <div class="counter">
                  <strong>{{slideCount}}</strong> / {{fileUrls.length}}
                </div>
              </div>
              <div class="slider_s slick-initialized slick-slider" :style="{
                      'width': paddingRight + 'px',
                      'margin': 'auto',
                      'margin-top': '5px'
                    }" v-if="!hiddenSmall">
                <div class="slick-list draggable">
                  <div class="slick-track tumb-anim" :style="{
                      'width': 60 * fileUrls.length + 'px',
                      'left': -60 * slideFrist + 'px',
                    }">
                    <div v-for="(image, index) in fileUrls" :key="image" @click.prevent="clickImageChange(index)" :class="{
                      'slick-slide': true,
                      'slick-current': index === slideCount-1
                    }" aria-hidden="true" tabindex="-1" style="width: 60px;">
                      <div class="slick-small_box">
                        <div class="slick-small"><img :src="image" @load="imageLoaded(index)"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" class="btn_close" id="closeBtn1" @click="close">팝업 닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils/utils'
import Slick from 'vue-slick'
import ssq from 'jquery'
export default {
  data () {
    return {
      pdoptions1: {
        fade: true,
        initialSlide: this.sliderdata,
        infinite: false,
        arrows: true
      },
      slideCount: this.sliderdata + 1,
      showImgCount: 0,
      slideFrist: 0,
      paddingRight: 0,
      bodyScrollTop: 0
    }
  },
  props: ['fileUrls', 'sliderdata', 'hiddenSmall'],
  methods: {
    imageLoaded (index) {
      const $bigImg = ssq('.slider_b .slider img').eq(index)
      const $smallImg = ssq('.slick-small img').eq(index)
      let tempwh = ssq('.innerimg').eq(0).outerWidth()
      $smallImg.width($bigImg.width() * 54 / tempwh)
      $smallImg.height($bigImg.height() * 54 / tempwh)
    },
    clickImageChange (index) {
      this.$refs.slick.goTo(index, true)
    },
    sliderinit (e, slick) {
      if (slick.slideCount <= this.showImgCount()) {
        this.slideFrist = 0
        slick.$slider.addClass('slick-no-slide')
      } else {
        slick.$slider.removeClass('slick-no-slide')
      }
    },
    close () {
      this.$emit('closePopProductReviewImages')
      removeClass(document.body, 'no_scroll')
      document.body.style.top = '0px'
      window.scrollTo(0, this.bodyScrollTop * -1)
    },
    beforeChange (event, slick, currentSlide, nextSlide) {
      if (nextSlide < this.slideFrist) {
        this.slideFrist = nextSlide
      } else if (nextSlide >= this.slideFrist + this.showImgCount) {
        this.slideFrist = nextSlide - (this.showImgCount - 1)
      }
      this.slideCount = (nextSlide + 1)
    }
  },
  components: {
    Slick
  },
  computed: {
    slideFristCalc () {
      return Math.min(this.sliderdata, Math.max(this.fileUrls.length - this.showImgCount, 0))
    }
  },
  mounted () {
    this.showImgCount = Math.round(((ssq('#review_images').width() - 80) / 60))
    if (this.showImgCount > 5) {
      this.showImgCount = 5
    }
    if (this.showImgCount > 4) {
      this.paddingRight = 330
    } else if (this.showImgCount === 4) {
      this.paddingRight = 270
    } else {
      this.paddingRight = this.showImgCount * 60 + this.showImgCount * 20
      if (this.paddingRight > 210) {
        this.paddingRight = 210
      }
    }
    ssq('.innerimg').height(ssq('.innerimg').eq(0).outerWidth())
    this.slideFrist = this.slideFristCalc
  },
  created () {
    const currScroll = document.body.scrollTop | document.documentElement.scrollTop
    this.bodyScrollTop = currScroll * -1
    document.body.style.top = this.bodyScrollTop + 'px'
    addClass(document.body, 'no_scroll')
  }
}
</script>

<style>
.slick-no-slide .slick-track {
  transform: translate3d(0px, 0px, 0px) !important;
}
.review_photo_slider .slider_s .slick-list.draggable {
  padding: 0 !important;
}
.tumb-anim {
  transition: left 0.3s ease;
}
.review_photo_slider .slick-slide.slick-current .slick-small:before {
  border: 2px solid rgb(255, 86, 117);
}
.review_photo_slider .slider_s .slick-list.draggable .slick-slide img {
  box-sizing: border-box;
}
</style>
