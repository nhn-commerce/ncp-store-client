<template>
  <div id="contents" class="etc_wrap">
    <form action="">
      <fieldset>
        <legend class="acc-hidden">자주하는 질문 검색 폼</legend>
        <div class="faq_search">
          <input type="text" placeholder="검색어를 입력하세요." v-model="keyword" ref="keywordFocus" @keypress.enter.prevent="getBoardsBykeyword()">
          <a class="btn_style3 btn_sch" @click.prevent="getBoardsBykeyword()">검색</a>
        </div>
      </fieldset>
    </form>
    <!-- // faq_search -->
    <div class="faq_menu" v-if="boardsArticlesCategorys && boardsCategorys && keywordflg">
      <a :class="{'is_curr':categoryNo === 0}" @click.prevent="getBoards(0)">전체</a>
      <!-- 현재 카테고리 클래스 is_curr -->
      <template v-for="(item, key) in boardsCategorys">
        <a :key="key" :class="{'is_curr':categoryNo === item.categoryNo}" @click.prevent="getBoards(item.categoryNo)">{{item.label}}</a>
      </template>
      <a v-if="(boardsCategorys.length+1)%3===2" style="height:4.1rem"></a>
      <template v-if="(boardsCategorys.length+1)%3===1">
        <a style="height:4.1rem"></a>
        <a style="height:4.1rem"></a>
      </template>
    </div>
    <div class="faq_con_top" v-if="boardsArticlesCategorys && boardsArticlesCategorys.items.length > 0 && !keywordflg">
      <h3 class="title title_style2">
        <strong>{{keywordSearch}}</strong> 검색결과</h3>
      <a @click.prevent="cleankeyword()" class="btn_style4 btn_reset">초기화</a>
    </div>
    <div class="faq_con" v-if="boardsArticlesCategorys && boardsArticlesCategorys.items.length === 0 ">
      <div class="faq_con_top">
        <h3 class="title title_style2">
          <strong>{{keywordSearch}}</strong> 검색결과가 없습니다.</h3>
        <a @click.prevent="cleankeyword()" class="btn_style4 btn_reset">초기화</a>
      </div>
    </div>
    <!-- faq_menu -->
    <div class="faq_list" v-if="boardsArticlesCategorys && boardsArticlesCategorys.items.length > 0">

      <template v-for="categoryItem in boardsArticlesCategorys.items">
        <dl :class="{'is_open':boardItem.display && boardItem.item.articleNo === categoryItem.articleNo}" :key="categoryItem.articleNo">
          <dt>
            <a @click.prevent="getBoardDetail(categoryItem.articleNo)">{{categoryItem.title}}</a>
          </dt>
          <dd v-if="boardItem.item" v-html="boardItem.item.content">
          </dd>
        </dl>
      </template>
    </div>
    <div class="floating_faq_btn">
      <div class="faq_btn">
        <a class="btn_style3" @click.prevent="callOk()">
          <span>고객센터 전화하기</span>
        </a>
        <a class="btn_style1" @click.prevent="toInquire()">
          <span>1:1 문의하기</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import config from '@/config'

export default {
  data () {
    return {
      keyword: '',
      keywordSearch: '',
      keywordflg: true,
      categoryNo: 0
    }
  },
  metaInfo: {
    title: '자주하는질문'
  },
  methods: {
    getBoardDetail (articleNo) {
      const boardParams = {
        boardNo: config.faqBoardNo,
        articleNo: articleNo
      }
      this.$store.dispatch('display/getBoardDetail', boardParams)
    },
    getBoards (categoryNo) {
      const boardParams = {
        boardNo: config.faqBoardNo,
        keyword: this.keyword
      }
      if (categoryNo && categoryNo > 0) {
        boardParams.categoryNo = categoryNo
        this.categoryNo = categoryNo
      } else {
        this.categoryNo = 0
      }
      this.$store.dispatch('display/boardsArticlesCategorys', boardParams)
    },
    cleankeyword () {
      this.keyword = ''
      this.categoryNo = 0
      this.keywordSearch = ''
      this.keywordflg = true
      const boardParams = {
        boardNo: config.faqBoardNo,
        keyword: this.keyword
      }
      this.$store.dispatch('display/boardsArticlesCategorys', boardParams)
    },
    getBoardsBykeyword () {
      if (this.keyword === '') {
        alert('검색어를 입력하세요')
        this.$refs.keywordFocus.focus()
        return
      }
      const boardParams = {
        boardNo: config.faqBoardNo,
        keyword: this.keyword
      }
      this.$store.dispatch('display/boardsArticlesCategorys', boardParams)
      this.keywordflg = false
      this.keywordSearch = this.keyword
    },
    callOk () {
      let ret = confirm('지금 고객센터로 전화하시겠습니까? ')
      if (ret) {
        window.location.href = `tel:${config.telNum}`
      }
    },
    toInquire () {
      this.$store.dispatch('authentication/checkLoginAndMemberStatus')
      if (this.isAvailableMember) {
        this.$router.push({
          path: '/etc/boardinquire'
        })
      }
    }
  },
  computed: {
    ...mapState('display', ['boardsArticlesCategorys', 'boardsCategorys', 'boardItem']),
    ...mapGetters('authentication', ['isAvailableMember'])
  },
  components: {
  }
}
</script>
