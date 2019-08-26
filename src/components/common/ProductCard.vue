
  <template>
  <a v-if="product.frontDisplayYn === true" class="card_item" @click.prevent="sendClick(product.productNo)">
    <div class="card_photo">
      <template v-if="adult_flg">
        <img src="../../assets/images/sub/img_19.jpg" />
      </template>
      <template v-else>
        <img v-if="product.imageUrls && product.imageUrls[0]" :src="product.imageUrls[0]" />
        <img v-else src="../../assets/images/content/buywow_default.jpg" />
      </template>
    </div>
    <div class="card_txt_box">
      <p v-if="type !== 'best'" class="card_brand">{{product.brandName}}</p>
      <div v-if="type === 'best'" class="best_num">{{bestNum}}</div>
      <p class="card_name">{{product.productName}}</p>
      <p v-if="type === 'best'" class="card_desc">{{product.productNameEn}}</p>
      <div class="card_price">
        <p v-if="product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt > 0" class="discount">
          <strong>{{ Math.round(((product.immediateDiscountAmt + product.additionDiscountAmt + product.couponDiscountAmt) / product.salePrice) * 100) }}</strong>%
        </p>
        <p class="sale_price">
          <strong>{{ product.salePrice - product.immediateDiscountAmt - product.additionDiscountAmt - product.couponDiscountAmt | formatNumber }}</strong>원
        </p>
      </div>
      <div class="card_info">
        <template v-if="listType === 'wide'">
          <div class="card_tag" v-if="product.newStickers && product.newStickers[0]">
            <span>{{product.newStickers[0]}}</span>
          </div>
        </template>
        <template v-else>
          <div class="card_tag" v-for="sticker in product.newStickers" :key="sticker">
            <span>{{sticker}}</span>
          </div>
        </template>
        <div class="card_buy" v-if="product.saleCnt >= 10">{{ product.saleCnt | formatNumber }} 구매</div>
      </div>
    </div>
  </a>
  <div v-else class="card_item">
    <div class="card_photo">
      <img src="../../assets/images/content/buywow_default.jpg" />
    </div>
    <div class="card_txt_box">
      <p class="card_no">전시 상품이 아닙니다.</p>
    </div>
  </div>
</template>

<script>
/* global NCPSearch */
import cookies from 'js-cookie'

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
    }
  },
  computed: {
    adult_flg () {
      return this.product.adult && cookies.get('ncpAdultCertificated') !== 'true'
    }
  }
}
</script>

<style>

</style>
