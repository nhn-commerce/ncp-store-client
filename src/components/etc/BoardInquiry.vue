<template>
  <div id="contents" class="etc_wrap">
    <form action="">
      <fieldset>
        <legend class="acc-hidden">1:1문의하기 작성 폼</legend>
        <div class="cs_qna_write">
          <div class="order_info">
            <dl class="oi_w">
              <dt>
                <label for="inquiryTypeNoId">문의유형 선택</label>
              </dt>
              <dd>
                <select v-model="inquiryTypeNo" id="inquiryTypeNoId" ref="inquiryTypeNoFocus">
                  <option value="">선택하세요.</option>
                  <option v-for="inquiryTypeItem in inquiryTypes" :value="inquiryTypeItem.inquiryTypeNo" :key="inquiryTypeItem.inquiryTypeNo">
                    {{inquiryTypeItem.inquiryTypeName}}
                  </option>
                </select>
              </dd>
            </dl>
            <dl class="oi_w">
              <dt>
                <label for="inquiryTitleId">문의 제목</label>
              </dt>
              <dd>
                <input type="text" id="inquiryTitleId" v-model="inquiryTitle" placeholder="제목을 입력하세요." ref="inquiryTitleFocus" maxlength="200">
              </dd>
            </dl>
            <dl class="oi_w">
              <dt>
                <label for="inquiryContentId">문의 내용</label>
              </dt>
              <dd>
                <textarea id="inquiryContentId" v-model="inquiryContent" cols="30" rows="10" placeholder="문의내용을 입력하세요." ref="inquiryContentFocus" maxlength="2000"></textarea>
              </dd>
            </dl>

            <dl class="oi_w rvw_img">
              <dt>
                <label for="">사진첨부</label>
              </dt>
              <dd>
                <div class="file">
                  <template v-if="images.length > 0">
                    <div class="img" v-for="(image, key) in images " :key="key">
                      <img :src="image.filedata" alt="" @load="imageLoaded">
                      <a class="btn_del" v-on:click.prevent="delImage(key)">이미지 삭제</a>
                    </div>
                  </template>
                  <button class="file_btn" v-on:click="addPic" v-if="images.length < 10">이미지첨부</button>
                  <input type="file" @change="onFileChange" ref="flup" style="display: none;" accept="image/*" multiple="multiple" />
                </div>
                <p class="notice">사진은 최대 10장 까지 등록 가능 합니다.</p>
              </dd>
            </dl>

            <dl class="oi_w" v-if="boardInquireInfo">
              <dt>답변알림</dt>
              <dd class="qna_check" v-if="boardInquireInfo.telephoneNoflg">
                <div class="check_style1">
                  <input type="checkbox" id="checkSMS" v-model="answerSmsSendYn">
                  <label for="checkSMS">
                    <span></span>SMS 수신</label>
                </div>
                <div class="check_txt">
                  {{boardInquireInfo.telephoneNo1}}
                  <i class="char">-</i>{{boardInquireInfo.telephoneNo2}}
                  <i class="char">-</i>{{boardInquireInfo.telephoneNo3}}
                </div>
              </dd>
              <dd class="qna_check" v-if="boardInquireInfo.email">
                <div class="check_style1">
                  <input type="checkbox" id="checkEmail" v-model="answerEmailSendYn">
                  <label for="checkEmail">
                    <span></span>e메일 수신</label>
                </div>
                <div class="check_txt">{{boardInquireInfo.email}}</div>
              </dd>
            </dl>
            <dl class="oi_w">
              <dd class="qna_rule">
                <div class="rule_txt">
                  <!-- 수집된 개인정보는 (휴대폰 번호, 이메일) 문의내용 처리 및 고객 불만 해결을 위해 사용되며
                  <span class="txt_color444">전자상거래법에 따라 3년간 보관 후 삭제됩니다.</span> -->
                  수집하는 개인정보[(필수)문의내용], [(선택)이메일, 첨부파일]는
                  문의 내용 처리 및 고객 불만의 해결을 위해 사용되며, <strong class="size_13">관련 법령에 따라 3년간 보관 후 삭제됩니다. </strong>
                  문의 접수, 처리 및 회신을 위한 필요최소한의 개인정보이므로 동의를 해주셔야 서비스를 이용하실 수 있습니다.
                </div>
              </dd>
              <dd class="qna_check">
                <div class="check_style1 check_rule">
                  <input type="checkbox" id="checkRule" v-model="checkRuleYn">
                  <label for="checkRule">
                    <span></span>위, 개인정보 수집 및 이용에 동의합니다. </label>
                </div>
              </dd>
            </dl>
          </div>
          <div class="cs_qna_btn">
            <a @click.prevent="registInquery" class="btn_style1">1:1문의 등록</a>
          </div>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      inquiryTypeNo: '',
      inquiryContent: '',
      inquiryTitle: '',
      answerEmailSendYn: false,
      answerSmsSendYn: true,
      running: false,
      checkRuleYn: false,
      images: []
    }
  },
  metaInfo: {
    title: '1:1문의하기'
  },
  methods: {
    registInquery () {
      if (this.inquiryTypeNo === '') {
        alert('문의유형을 선택 해 주세요.')
        this.$refs.inquiryTypeNoFocus.focus()
        return
      }
      if (this.inquiryTitle === '') {
        alert('문의 제목을 입력 해 주세요.')
        this.$refs.inquiryTitleFocus.focus()
        return
      }
      if (this.inquiryContent === '') {
        alert('문의 내용을 입력 해 주세요.')
        this.$refs.inquiryContentFocus.focus()
        return
      }
      if (this.checkRuleYn === false) {
        alert('개인정보 수집 및 이용에 동의해주시기 바랍니다.')
        return
      }

      let sendMessage = ''
      if (!this.answerSmsSendYn && !this.answerEmailSendYn) {
        sendMessage = '등록하신 문의 답변을 SMS/메일로 받으실 수 없습니다. 등록하시겠습니까?'
      } else if (!this.answerSmsSendYn) {
        sendMessage = '등록하신 문의 답변을 SMS로 수신하실 수 없습니다. 등록하시겠습니까?'
      } else if (!this.answerEmailSendYn) {
        sendMessage = '등록하신 문의 답변을 메일로 받으실 수 없습니다. 등록하시겠습니까?'
      }
      if (!sendMessage || confirm(sendMessage)) {
        if (this.running) {
          return
        } else {
          this.running = true
        }
        let prefixContents = this.$store.state.route.query.prefixContents ? this.$store.state.route.query.prefixContents : ''
        if (prefixContents && prefixContents.length > 0) {
          prefixContents = prefixContents + '<br>'
        }
        const iparam = {
          inquiryTypeNo: this.inquiryTypeNo,
          inquiryContent: prefixContents + this.inquiryContent,
          inquiryTitle: this.inquiryTitle,
          answerEmailSendYn: this.answerEmailSendYn,
          answerSmsSendYn: this.answerSmsSendYn,
          images: this.images
        }

        const dispatch = this.$store.dispatch
        Promise.all(iparam.images.map((image) => {
          const data = new FormData()
          data.append('file', image.file)
          return dispatch('common/uploadImages', data)
        })).then(ret => {
          const urls = ret.map(res => res.data.imageUrl)
          iparam.uploadedFileName = urls
          iparam.originalFileName = urls
          this.$store.dispatch('profileinquiry/signInInquiries', iparam).then(ret => {
            alert('1:1문의가 완료 되었습니다.')
            window.location.href = '/etc/faq'
            this.running = false
          }).catch((e) => {
            this.running = false
          })
        })
      }
    },
    imageLoaded (event) {
      const imageDiv = $('.file_btn').eq(0).outerWidth()
      let maxWidth = document.body.clientWidth - 84
      const img = event.target
      if (img.naturalWidth >= 500 || img.naturalHeight >= 500) {
        let tempSize = 0
        if (img.naturalWidth > img.naturalHeight) {
          tempSize = img.naturalWidth
        } else {
          tempSize = img.naturalHeight
        }
        img.width = img.naturalWidth * imageDiv / maxWidth * (maxWidth / tempSize)
      } else {
        img.height = img.naturalHeight * imageDiv / maxWidth
      }
    },
    addPic (e) {
      e.preventDefault()
      this.$refs.flup.click()
      return false
    },
    onFileChange (e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      if ((files.length + this.images.length) > 10) {
        alert('사진은 최대 10장 까지 등록 가능 합니다.')
        return
      }
      this.createImage(files)
      e.target.value = ''
    },
    createImage (files) {
      if (typeof FileReader === 'undefined') {
        return false
      }
      let vm = this
      let leng = files.length
      for (let i = 0; i < leng; i++) {
        const fileitem = {}
        fileitem.file = files[i]
        let reader = new FileReader()
        reader.readAsDataURL(files[i])
        reader.onload = function (e) {
          fileitem.filedata = e.target.result
          vm.images.push(fileitem)
        }
      }
    },
    delImage (index) {
      let ret = confirm('사진을 삭제하시겠습니까?')
      if (ret) {
        this.images.splice(index, 1)
      }
    }
  },
  computed: {
    ...mapGetters('common', ['inquiryTypes']),
    ...mapGetters('profile', ['boardInquireInfo']),
    ...mapState('profile', ['profile'])
  },
  components: {
  }
}
</script>

<style>
.txt_color444 {
  font-size: 1.3rem;
  color: #444;
}
strong.size_13 {
  line-height: 2rem;
  font-size: 1.44rem
}
</style>
