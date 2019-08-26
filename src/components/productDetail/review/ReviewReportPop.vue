<template>
  <div id="layerPopup" style="position: fixed;left: 0px;top: 0px;width: 0px;height: 0px;z-index: 999999;">
    <div id="reviewReportPopBg" style="background-color:black; filter: alpha(opacity=0); -khtml-opacity:0; -moz-opacity:0; opacity:0; width:100%; height: 100%; position:fixed; left:0; top:0; ">&nbsp;</div>
    <div id="reviewReportPop" class="_layer_content _text" style="position:fixed; " data-type="text">
      <div class="basic_popup review_report_popup">
        <div class="popup_wrap">
          <div class="popup_inner">
            <div class="popup_title">
              <h3>상품평 신고하기</h3>
            </div>
            <div class="review_report">
              <form>
                <fieldset>
                  <ul class="rv_report_check">
                    <dt>신고유형 선택</dt>
                    <dd>
                      <div class="radio_style1" v-for="(report, index) in productReviewReportTypes" :key="index">
                        <input type="radio" :id="'report' + index" name="report" :value="report.value" v-model="reportReasonCd">
                        <label :for="'report' + index ">
                          <span></span>{{report.label}}</label>
                      </div>
                    </dd>
                  </ul>
                  <div class="rv_report_txt">
                    <textarea v-model="content" ref="rvReportContentFocus" maxlength="300" placeholder="구체적인 신고사유를 입력하세요."></textarea>
                  </div>
                </fieldset>
              </form>
              <div class="btn_box">
                <a class="btn_style3" @click.prevent="close">취소</a>
                <a class="btn_style1" @click.prevent="reportPost">확인</a>
              </div>
            </div>
            <button type="button" class="btn_close" id="closeBtn1" @click="close">팝업 닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      running: false,
      reportReasonCd: 'SLANDER',
      content: ''
    }
  },
  props: ['reviewNo', 'productReviewReportTypes'],
  methods: {
    reportPost () {
      const reportparam = {
        productNo: this.$store.state.route.params.productId,
        reviewNo: this.reviewNo,
        reportReasonCd: this.reportReasonCd,
        content: this.content
      }
      if (reportparam.content.trim() === '' && reportparam.content.trim().length === 0) {
        alert('신고사유를 입력 해 주세요')
        this.$refs.rvReportContentFocus.focus()
        return
      }
      if (this.running) {
        return
      } else {
        this.running = true
      }
      this.$store.dispatch('productreview/postProductReviewsReport', reportparam).then(() => {
        alert('신고가 접수되었습니다. 검토 후 조치 해 드리겠습니다.')
        this.content = ''
        this.reportReasonCd = 'SLANDER'
        this.running = false
        this.$emit('closePop')
      }).catch((e) => {
        this.running = false
      })
    },
    close () {
      const ret = confirm('상품평 신고를 취소하시겠습니까?')
      if (ret) {
        this.content = ''
        this.running = false
        this.reportReasonCd = 'SLANDER'
        this.$emit('closePop')
      }
    }
  }
}
</script>

