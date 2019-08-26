<template>
  <li class="qna_card">
    <dl class="qc_q">
      <dt>Q</dt>
      <dd class="qc_q_top">
        <div class="type">{{mallName}}</div>
        <!-- <div class="type">{{myInquiryItem.inquiryType.inquiryTypeName}}</div> -->
        <div class="info">
          <span class="date">{{myInquiryItem.showDate}}</span>
        </div>
      </dd>
      <dd class="qc_q_txt">
        <strong class="title">{{myInquiryItem.inquiryTitle}}</strong>
        <pre class="txt" v-text="myInquiryItem.inquiryContent">
        </pre>
      </dd>
      <dd v-if="myInquiryItem.imageUrls.length > 0">
        <ul class="rlc_photo" v-if="myInquiryItem.imageUrls.length < 4">
          <li v-for="(fileurlItem, index) in myInquiryItem.imageUrls" :key="index">
            <a v-bind:data-slider="index" @click.prevent="showImage(index)">
              <img :src="fileurlItem ? fileurlItem : ''" alt="" @load="imageLoaded">
            </a>
          </li>
        </ul>
        <ul class="rlc_photo" v-if="myInquiryItem.imageUrls.length >= 4">
          <li v-for="(fileurlItem, index) in myInquiryItem.imageUrls" :key="index" v-if="index < 4">
            <a v-bind:data-slider="index" @click.prevent="showImage(index)" v-if="index < 3">
              <img :src="fileurlItem ? fileurlItem : ''" alt="" @load="imageLoaded">
            </a>
            <a v-bind:data-slider="index" @click.prevent="showImage(index)" v-if="index === 3">
              <img :src="fileurlItem ? fileurlItem : ''" alt="" @load="imageLoaded">
              <div class="more">
                <p class="num">+
                  <em>{{myInquiryItem.imageUrls.length - 3 }}</em>
                </p>
                <p class="txt">더보기</p>
              </div>
            </a>
          </li>
        </ul>
      </dd>
    </dl>
    <div v-if="myInquiryItem.answer">
      <dl class="qc_a">
        <dt>A</dt>
        <dd class="qc_a_top">
          <div class="type">{{ myInquiryItem.answer.showRespondentName }}</div>
          <div class="info">
            <span class="date">{{myInquiryItem.answer.showAnswersYmdt}}</span>
          </div>
        </dd>
        <dd class="qc_a_txt">
          <pre v-text="myInquiryItem.answer.answerContent" />
        </dd>
      </dl>
    </div>
    <div v-if="!myInquiryItem.answer">
      <dl class="qc_a">
        <dt>A</dt>
        <dd class="qc_a_top">
          <div class="type">{{mallName}}</div>
          <div class="info">
            <span class="notice">답변 검토중입니다.</span>
          </div>
        </dd>
      </dl>
    </div>
    <ProductReviewImages v-if="productReviewImagesflg" @closePopProductReviewImages="closeProductReviewImages" :fileUrls="myInquiryItem.imageUrls" :sliderdata="sliderdata" :hiddenSmall="myInquiryItem.imageUrls.length === 1"/>
  </li>
</template>

<script>
import ProductReviewImages from '@/components/common/ProductReviewImages'
import $ from 'jquery'
import config from '@/config'

export default {
  data () {
    return {
      productReviewImagesflg: false,
      sliderdata: 0,
      mallName: config.mallName
    }
  },
  components: {
    ProductReviewImages
  },
  props: ['myInquiryItem'],
  methods: {
    showImage (sliderdata) {
      this.productReviewImagesflg = true
      this.sliderdata = sliderdata
    },
    imageLoaded (event) {
      const imageLi = $('.rlc_photo li').eq(0).outerWidth()
      let maxWidth = document.body.clientWidth - 84
      const img = event.target
      if (img.naturalWidth >= 500 || img.naturalHeight >= 500) {
        let tempSize = 0
        if (img.naturalWidth > img.naturalHeight) {
          tempSize = img.naturalWidth
        } else {
          tempSize = img.naturalHeight
        }
        img.width = img.naturalWidth * imageLi / maxWidth * (maxWidth / tempSize)
      } else {
        img.height = img.naturalHeight * imageLi / maxWidth
      }
    },
    closeProductReviewImages () {
      this.productReviewImagesflg = false
    }
  }
}
</script>

<style>
</style>
