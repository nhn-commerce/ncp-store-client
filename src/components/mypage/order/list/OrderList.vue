<template>
  <div id="contents" class="mypage_wrap">
    <div class="myorder_menu">
      <router-link to="/mypage/orderlist" class="is_curr">주문내역·배송조회</router-link>
      <router-link to="/mypage/cancellist">취소·반품 내역</router-link>
    </div>
    <!-- // myorder_menu -->
    <dl class="myorder_sch">
      <dt>기간조회</dt>
      <dd>
        <div class="period_sch">
          <a @click.prevent="getOrders('one_month')" :class="selectTypeFlg === 'one_month' ? 'is_curr' : ''">1개월</a>
          <a @click.prevent="getOrders('three_month')" :class="selectTypeFlg === 'three_month' ? 'is_curr' : ''">3개월</a>
          <a @click.prevent="getOrders('six_month')" :class="selectTypeFlg === 'six_month' ? 'is_curr' : ''">6개월</a>
        </div>
        <div class="monthly_sch" :class="showMonth ? 'is_open' : ''">
          <a @click.prevent="clickMonth">월별조회</a>
          <ul>
            <li v-for="(tempMonth,index) in sixMonths" :key="index">
              <a @click.prevent="getOrdersByMonth(index)" :class="Number(selectTypeFlg) === index ? 'is_curr' : ''">{{tempMonth}}</a>
            </li>
          </ul>
        </div>
      </dd>
    </dl>
    <!-- // myorder_sch -->
    <ul class="myorder_list" v-if="orders">
      <template v-if="totalCount > 0">
        <productInquiryPop v-show="showPopFlg" @closePop="closeAddPop" :inquiryTypes="productInquiryTypes" :productNo="inquiryProductNo"></productInquiryPop>
        <OrderItem v-for="item in orders" :key="item.orderNo" :item="item" :showOrderType="'ORDER'" @showAdd="showAddPop">
        </OrderItem>
        <mugen-scroll :handler="pageDown" :should-handle="loading">
          <div id="loader" v-show="loading">
            <div class="loader_img"></div>
            <p class="loader_txt">불러오는 중입니다...</p>
          </div>
        </mugen-scroll>
      </template>
      <template v-else>
        <li class="no_contents">
          <p>주문내역이 없습니다.</p>
        </li>
      </template>
    </ul>
    <template v-else>
      <div id="loader">
        <div class="loader_img"></div>
        <p class="loader_txt">불러오는 중입니다...</p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
import OrderItem from '@/components/mypage/order/list/OrderItem'
import productInquiryPop from '@/components/productDetail/inquiry/ProductInquiryPop'

export default {
  data () {
    return {
      showMonth: false,
      showPopFlg: false,
      inquiryProductNo: 0
    }
  },
  metaInfo: {
    title: '주문내역·배송조회'
  },
  name: 'OrderList',
  components: {
    MugenScroll,
    OrderItem,
    productInquiryPop
  },
  computed: {
    ...mapState('myorder', ['loading', 'totalCount', 'orders', 'sixMonths', 'oldOrder', 'selectTypeFlg']),
    ...mapGetters('common', ['productInquiryTypes'])
  },
  methods: {
    pageDown () {
      this.$store.dispatch('myorder/fetchMore')
    },
    getOrders (period) {
      this.showMonth = false
      this.$router.push({
        path: '/mypage/orderlist',
        query: {
          type: 'ORDER',
          period
        }
      })
    },
    getOrdersByMonth (month) {
      this.showMonth = false
      this.$router.push({
        path: '/mypage/orderlist',
        query: {
          type: 'ORDER',
          month
        }
      })
    },
    showAddPop (productNo) {
      this.inquiryProductNo = productNo
      this.showPopFlg = true
    },
    closeAddPop () {
      this.showPopFlg = false
    },
    clickMonth () {
      this.showMonth = !this.showMonth
    }
  }
}
</script>

<style>
.myorder_list #loader {
  position: static;
  transform: none;
}
</style>
