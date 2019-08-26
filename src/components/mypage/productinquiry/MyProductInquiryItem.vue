<template>
  <li class="qna_card" v-bind:class="myInquiryItem.secreted?'secret':''">
    <dl class="qc_q" v-bind:class="isModify?'is_modify':''">
      <dt>Q</dt>
      <dd class="qc_q_top">
        <div class="type" v-for="inquiryType in inquiryTypes" :key="inquiryType.value" v-if="inquiryType.value===myInquiryItem.type">
          [{{inquiryType.label}}]
        </div>
        <div class="info">
          <span class="date">{{myInquiryItem.showDate}}</span>
        </div>
      </dd>
      <div class="qc_q_product">
        <router-link :to="`/product/${myInquiryItem.productNo}`">
          <div class="photo">
            <img :src="myInquiryItem.imageUrl?myInquiryItem.imageUrl:''" alt="">
          </div>
          <div class="txt_box">
            <strong>{{myInquiryItem.brandName}}</strong>
            <p>
              {{myInquiryItem.productName}}
            </p>
          </div>
        </router-link>
      </div>
      <dd class="qc_q_txt">
        <pre class="txt" v-text="myInquiryItem.content">
        </pre>
        <div class="btn" v-if="!myInquiryItem.answers">
          <a @click.prevent="showModify" class="btn_style3 btn_modify">수정</a>
          <a @click.prevent="deleteInquiry" class="btn_style1">삭제</a>
        </div>
      </dd>
      <dd class="qc_q_modify">
        <textarea v-model="newContent" maxlength="300"></textarea>
        <div class="btn">
          <a @click.prevent="registInquery" class="btn_style3 btn_done">수정완료</a>
          <a @click.prevent="closeModify" class="btn_style1">수정취소</a>
        </div>
      </dd>
    </dl>
    <div v-if="myInquiryItem.answers">
      <div v-for="answersitem in myInquiryItem.answers" :key="answersitem.inquiryNo">
        <dl class="qc_a">
          <dt>A</dt>
          <dd class="qc_a_top">
            <div class="type">{{ answersitem.showRespondentName }}</div>
            <div class="info">
              <span class="date">{{answersitem.showAnswersYmdt}}</span>
            </div>
          </dd>
          <dd class="qc_a_txt">
            <pre v-text="answersitem.content" />
          </dd>
        </dl>
      </div>
    </div>
    <div v-if="!myInquiryItem.answers">
      <dl class="qc_a">
        <dt>A</dt>
        <dd class="qc_a_top">
          <div class="type">{{mallName}}</div>
          <div class="info">
            <span class="notice">답변 검토중입니다.</span>
          </div>
        </dd>
      </dl>
    </div>
  </li>
</template>
<script>
import config from '@/config'

export default {
  data () {
    return {
      isModify: false,
      newContent: '',
      mallName: config.mallName
    }
  },
  props: ['myInquiryItem', 'inquiryTypes'],
  methods: {
    showModify () {
      this.isModify = true
      this.newContent = this.myInquiryItem.content
    },
    closeModify () {
      this.isModify = false
    },
    deleteInquiry () {
      let ret = confirm('문의글을 삭제하시겠습니까?')
      if (ret) {
        const deleteparams = {
          inquiryNo: this.myInquiryItem.inquiryNo
        }
        this.$store.dispatch('productinquiry/deleteMyProductInquiry', deleteparams)
      }
    },
    registInquery () {
      let ret = confirm('문의 글 수정을 완료하시겠습니까?')
      if (ret) {
        const updateparams = {
          inquiryNo: this.myInquiryItem.inquiryNo,
          title: this.myInquiryItem.title,
          content: this.newContent,
          secreted: this.myInquiryItem.secreted,
          type: this.myInquiryItem.type
        }
        this.$store.dispatch('productinquiry/putMyProductInquiry', updateparams)
        this.isModify = !this.isModify
      }
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
