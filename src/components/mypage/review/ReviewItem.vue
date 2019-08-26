<template>
  <li>
    <div class="rl_card">
      <div class="rlc_top">
        <p class="star">
          <span :class="`star_on star`+ productReviewsitem.rate"> {{productReviewsitem.rate}}.0</span>
        </p>
        <p class="info">
          <span class="like">
            <strong>추천</strong>{{productReviewsitem.recommendCnt}}</span>
          <span class="date">{{productReviewsitem.showRegisterYmdt}}</span>
        </p>
      </div>
      <div class="rlc_product">
        <router-link :to="`/product/${productReviewsitem.productNo}`">
          <div class="photo">
            <img :src="productReviewsitem.imageUrl?productReviewsitem.imageUrl:''" alt="">
          </div>
          <div class="txt_box">
            <strong>{{productReviewsitem.brandName}}</strong>
            <p>
              {{productReviewsitem.productName}}
            </p>
          </div>
        </router-link>
      </div>
      <dl class="rlc_option">
        <dt>선택한 옵션</dt>
        <dd>
           <span v-for="showOption in productReviewsitem.showOptions" :key="showOption.index">{{showOption}}</span>
        </dd>
      </dl>
      <ul class="rlc_photo" v-if="productReviewsitem.fileUrls.length <= 4">
        <li v-for="(fileurlItem,index) in productReviewsitem.fileUrls" :key="index">
          <a v-bind:data-slider="index" @click.prevent="showImage(index)">
            <img :src="fileurlItem?fileurlItem:''" alt="" @load="imageLoaded">
          </a>
        </li>
      </ul>
      <ul class="rlc_photo" v-if="productReviewsitem.fileUrls.length > 4">
        <li v-for="(fileurlItem,index) in productReviewsitem.fileUrls" :key="index" v-if="index < 4">
          <a v-bind:data-slider="index" @click.prevent="showImage(index)" v-if="index < 3">
            <img :src="fileurlItem?fileurlItem:''" alt="" @load="imageLoaded">
          </a>
          <a v-bind:data-slider="index" @click.prevent="showImage(index)" v-if="index === 3">
            <img :src="fileurlItem?fileurlItem:''" alt="" @load="imageLoaded">
            <div class="more">
              <p class="num">+
                <em>{{productReviewsitem.fileUrls.length - index }}</em>
              </p>
              <p class="txt">더보기</p>
            </div>
          </a>
        </li>
      </ul>
      <div class="rlc_txt" v-if="this.productReviewsitem.content && this.productReviewsitem.content.length <= 20">
        <pre class="txt" v-text="productReviewsitem.content"/>
      </div>
      <div class="rlc_txt more_txt" v-if="this.productReviewsitem.content && this.productReviewsitem.content.length > 20" v-bind:class="isopen?'is_open':''" @click="showAllcontent">
        <pre class="txt" v-text="productReviewsitem.content"/>
      </div>
      <div class="rlc_bottom btn_box">
        <a @click.prevent="updateReviewShow" class="btn_style1">수정</a>
        <a @click.prevent="deleteReview" class="btn_style3">삭제</a>
      </div>
      <productReviewImages v-if="productReviewImagesflg" @closePopProductReviewImages="closeProductReviewImages" :fileUrls="productReviewsitem.fileUrls" :sliderdata="sliderdata"></productReviewImages>
    </div>
  </li>
</template>
<script>
import productReviewImages from '@/components/common/ProductReviewImages'
import ssq from 'jquery'
export default {
  data () {
    return {
      rate: '',
      content: '',
      images: [],
      productReviewImagesflg: false,
      sliderdata: 0,
      isopen: false
    }
  },
  props: ['productReviewsitem'],
  methods: {
    imageLoaded (event) {
      const imageLi = ssq('.rlc_photo li').eq(0).outerWidth()
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
    updateReviewShow () {
      const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
      this.$router.push({
        path: '/mypage/editreview/' + this.productReviewsitem.orderNo + '/' + this.productReviewsitem.orderedOption.orderOptionNo + '/' + this.productReviewsitem.reviewNo + '/' + this.productReviewsitem.productNo,
        query: {
          fromUrl: thisUrl
        }
      })
    },
    deleteReview () {
      let deleteConfirm = confirm('상품평을 삭제하시면 복구 하거나 다시 작성 할 수 없습니다. 삭제하시겠습니까?')
      if (deleteConfirm) {
        const paramsReview = {
          reviewNo: this.productReviewsitem.reviewNo,
          productNo: this.productReviewsitem.productNo
        }
        this.$store.dispatch('profilereview/deleteProductReviews', paramsReview)
      }
    },
    showImage (sliderdata) {
      this.productReviewImagesflg = true
      this.sliderdata = sliderdata
    },
    closeProductReviewImages () {
      this.productReviewImagesflg = false
    },
    showAllcontent () {
      this.isopen = !this.isopen
    }
  },
  components: {
    productReviewImages
  },
  computed: {
  }
}
</script>

<style>

</style>


