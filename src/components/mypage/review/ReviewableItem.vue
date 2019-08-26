<template>
  <li class="ctl_item">
    <!-- ctl_item_info -->
    <div class="ctl_item_info">
      <div class="ctl_photo">
        <router-link :to="`/product/${productReviewableitem.productNo}`">
          <img :src="productReviewableitem.imageUrl?productReviewableitem.imageUrl:''" alt="">
        </router-link>
      </div>
      <div class="ctl_txt_box">
        <p class="ctl_name">
          <strong>{{productReviewableitem.brandName}}</strong>
          <router-link :to="`/product/${productReviewableitem.productNo}`">{{productReviewableitem.productName}}</router-link>
        </p>
        <div class="ctl_option">
          <span v-for="showOption in productReviewableitem.showOptions" :key="showOption.index">{{showOption}}</span>
        </div>
        <div class="ctl_price">
          <div class="ctl_p_top">
            <p class="total">
              <strong>{{miliFormat(productReviewableitem.price.salePrice)}}</strong>원</p>
          </div>
        </div>
      </div>
    </div>
    <!-- // ctl_item_info -->
    <div class="ctl_item_bottom">
      <strong v-for="orderStatusType in orderStatusTypes" :key="orderStatusType.value" v-if="orderStatusType.value===productReviewableitem.orderStatusType">
        {{orderStatusType.label}}
      </strong>
      <div class="btn_box btn_1">
        <a @click.prevent="addproductReview" class="btn_style4">상품평 작성</a>
      </div>
    </div>
  </li>
</template>
<script>
import { formatCurrency } from '@/utils/StringUtils'
export default {
  data () {
    return {
    }
  },
  props: ['productReviewableitem', 'orderStatusTypes'],
  methods: {
    miliFormat (num) {
      return formatCurrency(num)
    },
    addproductReview () {
      const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
      this.$router.push({
        path: '/mypage/addreview/' + this.productReviewableitem.orderNo + '/' + this.productReviewableitem.orderOptionNo,
        query: {
          fromUrl: thisUrl
        }
      })
    }
  },
  components: {
  },
  computed: {
  }
}
</script>

<style>

</style>


