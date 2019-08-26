<template>
  <div id="layerPopup" style="position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; z-index: 999999;">
    <div id="qnaWritePopBg" style="background-color:black; filter: alpha(opacity=0); -khtml-opacity:0; -moz-opacity:0; opacity:0; width:100%; height: 100%; position:fixed; left:0; top:0; ">&nbsp;</div>
    <div id="qnaWritePop" class="_layer_content _text" style="position:fixed; " data-type="text">
      <div class="basic_popup qna_write_popup">
        <div class="popup_wrap">
          <div class="popup_inner">
            <div class="popup_title">
              <h3>상품문의 작성하기</h3>
            </div>
            <div class="qna_write">
              <form>
                <fieldset>
                  <dl class="qw_select">
                    <dt>문의유형 선택</dt>
                    <dd>
                      <div class="select_box no_over" v-bind:class="showTypeFlg?'open_select_list':''">
                        <a @click.prevent="clickType">{{type.label}}</a>
                        <ul>
                          <inquiryType v-for="inquiryType in inquiryTypes" :key="inquiryType.value" :inquiryType="inquiryType" @selectedType="selectedInquiryType"></inquiryType>
                        </ul>
                      </div>
                    </dd>
                  </dl>
                  <div class="qw_inp" id="qwInp" @click="showContent">
                    <div class="qw_placeholder" v-if="showContentFlg">
                      <p>
                        <i>*</i>광고, 저작권 침해, 욕설, 비방, 음란 등 문의와 관계없는 글은 임의 삭제가 됨을 알려드립니다. </p>
                      <p>
                        <i>*</i>전화번호, 메일 주소 등 고객님의 소중한 개인정보를 남기지 않도록 주의하세요. </p>
                    </div>
                    <textarea cols="30" rows="10" v-model="content" class="inp" @blur="contentblurEdit" @focus="contentfocusEdit" maxlength="300" ref="content"></textarea>
                  </div>
                  <div class="check_box check_style1">
                    <input type="checkbox" id="check1" v-model="secreted">
                    <label for="check1">
                      <span></span>비공개
                    </label>
                  </div>
                </fieldset>
              </form>
              <div class="btn_box">
                <a class="btn_style3" @click.prevent="close('close')">취소</a>
                <a class="btn_style1" @click.prevent="registerInquiry">확인</a>
              </div>
            </div>
            <button type="button" class="btn_close" id="closeBtn1" @click="close('close')">팝업 닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import inquiryType from '@/components/productDetail/inquiry/InquiryType'

export default {
  data () {
    return {
      running: false,
      type: {
        label: '상품',
        value: 'PRODUCT'
      },
      secreted: false,
      content: '',
      showTypeFlg: false,
      showContentFlg: true
    }
  },
  props: ['inquiryTypes', 'productNo'],
  components: {
    inquiryType
  },
  methods: {
    registerInquiry () {
      if (this.content.trim() === '' && this.content.trim().length === 0) {
        this.$refs.content.focus()
        alert('문의 글 내용을 입력 해 주세요')
        return
      }
      const inquiry = {
        type: this.type.value,
        secreted: this.secreted,
        content: this.content,
        productNo: this.productNo,
        title: '',
        parentInquiryNo: 0
      }
      if (this.running) {
        return
      } else {
        this.running = true
      }
      this.$store.dispatch('productinquiry/postProductInquiry', inquiry).then(() => {
        alert('문의 글이 등록되었습니다. 검토 후 답변 해 드리겠습니다.')
        this.$store.dispatch('product/fetchProduct', { productNo: this.productNo, preview: false })
        this.running = false
        this.close('')
      }).catch((e) => {
        this.running = false
      })
    },
    close (type) {
      if (type === 'close') {
        let ret = confirm('상품문의 작성을 취소하시겠습니까?')
        if (ret) {
          this.type = {
            label: '상품',
            value: 'PRODUCT'
          }
          this.secreted = false
          this.running = false
          this.showContentFlg = true
          this.content = ''
          this.$emit('closePop')
        }
      } else {
        this.type = {
          label: '상품',
          value: 'PRODUCT'
        }
        this.secreted = false
        this.running = false
        this.showContentFlg = true
        this.content = ''
        this.$emit('closePop')
      }
    },
    clickType () {
      this.showTypeFlg = !this.showTypeFlg
    },
    closeType () {
      this.showTypeFlg = false
    },
    showContent () {
      this.showContentFlg = false
      this.$refs.content.focus()
    },
    contentfocusEdit () {
      this.showContentFlg = false
    },
    contentblurEdit () {
      if (this.content.length === 0) {
        this.showContentFlg = true
      }
    },
    selectedInquiryType (inquiryType) {
      this.showTypeFlg = false
      this.type = inquiryType
    }
  }
}
</script>

<style>

</style>
