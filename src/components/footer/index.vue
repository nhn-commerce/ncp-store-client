<template>
  <footer id="footer" v-show="!page.initDataFetching">
    <div class="footer_link">
      <div class="fl_inner">
        <router-link to="/etc/agree" active-class="is_selected">이용약관</router-link>
        <router-link to="/etc/privacy" active-class="is_selected" style="font-weight: bold;">개인정보처리방침</router-link>
        <a target="_blank" @click.prevent="openView">사업자정보확인</a>
        <a @click.prevent="maillTo">입점문의</a>
      </div>
    </div>
    <div class="footer_info" v-if="footerInfo">
      <address class="address">
        <dl class="customer">
          <dt>
            <router-link :to="`/etc/faq`">고객센터</router-link>
          </dt>
          <dd>
            <em>대표전화 </em>
            <a @click.prevent="call">{{ footerInfo.phoneNo }}</a>
          </dd>
          <dd>
            <em>상담시간 </em>월 ~ 금, 오전 10시 ~ 오후 7시</dd>
          <dd>
            <em>e메일 </em>
            <a @click.prevent="maillTo">{{ footerInfo.email }}</a>
          </dd>
        </dl>
        <dl>
          <dt>상호</dt>
          <dd>{{ footerInfo.companyName }}</dd>
        </dl>
        <dl>
          <dt>대표</dt>
          <dd>{{ footerInfo.representativeName }}</dd>
        </dl>
        <dl>
          <dt>주소</dt>
          <dd>
            {{ footerInfo.zipCd }} {{ footerInfo.address }} <br> {{ footerInfo.addressDetail }}
          </dd>
        </dl>
      </address>
      <div class="registration">
        <dl>
          <dt>개인정보관리 책임자</dt>
          <dd>{{ footerInfo.privacyManagerName }}</dd>
        </dl>
        <dl>
          <dt>통신판매업신고번호</dt>
          <dd>{{ footerInfo.onlineMarketingBusinessDeclarationNo }}</dd>
        </dl>
        <dl>
          <dt>사업자 등록번호</dt>
          <dd>{{ footerInfo.businessRegistrationNo }}</dd>
        </dl>
      </div>
      <p class="notice">
        {{ footerInfo.mallName }}은 통신판매중개자로서 통신판매의 당사자가 아니며, <br> 광고, 상품주문, 배송 및 환불의 의무와 책임은 각 판매업체에 있습니다.
      </p>
      <p class="copyright">ⓒ NHN Corp.All rights reserved.</p>
    </div>
    <back-button></back-button>
    <go-top-button></go-top-button>
  </footer>
</template>

<script>
import BackButton from './BackButton'
import GoTopButton from './GoTopButton'
import { mapState, mapGetters } from 'vuex'
import config from '@/config'

export default {
  components: {
    BackButton,
    GoTopButton
  },
  computed: {
    ...mapState(['page']),
    ...mapGetters('common', ['footerInfo'])
  },
  methods: {
    openView () {
      const href = 'http://www.ftc.go.kr/info/bizinfo/communicationView.jsp?apv_perm_no=2013378021930201084&area1=&area2=&currpage=1&searchKey=04&searchVal=1448115549&stdate=&enddate='
      if (this.$store.state.osType() === 'WEB') {
        window.open(href)
      } else {
        window.location.href = `${config.urlScheme}://newBrowser?url=` + encodeURIComponent(href)
      }
    },
    maillTo () {
      if (this.footerInfo) {
        if (this.$store.state.osType() !== 'AOS') {
          window.location.href = `mailto:${this.footerInfo.email}`
        } else {
          alert(`메일(${this.footerInfo.email})로 문의해주세요.`)
        }
      }
    },
    call () {
      if (this.footerInfo) {
        window.location.href = `tel:${this.footerInfo.phoneNo}`
      }
    }
  }
}
</script>
