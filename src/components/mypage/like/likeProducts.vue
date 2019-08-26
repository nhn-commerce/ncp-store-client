<template>
  <div v-if="getLikeProducts" id="contents" class="mypage_wrap">
    <div v-if="getLikeProducts.length === 0" class="no_contents">
      <p>찜한 상품이 없습니다.</p>
    </div>
    <form v-if="getLikeProducts.length > 0">
      <fieldset>
        <legend class="acc-hidden">찜한 상품 선택 삭제 폼</legend>
        <div class="wish_con">
          <div class="cart_all">
            <div class="check_style1">
              <input type="checkbox" @click="selectAll" id="allCart">
              <label for="allCart">
                <span></span>전체선택</label>
            </div>
            <div class="btn_all_del">
              <span>
                <a href="javascript:;" @click="deleteProducts(delArr)" class="del">삭제</a>
              </span>
            </div>
          </div>
          <ul class="list_type_list type2">
            <li v-for="(items, index) in getLikeProducts" :key="items.productNo">
              <a href="javascript:;" class="card_item">
                <router-link :to="items.stockCnt === 0||(items.saleStatusType !== 'READY'&&items.saleStatusType !=='ONSALE')?'':`/product/${items.productNo}`">
                  <div class="card_photo">
                    <img v-if="items.imageUrls && items.imageUrls[0]" :src="items.imageUrls[0]" />
                    <img v-else src="../../../assets/images/content/buywow_default.jpg" />
                  </div>
                  <div class="card_txt_box">
                    <p class="card_brand">{{items.brandName}}</p>
                    <p class="card_name">{{items.productName}}</p>
                    <template v-if="items.stockCnt === 0">
                      <div class="card_nosale">
                        <p>
                          <strong>구매불가</strong>이 상품은 상품정보 변경 또는 재고소진으로 주문이 불가합니다.</p>
                      </div>
                    </template>
                    <template v-else-if="items.saleStatusType === 'READY'">
                      <div class="card_nosale">
                        <p>
                          <strong>구매불가</strong>{{items.saleStartYmdt}} 오픈예정</p>
                      </div>
                    </template>
                    <template v-else-if="items.saleStatusType !=='ONSALE'">
                      <div class="card_nosale">
                        <p>
                          <strong>구매불가</strong>이 상품은 상품정보 변경 또는 재고소진으로 주문이 불가합니다.</p>
                      </div>
                    </template>
                    <template v-else>
                      <div class="card_price">
                        <p v-if="items.immediateDiscountAmt + items.additionDiscountAmt + items.couponDiscountAmt  && items.salePrice" class="discount">
                          <strong>{{ Math.round(((items.immediateDiscountAmt + items.additionDiscountAmt + items.couponDiscountAmt) / items.salePrice) * 100) }}</strong>%
                        </p>
                        <p class="sale_price">
                          <strong>{{miliFormat(items.salePrice - items.immediateDiscountAmt - items.additionDiscountAmt - items.couponDiscountAmt)}}</strong>원</p>
                      </div>
                      <div class="card_info">
                        <div class="card_tag" v-for="sticker in items.newStickers" :key="sticker">
                          <span>{{sticker}}</span>
                        </div>
                        <div class="card_buy" v-if="items.saleCnt >= 10">{{miliFormat(items.saleCnt)}} 구매</div>
                      </div>
                    </template>
                  </div>
                </router-link>
              </a>
              <div class="wish_btn">
                <div class="check_style1">
                  <input v-model='selectArr' :value="index" @click="sigSelect(items.productNo)" type="checkbox" :id="index">
                  <label :for="index">
                    <span></span>
                  </label>
                </div>
                <a href="javascript:;" @click="likeDeleteProduct(items.productNo)" class="btn_del">삭제하기</a>
              </div>
            </li>
            <mugen-scroll :handler="getLikeProductsMore" :should-handle="loading">
              <div id="loader" v-show="loading">
                <div class="loader_img"></div>
                <p class="loader_txt">불러오는 중입니다...</p>
              </div>
            </mugen-scroll>
          </ul>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
import { formatCurrency } from '@/utils/StringUtils'
export default {
  data () {
    return {
      selectArr: [],
      allCart: [],
      delArr: []
    }
  },
  metaInfo: {
    title: '찜한 상품'
  },
  methods: {
    miliFormat (num) {
      return formatCurrency(num)
    },
    selectAll (event) {
      if (event.currentTarget.checked) {
        this.selectArr = []
        this.getLikeProducts.forEach(function (item, i) {
          this.selectArr.push(i)
        }, this)
        this.delArr.splice(0, this.getLikeProducts.length)
        this.getLikeProducts.forEach((num) => this.delArr.push(num.productNo))
      } else {
        this.selectArr = []
        this.delArr.splice(0, this.getLikeProducts.length)
      }
    },
    sigSelect (num) {
      if (this.delArr.find((n) => n === num)) {
        this.arrRemove(num)
      } else {
        this.delArr.push(num)
      }
      if (this.delArr.length === this.getLikeProducts.length) {
        document.getElementById('allCart').checked = true
      } else {
        document.getElementById('allCart').checked = false
      }
    },
    arrRemove (val) {
      var index = this.delArr.indexOf(val)
      if (index > -1) {
        this.delArr.splice(index, 1)
      }
    },
    likeDeleteProduct (productNo) {
      if (confirm('상품을 삭제하시겠습니까?') === true) {
        this.$store.dispatch('likeProducts/pageLikeProducts', [productNo])
        this.selectArr = []
      }
    },
    deleteProducts (num) {
      if (num.length <= 0) {
        alert('상품을 선택해주세요.')
      } else {
        if (confirm('선택한 상품을 삭제하시겠습니까?') === true) {
          this.$store.dispatch('likeProducts/pageLikeProducts', num)
          this.delArr = []
          this.selectArr = []
        }
      }
    },
    removeDuplicatedItem (arr) {
      var ret = []
      for (var i = 0, j = arr.length; i < j; i++) {
        if (ret.indexOf(arr[i]) === -1) {
          ret.push(arr[i])
        }
        return ret
      }
    },
    ...mapActions('likeProducts', ['getLikeProductsMore'])
  },
  computed: {
    ...mapGetters('likeProducts', ['getLikeProducts']),
    ...mapState('likeProducts', ['loading'])
  },
  components: {
    MugenScroll
  }
}
</script>
<style>
.wish_con #loader {
  position: static;
  transform: none;
}
</style>
