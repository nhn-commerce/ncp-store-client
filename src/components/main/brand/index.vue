<template>
  <div>
    <div class="brand_swipe_menu_wrap" v-if="showBrandBanner && showBrandBanner.length > 0">
      <div class="brand_swipe_menu">
        <router-link v-for="banner in showBrandBanner" :key="banner.name" :to="banner.landingUrl">
          <span class="brand_logo">
            <img :src="banner.imageUrl" alt="">
          </span>
          <em>{{banner.name}}</em>
        </router-link>
      </div>
    </div>
    <div class="brand_search_box">
      <div class="brand_search">
        <input type="text" placeholder="브랜드명을 입력하세요" v-model="searchText" @input="searchText=$event.target.value" @keypress.enter.prevent="keywordEnter">
        <a href="" class="btn_search" @click.prevent>검색</a>
        <a href="" class="btn_remove" @click.prevent="setTxt('')" v-if="searchText && searchText.length > 0">삭제</a>
      </div>
      <div v-if="searchResult && searchResult.length===0 && !searchText.length > 0" class="brand_word_tab" id="brandWordTab">
        <h3 :class="{
          tab_menu: true,
          is_open: current==='Hangul'
        }">
          <a href="#wordKor" @click.prevent="selected='', toggleGroup('Hangul')">가나다</a>
        </h3>
        <div class="tab_con" id="wordKor">
          <ul class="brand_word_list">
            <li v-for="(group, key) in currentGroup" :key="key" :class="{
              'is_disabled': group.length===0,
              'is_on': key===selected
            }">
              <a v-if="group.length>0" :href="`#char-${key}`" @click.prevent="toggle(key)">{{key}}</a>
              <a v-else>{{key}}</a>
            </li>
          </ul>
        </div>
        <h3 :class="{
          tab_menu: true,
          is_open: current==='Alphabet'
        }">
          <a href="#wordEng" @click.prevent="selected='', toggleGroup('Alphabet')">ABC</a>
        </h3>
        <div class="tab_con" id="wordKor">
          <ul class="brand_word_list">
            <li v-for="(group, key) in currentGroup" :key="key" :class="{
              'is_disabled': group.length===0,
              'is_on': key===selected
            }">
              <a v-if="group.length>0" :href="`#char-${key}`" @click.prevent="toggle(key)">{{key}}</a>
              <a v-else>{{key}}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <section v-if="searchResult && searchResult.length>0" class="brand_search_list">
      <div class="brand_search_list_top">
        <h3 class="title_style2 title">
          <span>{{searchText}}</span> 검색결과
        </h3>
        <a @click.prevent="cleankeyword()" href="" class="btn_reset">초기화</a>
      </div>
      <ul class="list">
        <li v-for="brand in searchResult" :key="brand.name" @click.prevent="hideAsideView">
          <router-link :to="`/brand/${brand.no}`">{{brand.name}}</router-link>
        </li>
      </ul>
    </section>
    <div v-if="searchResult.length===0 && !searchText.length > 0" class="brand_list">
      <template v-for="(group, name) in filterCurrentGroup()" v-if="group.length>0">
        <strong :id="`char-${name}`" class="title_style2 title" :key="name">{{name}} 브랜드</strong>
        <ul class="list" :key="'_lits'+name">
          <li v-for="brand in group" :key="brand.name" @click.prevent="hideAsideView">
            <router-link :to="`/brand/${brand.no}`">{{brand.name}}</router-link>
          </li>
          <li v-if="group.length%2===1" style="height:4.1rem"></li>
        </ul>
      </template>
    </div>
    <div v-if="searchResult.length===0 && searchText.length > 0" class="main_wrap">
      <div class="brand_search_list_top">
        <h3 class="title_style2 title">
          <span>{{searchText}}</span> 검색결과
        </h3>
        <a @click.prevent="cleankeyword()" href="" class="btn_reset">초기화</a>
      </div>
      <p class=" sch_notice_txt ">
        <strong>{{searchText}}</strong>에 대한 검색결과가 없습니다.<br> 다른 검색어로 다시 검색 해 보세요.
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  data () {
    return {
      selected: ''
    }
  },
  metaInfo: {
    title: '브랜드'
  },
  computed: {
    searchText: {
      get () {
        return this.txt
      },
      set (val) {
        this.setTxt(val)
      }
    },
    ...mapGetters('banners', ['showBrandBanner']),
    ...mapState('brand', ['current', 'txt']),
    ...mapGetters('brand', ['currentGroup', 'searchResult'])
  },
  methods: {
    cleankeyword () {
      this.searchText = ''
    },
    filterCurrentGroup () {
      if (this.selected === '') {
        return this.currentGroup
      } else {
        return {
          [this.selected]: this.currentGroup[this.selected]
        }
      }
    },
    toggle (char) {
      if (this.selected === char) {
        this.selected = ''
      } else {
        this.selected = char
      }
    },
    keywordEnter () {
      if (this.searchText === '') {
        alert('검색어를 입력 해 주세요')
      }
    },
    ...mapMutations('brand', ['toggleGroup', 'setTxt', 'SET_INIT']),
    ...mapMutations('search', ['hide_aside_view']),
    hideAsideView () {
      this.hide_aside_view()
      document.getElementById('btnBack').style.zIndex = 9994
    }
  },
  beforeRouteLeave (to, from, next) {
    this.SET_INIT()
    next()
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      setTimeout(function () { that.$store.commit('loading/done') }, 300)
    })
  },
  destroyed () {
    this.$store.commit('loading/init')
  }
}
</script>

<style>
/* main_brand */
</style>
