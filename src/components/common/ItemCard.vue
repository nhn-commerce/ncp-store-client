
  <template>
  <a v-if="product.frontDisplayYn === true" class="card_item" @click.prevent="sendClick(product.productNo)">
    <div class="card_photo">
      <p class="card_photo_size">
        <template v-if="adult_flg">
          <img src="../../assets/images/sub/img_19.jpg" />
        </template>
        <template v-else>
          <img v-if="product.imageUrls && product.imageUrls[0]" :src="product.imageUrls[0]" />
          <img v-else src="../../assets/images/content/buywow_default.jpg" />
        </template>
      </p>
      <span :class="['like', {'on': product.liked}]" @click.stop="likeIt(product.productNo)"></span>
    </div>
    <div class="card_txt_box">
      <p class="card_brand">{{product.brandName}}</p>
      <p class="card_name">{{product.productName}}</p>
      <p class="card_sub">{{product.productNameEn}}</p>
      <div class="card_price">
        <p v-if="product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt && product.salePrice" class="discount">
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
    <div class="card_other_info" v-if="type === 'category' && product.newStickers && product.newStickers.length">
      <p v-for="sticker in product.newStickers">{{sticker}}</p>
    </div>
  </a>
  <div v-else class="card_item">
    <div class="card_photo">
      <p class="card_photo_size">
        <img src="../../assets/images/content/buywow_default.jpg" />
      </p>
    </div>
    <div class="card_txt_box">
      <p class="card_no">전시 상품이 아닙니다.</p>
    </div>
  </div>
</template>

<script>
/* global NCPSearch */
import cookies from 'js-cookie'
import { mapGetters } from 'vuex'

export default {
  props: ['product', 'type', 'listType', 'bestNum'],
  methods: {
    sendClick (productNo) {
      const showLog = ['Search', 'Category', 'Brand', 'MainBest']
      if (showLog.some(item => item === this.$route.name)) {
        const targetURL = `${location.protocol}//${location.host}/product/${productNo}`
        NCPSearch.sendClickLog(targetURL, this.product.searchProductId, 'main', cookies.get('adId') ? cookies.get('adId') : '')
      }
      this.$router.push({
        path: '/product/' + productNo,
        query: {
          searchProductID: this.product.searchProductId
        }
      })
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
      return this.product.adult && cookies.get('ncpAdultCertificated') !== 'true'
    },
    ...mapGetters('authentication', ['isAvailableMember'])
  }
}
</script>

<style>

</style>
