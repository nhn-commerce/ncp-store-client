<template>
  <ul class="big_type_list">
    <li v-for="product in products" :key="product.productNo">
      <router-link :to="`/product/${product.productNo}`" class="card_item">
        <div class="card_photo">
          <p class="card_photo_size">
            <template v-if="product.adult && adult_flg">
              <img src="../../../assets/images/sub/img_19.jpg" />
            </template>
            <template v-else>
              <img v-if="product.showImg" :src="product.showImg" />
              <img v-else src="../../../assets/images/content/buywow_default.jpg" />
            </template>
          </p>
          <span :class="['like', {'on': product.liked}]" @click.prevent="likeIt(product.productNo)"></span>
          <!-- <p class="btn_wish">
            <button :class="{'wish_on':product.liked, 'wish_off':!product.liked}" @click.prevent="likeIt(product.productNo)">위시리스트삭제</button>
          </p> -->
        </div>
        <div class="card_txt_box">
          <p class="card_brand">{{product.brandName}}</p>
          <p class="card_name">{{product.productName}}</p>
          <p class="card_sub">{{product.productNameEn}}</p>
          <div class="card_price">
            <p v-if="product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt  && product.salePrice" class="discount">
              <strong>{{ Math.round(((product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt) / product.salePrice) * 100) }}</strong>%
            </p>
            <p class="discount" v-else>
              <span class="txt">혜택가</span>
            </p>
            <p class="sale_price">
              <strong>{{ product.salePrice - product.immediateDiscountAmt - product.additionDiscountAmt - product.couponDiscountAmt | formatNumber }}</strong>원
            </p>
            <p class="original_price" v-if="product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt">
              <strong>{{ product.salePrice | formatNumber }}</strong>원
            </p>
            <button class="btn_buy">구매하기</button>
          </div>
        </div>
        <div class="card_other_info" v-if="product.newStickers && product.newStickers.length">
          <p v-for="sticker in product.newStickers">{{sticker}}</p>
        </div>
      </router-link>
    </li>
  </ul>
</template>

<script>
import cookies from 'js-cookie'
import { mapGetters } from 'vuex'
// import config from '@/config'

export default {
  props: ['products', 'categories'],
  methods: {
    afterChange (event, slick, currentSlide, nextSlide) {
      this.currentSlide = currentSlide + 1
    },
    likeIt (productNo) {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        const _this = this
        this.$store.dispatch('likeProducts/postLikeProducts', [productNo]).then(() => {
          _this.$store.commit('display/CHANGELIKED', productNo)
        })
      }
    }
  },
  computed: {
    adult_flg () {
      return cookies.get('ncpAdultCertificated') !== 'true'
    },
    ...mapGetters('authentication', ['isAvailableMember'])
  }
}
</script>

<style>
</style>
