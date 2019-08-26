<template>
  <div class="productInquiry">
    <div class="pdt_qna">
      <div class="pdt_qna_top">
        <p class="txt">
          상품에 대해 궁금한 내용을 문의 주시면 검토 후 답변 해드립니다. <br> 구매한 상품의 취소/반품은 마이페이지에서 신청 가능합니다.
        </p>
        <div class="btn">
          <a class="btn_style1" @click.prevent="showAddPop">문의하기</a>
        </div>
      </div>
      <template v-if="!memberInquiry || memberInquiry.length === 0">
        <div class="tab_con" v-if="inquiryList && inquiryList.length > 0">
          <ul class="qna_list">
            <productInquiryItem v-for="inquiryItem in inquiryList" :key="inquiryItem.inquiryNo" :inquiryItem="inquiryItem" :inquiryTypes="productInquiryTypes"></productInquiryItem>
          </ul>
          <mugen-scroll :handler="pageDown" :should-handle="loading">
            <div id="loader" v-show="loading">
              <div class="loader_img"></div>
              <p class="loader_txt">불러오는 중입니다...</p>
            </div>
          </mugen-scroll>
        </div>
        <div class="no_review" v-else>
          <p>작성 된 상품문의가 없습니다</p>
        </div>
      </template>
      <template v-else>
        <template v-if="inquiryList && inquiryList.length > 0">
          <section class="pdt_qna_tab" id="qnaTab">
            <h2 class="tab_menu" v-bind:class="allShow?'is_open':''">
              <a id="btn_all_inquiry" @click.prevent="showAllInquiry">전체문의</a>
            </h2>
            <div class="tab_con" v-if="inquiryList">
              <ul class="qna_list">
                <productInquiryItem v-for="inquiryItem in inquiryList" :key="inquiryItem.inquiryNo" :inquiryItem="inquiryItem" :inquiryTypes="productInquiryTypes"></productInquiryItem>
              </ul>
              <mugen-scroll :handler="pageDown" :should-handle="loading">
                <div id="loader" v-show="loading">
                  <div class="loader_img"></div>
                  <p class="loader_txt">불러오는 중입니다...</p>
                </div>
              </mugen-scroll>
            </div>
            <h2 class="tab_menu" v-bind:class="allShow?'':'is_open'">
              <a id="btn_member_inquiry" @click.prevent="showMemberInquiry">내문의</a>
            </h2>
            <div class="tab_con" v-if="memberInquiry">
              <ul class="qna_list">
                <productInquiryItem v-for="inquiryItem in memberInquiry" :key="inquiryItem.inquiryNo" :inquiryItem="inquiryItem" :inquiryTypes="productInquiryTypes"></productInquiryItem>
              </ul>
              <mugen-scroll :handler="pageMemberDown" :should-handle="memberLoading">
                <div id="loader" v-show="memberLoading">
                  <div class="loader_img"></div>
                  <p class="loader_txt">불러오는 중입니다...</p>
                </div>
              </mugen-scroll>
            </div>
          </section>
        </template>
      </template>
    </div>
    <productInquiryPop v-show="showPopFlg" @closePop="closeAddPop" :inquiryTypes="productInquiryTypes" :productNo="this.$store.state.route.params.productId"></productInquiryPop>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import productInquiryItem from '@/components/productDetail/inquiry/ProductInquiryItem'
import productInquiryPop from '@/components/productDetail/inquiry/ProductInquiryPop'
import MugenScroll from 'vue-mugen-scroll'

export default {
  metaInfo: {
    title: '상품상세',
    bodyAttrs: {
      class: 'floating_bottom'
    }
  },
  data () {
    return {
      allShow: true,
      showPopFlg: false,
      inquiryNo: ''
    }
  },
  methods: {
    pageDown () {
      this.$store.dispatch('productinquiry/fetchMore')
    },
    pageMemberDown () {
      this.$store.dispatch('productinquiry/fetchMemberMore')
    },
    showMemberInquiry () {
      this.allShow = false
    },
    showAllInquiry () {
      this.allShow = true
    },
    showAddPop () {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        this.showPopFlg = true
      }
    },
    closeAddPop () {
      this.showPopFlg = false
    }
  },
  components: {
    MugenScroll,
    productInquiryItem,
    productInquiryPop
  },
  computed: {
    ...mapState('productinquiry', ['loading', 'inquiryList', 'memberInquiry', 'memberLoading']),
    ...mapGetters('common', ['productInquiryTypes']),
    ...mapGetters('authentication', ['isAvailableMember'])
  }
}
</script>

<style>
.productInquiry #loader {
  position: static;
  transform: none;
}
</style>
