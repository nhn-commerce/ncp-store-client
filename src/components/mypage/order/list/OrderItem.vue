<template>
  <li>
    <div class="my_odl_top">
      <h3 class="info">{{item.showYmd}} (주문번호 :
        <strong>{{item.orderNo}}</strong>)</h3>
      <a @click.prevent="showOrderDetail" class="btn_view">주문상세보기</a>
    </div>
    <ul class="my_odl_box">
      <template v-if="showOrderType === 'ORDER'">
        <OrderOption v-for="option in item.orderOptions" :key="option.orderOptionNo" :option="option" @showAdd="showAddPop" v-if="!option.claimStatusType"/>
      </template>
      <template v-if="showOrderType === 'CANCEL'">
        <OrderOption v-for="option in item.orderOptions" :key="option.orderOptionNo" :option="option" @showAdd="showAddPop" v-if="option.claimStatusType"/>
      </template>
    </ul>
  </li>
</template>

<script>
  import OrderOption from '@/components/mypage/order/OrderOption'

  export default {
    props: ['item', 'showOrderType', 'claimNos'],
    components: {
      OrderOption
    },
    methods: {
      showAddPop (productNo) {
        this.$emit('showAdd', productNo)
      },
      showOrderDetail () {
        window.location.href = '/mypage/orderdetail/' + this.item.orderNo
      }
    }
  }
</script>

<style>

</style>
