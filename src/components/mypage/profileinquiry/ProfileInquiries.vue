<template>
  <div class="mypage_wrap">
    <div class="my_qna" v-if="inquiries">
      <template v-if="inquiries.length > 0">
        <ul class="qna_list">
          <myInquiryItem v-for="myInquiryItem in inquiries" :key="myInquiryItem.inquiryNo" :myInquiryItem="myInquiryItem">
          </myInquiryItem>
        </ul>
        <mugen-scroll :handler="pageDown" :should-handle="loading">
          <div id="loader" v-show="loading">
            <div class="loader_img"></div>
            <p class="loader_txt">불러오는 중입니다...</p>
          </div>
        </mugen-scroll>
      </template>
      <div v-if="inquiries && inquiries.length === 0" class="no_contents">
        <p>1:1 문의내역이 없습니다.</p>
      </div>
    </div>
    <template v-else>
      <div id="loader">
        <div class="loader_img"></div>
        <p class="loader_txt">불러오는 중입니다...</p>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import MugenScroll from 'vue-mugen-scroll'
import myInquiryItem from '@/components/mypage/profileinquiry/ProfileInquiryItem'
export default {
  data () {
    return {
    }
  },
  metaInfo: {
    title: '1:1문의 내역'
  },
  methods: {
    pageDown () {
      this.$store.dispatch('profileinquiry/fetchInquiriesMore')
    }
  },
  computed: {
    ...mapState('profileinquiry', ['inquiries', 'loading'])
  },
  components: {
    myInquiryItem,
    MugenScroll
  }
}
</script>

<style>
.my_qna #loader {
  position: static;
  transform: none;
}
</style>