<template>
  <div v-if="product" class="product_view_info">
    <div class="pv_i">
      <div class="pv_i_name">
        <p v-if="product.brand" class="brand">
          <router-link :to="`/brand/${product.brand.brandNo}`" class="btn_list">{{product.brand.nameType === 'NAME_KO' ? product.brand.name : product.brand.nameEn}}</router-link>
        </p>
        <p class="name">{{product.baseInfo.productName}}</p>
        <template v-if="product.newStickers && product.newStickers.length > 0">
          <div class="tag">
            <span v-for="sticks in product.newStickers" :key="sticks">{{sticks}}</span>
          </div>
        </template>
      </div>
      <div class="pv_i_price">
        <template v-if="product.status.saleStatusType !== 'ONSALE'">
          <p class="sale_price disabled">
            <strong>구매불가</strong>
          </p>
        </template>
        <template v-else>
          <p v-if="product.price.immediateDiscountAmt + product.price.additionDiscountAmt  && product.price.salePrice" class="discount">
            <strong>{{ Math.round(((product.price.immediateDiscountAmt + product.price.additionDiscountAmt) / product.price.salePrice) * 100) }}</strong>%
          </p>
          <!-- 추가할인 적용가 -->
          <p v-if="product.status.soldout!= true" class="sale_price">
            <strong>{{miliFormat(product.price.salePrice - product.price.immediateDiscountAmt - product.price.additionDiscountAmt)}}</strong>원</p>
          <p v-else class="sale_price disabled">
            <strong>일시품절</strong>
          </p>
          <!-- 판매가 -->
          <p class="normal_price" v-if="product.status.soldout== true"></p>
          <template v-else>
            <p v-if="product.price.immediateDiscountAmt != 0 || product.price.additionDiscountAmt !=0" class="normal_price">
              <span>{{miliFormat(product.price.salePrice)}}</span>원</p>
          </template>
          <!-- 단위별 가격 -->
          <p v-if="product.status.soldout == true" class="price_txt"></p>
          <p v-else-if="product.price.unitPrice" class="price_txt">({{product.price.unitName}}{{product.price.unitNameType}}당 {{miliFormat(product.price.unitPrice)}}원)</p>
          <p class="no_refundable" v-if="!product.limitations.refundable">환불불가</p>
        </template>
      </div>
      <div v-if="coupons && product.price.maxCouponAmt > 0" class="pv_i_coupon">
        <!-- 할인쿠폰 || 할인율 -->
        <div class="coupon_card">
          <a @click.prevent="openCouponView" href="javascript:;">
            <div class="coupon_card_txt">
              <p class="txt">{{couponValue()}} 할인 쿠폰 받기</p>
            </div>
            <div class="btn">VIEW</div>
          </a>
        </div>
      </div>
      <!-- coupon download popup -->
      <ProductCoupon></ProductCoupon>
      <!-- // coupon download popup -->
      <div class="pv_i_buy">
        <template v-if="product.status.saleStatusType  === 'ONSALE'">
          <!-- {{productDetail.baseInfo.getProDate}} -->
          <template v-if="productDetail.baseInfo.getProDate">
            <span class="time">{{productDetail.baseInfo.getProDate}}&nbsp;남음</span>
          </template>
          <template v-if="dateInfo">
            <zkTimeDown class="time" @time-end="isDisplay" :endTime='productDetail.baseInfo.saleEndYmdt'></zkTimeDown>
          </template>
        </template>
        <p v-if="product.status.saleStatusType  === 'READY'" class="time">
          {{getDateFormat(product.baseInfo.saleStartYmdt)}} 오픈예정
        </p>
        <p class="buy" v-if="product.stock.saleCnt >= 10">
          <span class="buy">{{miliFormat(product.stock.saleCnt)}}개 구매중</span>
        </p>
      </div>
    </div>

    <product-share :thisUrl="thisUrl" :product="product" />

    <ul class="pv_i_detail">
      <li v-if="product.deliveryFee">
        <dl>
          <dt>배송비</dt>
          <dd v-if="product.deliveryFee.deliveryConditionType ==='FREE'">
            {{product.deliveryFee.defaultDeliveryConditionLabel}}<br>
            <a @click.prevent="deliverNoticePop(true)" href="#" class="notice" v-if="product.deliveryFee.remoteDeliveryAreaFees.length > 0">
              도서산간지역추가배송비발생
            </a>
          </dd>
          <dd v-if="product.deliveryFee.deliveryConditionType ==='FIXED_FEE'">
            {{productDetail.deliveryFee.defaultDeliveryConditionLabel}}
            <template v-if="product.deliveryFee.deliveryPrePayment === false"> 착불</template>
            <a @click.prevent="deliverNoticePop(true)" href="#" class="notice" v-if="product.deliveryFee.remoteDeliveryAreaFees.length > 0">
              도서산간지역추가배송비발생
            </a>
          </dd>
          <dd v-if="product.deliveryFee.deliveryConditionType ==='CONDITIONAL'">
            {{miliFormat(product.deliveryFee.deliveryAmt)}}원 ({{miliFormat(product.deliveryFee.aboveDeliveryAmt)}}이상 구매 시 무료배송)
            <a @click.prevent="deliverNoticePop(true)" href="#" class="notice" v-if="product.deliveryFee.remoteDeliveryAreaFees.length > 0">
              도서산간지역추가배송비발생
            </a>
          </dd>
        </dl>
      </li>
      <li>
        <dl v-if="product.baseInfo.placeOriginLabel">
          <dt>원산지</dt>
          <dd>{{product.baseInfo.placeOriginLabel}}</dd>
        </dl>
        <dl v-if="productDetail.baseInfo.manufactureYmdt">
          <dt>제조일자</dt>
          <dd>{{productDetail.baseInfo.manufactureYmdt}}</dd>
        </dl>
        <dl v-if="productDetail.baseInfo.expirationYmdt">
          <dt>유효기간</dt>
          <dd>{{productDetail.baseInfo.expirationYmdt}}</dd>
        </dl>
      </li>
      <li>
        <dl v-if="product.limitations.minBuyCnt">
          <dt>구매제한</dt>
          <dd>최소 {{product.limitations.minBuyCnt}}개부터 구매가능</dd>
        </dl>
        <dl v-if="product.limitations.maxBuyPersonCnt !== 0 || product.limitations.maxBuyTimeCnt !== 0 || product.limitations.maxBuyDays !== 0">
          <dt>구매수량</dt>
          <dd>
            <template v-if="product.limitations.maxBuyPersonCnt !== 0">1인 구매 시 최대 {{product.limitations.maxBuyPersonCnt}}개까지 구매 가능</template>
            <template v-if="product.limitations.maxBuyTimeCnt !== 0">1회 구매 시 최대 {{product.limitations.maxBuyTimeCnt}}개까지 구매 가능</template>
            <template v-if="product.limitations.maxBuyDays !== 0">{{product.limitations.maxBuyDays}}일 동안 최대 {{product.limitations.maxBuyPeriodCnt}}개까지 구매 가능</template>
          </dd>
        </dl>
      </li>
    </ul>
    <ProductAddressList v-if=" addressListShow " @close="deliverNoticePop " :addressList="product.deliveryFee.remoteDeliveryAreaFees "></ProductAddressList>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { addClass } from '@/utils/utils'
import Slick from 'vue-slick'
import ProductCoupon from './ProductCoupon'
import ProductShare from './ProductShare'
import ProductAddressList from './ProductAddressList'
import { formatCurrency } from '@/utils/StringUtils'
import zkTimeDown from './zkTimeDown'
import { getDateFormatYMDHM } from '@/utils/dateUtils'
export default {
  data () {
    return {
      optionNo: 0,
      orderCnt: 0,
      pdoptions: {
        arrows: false,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 5000,
        initialSlide: 0
      },
      currentSlide: 1,
      openBannerModal: false,
      proCurrentDate: new Date().getTime(),
      couponPrice: '',
      addressListShow: false,
      couponValue: () => {
        if (this.coupons && this.coupons.length > 0) {
          const myArray = this.coupons.map(coupon => {
            if (coupon.discountInfo.discountAmt != null) {
              return coupon.discountInfo.discountAmt
            } else {
              return this.product.price.salePrice * (coupon.discountInfo.discountRate / 100)
            }
          })
          var couponIndex = myArray.indexOf(Math.max.apply(Math, myArray))
          if (this.coupons[couponIndex].discountInfo.discountAmt != null) {
            return formatCurrency(this.coupons[couponIndex].discountInfo.discountAmt) + '원'
          } else {
            return this.coupons[couponIndex].discountInfo.discountRate + '%'
          }
        }
        return ''
      }
    }
  },
  components: {
    Slick,
    ProductCoupon,
    ProductShare,
    ProductAddressList,
    zkTimeDown
  },
  methods: {
    closeLayer () {
      document.body.className = ''
    },
    getDateFormat (val) {
      return getDateFormatYMDHM(val)
    },
    openCouponView () {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        addClass(document.body, 'is_layer_open')
      }
    },
    afterChange (event, slick, currentSlide, nextSlide) {
      this.currentSlide = currentSlide + 1
    },
    deliverNoticePop (isOpen) {
      this.addressListShow = isOpen
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    isDisplay () {
      this.$store.commit('product/MODIFY_TIME')
      // this.product.dateInfo = false
    }
  },
  computed: {
    ...mapState('product', ['product', 'options', 'dateInfo']),
    ...mapState('coupon', ['coupons']),
    ...mapGetters('product', ['productDetail']),
    ...mapGetters('authentication', ['isAvailableMember']),
    milliseconds () {
      return new Date(this.productDetail.baseInfo.saleEndYmdt.replace(/-/g, '/')) - new Date()
    },
    thisUrl () {
      let url = ''
      if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'alpha') {
        url = `${location.protocol}//www.zzieut.net${this.$route.fullPath}`
      } else {
        url = `${location.protocol}//www.zzieut.net/${this.$route.fullPath}`
      }
      return url
    }
  }
}
</script>
<style>
.testButton {
  border: 2px solid #000;
  background: #d8d8d8;
}
.stick {
  float: right;
  border-radius: 10px;
  border: solid 1px rgb(180, 180, 180);
  margin-left: 5px;
  padding: 0px 10px;
}
</style>
