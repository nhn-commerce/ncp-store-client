<template>
  <base-header type="search">
    <div class="h_sch_area">
      <div class="h_sch_box" id="hSchKeywordBox">
        <form action="">
          <fieldset>
            <div class="h_sch_inp">
              <input type="hidden" id="schHidden" value="원피스">
              <label for="schHidden" class="acc-hidden">상품검색하기</label>
            </div>
            <button type="button" class="h_sch_btn">검색</button>
            <div class="keyword_box">
              <div class="keyword_swipe">
                <ul>
                  <li v-for="(word, index) in words" :key="index">
                    <span>
                      <button type="button" class="word" @click="show_search_layer(index)">{{ word }}</button>
                      <button type="button" class="del" @click="removeWord(word)">삭제</button>
                    </span>
                  </li>
                  <li class="inp_blank" style="width: 515.7px;" @click="show_search_layer">검색</li>
                </ul>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </base-header>
</template>

<script>
import BaseHeader from './BaseHeader'
import { mapMutations } from 'vuex'

export default {
  components: {
    BaseHeader
  },
  data () {
    return {
      words: []
    }
  },
  methods: {
    removeWord (word) {
      const q = this.$route.query.q
        .replace(new RegExp(word + ' '), '')
        .replace(new RegExp(' ' + word), '')
        .replace(new RegExp('^' + word), '')
      this.$router.replace({ query: { q } })
    },
    updateWord () {
      this.words = (this.$route.query.q || '').trim().split(/\s+/)
      if (this.words[0] === '') {
        this.words = []
      }
      if (this.words.length === 0) {
        this.show_search_layer()
      }
    },
    ...mapMutations('search', ['show_search_layer'])
  },
  beforeMount () {
    this.updateWord()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.updateWord()
  }
}
</script>

<style>

</style>
