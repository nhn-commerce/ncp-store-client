<template>
  <a class="card_item" @click.prevent="sendClick" v-if="!product.soldout && product.saleFlg">
    <div class="card_photo">
      <template v-if="adult_flg">
        <img src="../../../assets/images/sub/img_19.jpg" />
      </template>
      <template v-else>
        <img v-if="product.listImageUrls && product.listImageUrls[0]" :src="product.listImageUrls[0]" />
        <img v-else src="../../../assets/images/content/buywow_default.jpg" />
      </template>
      <Countdown :time="product.endTime" :interval="1000" tag="p" class="card_time" v-if="product.within30Days">
        <template scope="props">남은시간
          <strong v-if="product.overDay">
            {{ props.hours | pad(2) }}
            <span>:</span>{{ props.minutes | pad(2) }}
            <span>:</span>{{ props.seconds | pad(2) }}
          </strong>
          <template v-else>
            <strong>{{props.days}}</strong>일
          </template>
        </template>
      </Countdown>
    </div>
    <div class="card_txt_box">
      <p class="card_brand">{{product.brandName}}</p>
      <p class="card_name">{{product.productName}}</p>
      <div class="card_price">
        <p class="discount" v-if="product.showDiscount > 0">
          <strong>{{product.showDiscount}}</strong>%
        </p>
        <p class="sale_price">
          <strong>{{product.showPrice}}</strong>원
        </p>
      </div>
      <div class="card_info" v-if="(product.newStickers && product.newStickers.length > 0) || product.saleCnt >= 10">
        <div class="card_tag">
          <span v-for="sticker in product.newStickers" :key="sticker">{{sticker}}</span>
        </div>
        <div class="card_buy" v-if="product.saleCnt >= 10">{{ product.saleCnt | formatNumber }} 구매</div>
      </div>
    </div>
  </a>
  <a :class="['card_item' , {'card_soldout' : product.soldout}]" @click.prevent="sendClick" v-else>
    <!-- 솔드 아웃 시 card_soldout -->
    <div class="card_photo">
      <template v-if="adult_flg">
        <img src="../../../assets/images/sub/img_19.jpg" />
      </template>
      <template v-else>
        <img v-if="product.listImageUrls && product.listImageUrls[0]" :src="product.listImageUrls[0]" />
        <img v-else src="../../../assets/images/content/buywow_default.jpg" />
      </template>
      <!-- soldout 텍스트 -->
      <span class="soldout" v-if="product.soldout">
        <em>SOLD OUT</em>
      </span>
      <!-- // soldout 텍스트 -->
    </div>
    <div class="card_txt_box">
      <p class="card_brand">{{product.brandName}}</p>
      <p class="card_name">{{product.productName}}</p>
      <div class="card_price" v-if="!product.soldout">
        <p class="discount" v-if="product.showDiscount > 0">
          <strong>{{product.showDiscount}}</strong>%
        </p>
        <p class="sale_price">
          <strong>{{product.showPrice}}</strong>원
        </p>
      </div>
      <p class="card_txt" v-if="product.soldout">매진되었습니다. 감사합니다.</p>
      <p class="card_txt" v-else>{{product.saleYmdt}}에 오픈됩니다!</p>
    </div>
  </a>
</template>

<script>
import Countdown from '@/components/common/Countdown'
import cookies from 'js-cookie'

export default {
  props: ['product'],
  methods: {
    sendClick () {
      if (!this.product.soldout) {
        this.$router.push({
          path: '/product/' + this.product.productNo
        })
      }
    }
  },
  components: {
    Countdown
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
