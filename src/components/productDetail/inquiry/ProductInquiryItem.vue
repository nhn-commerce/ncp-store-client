<template>
  <li class="qna_card" :class="inquiryItem.secreted ? 'secret' : ''">
    <dl class="qc_q" v-bind:class="isModify?'is_modify':''">
      <dt>Q</dt>
      <dd class="qc_q_top">
        <div class="type" v-for="inquiryType in inquiryTypes" :key="inquiryType.value" v-if="inquiryType.value===inquiryItem.type">
          [{{inquiryType.label}}]
        </div>
        <div class="info">
          <span class="name">{{inquiryItem.showMemberId}}</span>
          <span class="date">{{inquiryItem.showDate}}</span>
        </div>
      </dd>
      <dd class="qc_q_txt">
        <div v-if="inquiryItem.administrator === false && inquiryItem.myInquiry === false && inquiryItem.secreted === true" class="txt">비공개 문의 입니다.</div>
        <pre v-else class="txt" v-text="inquiryItem.content" />
        </div>
        <div class="btn" v-if="!inquiryItem.answers && inquiryItem.selfFlg">
          <a @click.prevent="showModify" class="btn_style3 btn_modify">수정</a>
          <a @click.prevent="deleteInquiry" class="btn_style1">삭제</a>
        </div>
      </dd>
      <dd class="qc_q_modify">
        <textarea v-model="newContent" maxlength="300"></textarea>
        <div class="btn">
          <a @click.prevent="updateInquiry" class="btn_style3 btn_done">수정완료</a>
          <a @click.prevent="closeModify" class="btn_style1">수정취소</a>
        </div>
      </dd>
    </dl>
    <template v-if="inquiryItem.answers">
      <template v-for="answersitem in inquiryItem.answers">
        <dl class="qc_a" :key="answersitem.inquiryNo">
          <dt>A</dt>
          <dd class="qc_a_top">
            <div class="type">{{ answersitem.showRespondentName }}</div>
            <div class="info">
              <span class="date">{{answersitem.showAnswersYmdt}}</span>
            </div>
          </dd>
          <dd v-if="inquiryItem.administrator === false && inquiryItem.myInquiry === false && inquiryItem.secreted === true" class="qc_a_txt">비공개 문의 입니다.</dd>
          <dd v-else class="qc_a_txt">
            <pre v-text="answersitem.content" />
          </dd>
        </dl>
      </template>
    </template>
  </li>
</template>

<script>
export default {
  data () {
    return {
      isModify: false,
      newContent: ''
    }
  },
  props: ['inquiryItem', 'inquiryTypes'],
  components: {
  },
  methods: {
    showModify () {
      this.newContent = this.inquiryItem.content
      this.isModify = true
    },
    closeModify () {
      if (confirm('수정을 취소하시겠습니까? 편집 한 내용은 저장되지 않습니다. ')) {
        this.isModify = false
      }
    },
    updateInquiry () {
      if (this.newContent.length === 0) {
        alert('문의 글 내용을 입력 해 주세요')
        return
      }
      if (confirm('수정 한 내용으로 저장하시겠습니까?')) {
        const updateparams = {
          inquiryNo: this.inquiryItem.inquiryNo,
          title: this.inquiryItem.title,
          content: this.newContent,
          secreted: this.inquiryItem.secreted,
          type: this.inquiryItem.type,
          productNo: this.$store.state.route.params.productId
        }
        this.$store.dispatch('productinquiry/putProductInquiry', updateparams)
        this.isModify = ''
      }
    },
    deleteInquiry () {
      if (confirm('상품문의를 삭제하시겠습니까?')) {
        const deleteparams = {
          inquiryNo: this.inquiryItem.inquiryNo,
          productNo: this.inquiryItem.productNo
        }
        this.$store.dispatch('productinquiry/deleteProductInquiry', deleteparams).then(() => {
          this.$store.dispatch('product/fetchProduct', { productNo: this.inquiryItem.productNo, preview: false })
        })
        alert('상품문의가 삭제 되었습니다.')
        this.$emit('closePop')
      }
    }
  }
}
</script>
