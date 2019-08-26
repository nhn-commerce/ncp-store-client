<template>
  <li>
    <div class="rl_card">
      <div class="rlc_top">
        <p class="star">
          <span class="star_on" v-bind:class="'star' + this.productReviewsitem.rate"></span>
        </p>
        <p class="info">
          <span class="name">{{productReviewsitem.memberId}}</span>
          <span class="date">{{productReviewsitem.showRegisterYmdt}}</span>
        </p>
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
      <div class="rlc_txt more_txt" v-bind:class="isopen?'is_open':''" v-if="this.productReviewsitem.content && this.productReviewsitem.content.length > 20" @click="showAllcontent">
        <pre class="txt" v-text="productReviewsitem.content"/>
      </div>
      <div class="rlc_bottom">
        <p class="good_txt">
          <strong>&nbsp;</strong>
        </p>
        <div class="btn" v-if="!productReviewsitem.myReview">
          <a class="recommend" @click.prevent="goodRecommend" v-if="productReviewsitem.recommendable">추천하기{{productReviewsitem.recommendCnt > 0?'(' + productReviewsitem.recommendCnt+ ')':''}}</a>
          <a class="recommend good" @click.prevent="cancelRecommend" v-if="!productReviewsitem.recommendable">추천취소{{productReviewsitem.recommendCnt > 0?'(' + productReviewsitem.recommendCnt+ ')':''}}</a>
          <a class="report" @click.prevent="reviewReportPop" v-if="productReviewsitem.reportable">신고하기</a>
        </div>
      </div>
      <productReviewImages v-if="productReviewImagesflg" @closePopProductReviewImages="closeProductReviewImages" :fileUrls="productReviewsitem.fileUrls" :sliderdata="sliderdata"></productReviewImages>
    </div>
  </li>
</template>

<script>
import productReviewImages from '@/components/common/ProductReviewImages'
import { formatCurrency } from '@/utils/StringUtils'
import ssq from 'jquery'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      running: false,
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
    miliFormat (num) {
      return formatCurrency(num)
    },
    goodRecommend () {
      if (this.running) {
        return
      } else {
        this.running = true
      }
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        const recommend = {
          productNo: this.$store.state.route.params.productId,
          reviewNo: this.productReviewsitem.reviewNo
        }
        this.$store.dispatch('productreview/postProductReviewsRecommend', recommend).then(() => {
          this.running = false
        }).catch((e) => {
          this.running = false
        })
      }
    },
    cancelRecommend () {
      if (this.running) {
        return
      } else {
        this.running = true
      }
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        const recommend = {
          productNo: this.$store.state.route.params.productId,
          reviewNo: this.productReviewsitem.reviewNo
        }
        this.$store.dispatch('productreview/deleteProductReviewsRecommend', recommend).then(() => {
          this.running = false
        }).catch((e) => {
          this.running = false
        })
      }
    },
    reviewReportPop () {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        this.$emit('showPop', this.productReviewsitem.reviewNo)
      }
    },
    showAllcontent () {
      this.isopen = !this.isopen
    },
    showImage (sliderdata) {
      this.productReviewImagesflg = true
      this.sliderdata = sliderdata
    },
    closeProductReviewImages () {
      this.productReviewImagesflg = false
    }
  },
  computed: {
    ...mapGetters('authentication', ['isAvailableMember'])
  },
  components: {
    productReviewImages
  }
}
</script>

