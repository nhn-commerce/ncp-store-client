<template>
  <li class="ctl_item">
    <!-- ctl_item_info -->
    <div class="ctl_item_info">
      <div class="ctl_photo">
        <router-link :to="`/product/${option.productNo}`">
          <img v-if="option.imageUrl" :src="option.imageUrl" />
          <img v-else src="../../../assets/images/content/buywow_default.jpg" />
        </router-link>
      </div>
      <div class="ctl_txt_box">
        <p class="ctl_name">
          <strong>{{option.brandName}}</strong>
          <router-link :to="`/product/${option.productNo}`">
            {{option.productName}}
          </router-link>
        </p>
        <div class="ctl_option">
          <span v-for="showOption in option.showOptions" :key="showOption.index">{{showOption}}</span>
        </div>
        <div class="ctl_price">
          <div class="ctl_p_top">
            <p class="total">
              <strong>{{option.showPrice}}</strong>원
            </p>
            <a @click.prevent="showAddPop" class="btn_qna" v-if="!noneMember">문의하기</a>
          </div>
        </div>
      </div>
    </div>
    <!-- // ctl_item_info -->
    <OrderButton :option="option" :noneMember="noneMember"></OrderButton>
  </li>
</template>

<script>
  import OrderButton from '@/components/mypage/order/OrderButton'

  export default {
    data () {
      return {
        showPopFlg: false
      }
    },
    props: ['option', 'noneMember'],
    components: {
      OrderButton
    },
    methods: {
      showAddPop () {
        this.$emit('showAdd', this.option.productNo)
      }
    }
  }
</script>

<style>

</style>
