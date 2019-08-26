<template>
  <div v-if="showSearchLayer" class="h_sch_layer" id="hSchLayer">
    <div class="h_sch_top">
      <a href="/" class="btn_home" @click.prevent="hide_search_layer();$router.push('/');">home</a>
      <div class="h_sch_box">
        <form @submit.prevent="search">
          <fieldset>
            <div class="h_sch_inp">
              <input type="text" id="hSchInp" v-model="words" ref="searchInput" @click="showHotKeyword">
              <label for="hSchInp" class="acc-hidden">상품검색하기</label>
            </div>
            <span class="h_sch_btn">검색</span>
            <button type="button" class="h_sch_del" @click.prevent="delWords" v-if="words && words.length > 0">검색어 지우기</button>
          </fieldset>
        </form>
      </div>
      <button type="button" class="btn_close" @click.prevent="closeSearchLayer">닫기</button>
    </div>
    <!-- // 자동 완성 기능 레이어 -->
    <!-- 최근검색어, 인기검색어, 검색어 저장 -->
    <div class="keyword_save">
      <!-- 검색어 저장 켜져 있을 경우 -->
      <div class="keyword_save_on" v-if="favoriteKeywords && showFavoriteKey">
        <div class="keyword_top">
          <h2 class="tab_menu">
            <a href="#hotKeyword">인기검색어</a>
          </h2>
        </div>
        <div class="keyword_con" id="hotKeyword">
          <div class="hotkeyword_list">
            <ul>
              <li v-for="(item, index) in favoriteKeywords" :key="item">
                <a @click.prevent="clickFavoriteKeyword(index)">
                  <em>{{(index + 1)}}</em>{{item}}
                </a>
              </li>
              <li class="close">
                <a @click.prevent="closeHotKeyword">X 닫기</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 검색어 저장 꺼져 있을 경우 -->
      <div class="keyword_save_off" style="display:none;">
        <p class="sch_notice_txt">검색어 저장기능이 꺼져 있습니다.</p>
        <div class="keyword_btn">
          <span>
            <a href="">검색어 저장 켜기</a>
          </span>
        </div>
      </div>
      <!-- // 검색어 저장 꺼져 있을 경우 -->
    </div>
    <!-- // 최근검색어, 인기검색어, 검색어 저장 -->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      words: '',
      showFavoriteKey: false
    }
  },
  computed: {
    ...mapState('search', ['showSearchLayer', 'currCursorIndex']),
    ...mapState('product', ['favoriteKeywords'])
  },
  methods: {
    delWords () {
      this.words = ''
      this.$refs.searchInput.focus()
      this.setShowFavoriteKey(true)
    },
    search () {
      if (this.words.trim() === '') {
        return window.alert('검색어를 입력해 주시기 바랍니다.')
      }
      if (this.words) {
        this.$router.push(`/search?q=${encodeURIComponent(this.words)}`)
      } else {
        this.$router.push(`/search`)
      }
      this.hide_search_layer()
      this.setShowFavoriteKey(true)
    },
    updateWord () {
      this.words = this.$route.query.q
    },
    clickFavoriteKeyword (index) {
      this.$router.push(`/search?q=${this.favoriteKeywords[index]}`)
      this.hide_search_layer()
    },
    closeHotKeyword () {
      this.setShowFavoriteKey(false)
      this.$refs.searchInput.focus()
    },
    showHotKeyword () {
      this.setShowFavoriteKey(true)
    },
    closeSearchLayer () {
      this.hide_search_layer()
      this.setShowFavoriteKey(true)
    },
    ...mapMutations('search', ['hide_search_layer']),
    setShowFavoriteKey (isShow) {
      if (this.favoriteKeywords !== null && this.favoriteKeywords.length >= 10) {
        this.showFavoriteKey = isShow
      }
    }
  },
  beforeMount () {
    this.updateWord()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.updateWord()
  },
  created () {
    const _this = this
    this.$store.dispatch('product/_getFavoriteKeywords').then(ret => {
      _this.setShowFavoriteKey(true)
    })
  },
  watch: {
    showSearchLayer (val) {
      if (val) {
        this.words = this.$route.query.q || ''
        this.$nextTick(() => {
          this.$refs.searchInput.focus()
          if (this.currCursorIndex > -1) {
            let c = 0
            let curPos = 0;
            (this.words + ' ').replace(/[^\s]\s+/g, (_, i) => {
              if (c === this.currCursorIndex) {
                curPos = i
              }
              c++
            })
            if (curPos > 0) {
              curPos++
              this.$refs.searchInput.setSelectionRange(curPos, curPos)
            }
          }
        })
      }
    }
  }
}
</script>
