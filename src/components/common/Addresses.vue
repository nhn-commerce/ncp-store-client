<template>
  <div class="layer_popup addr_layer">
    <div class="popup_title">
      <h2>주소찾기</h2>
      <button type="button" class="btn_close" id="closeBtn1" @click="close">레이어 닫기</button>
    </div>
    <div class="popup_inner" ref="wrap">
      <form>
        <fieldset>
          <legend class="acc-hidden">주소 찾기 폼</legend>
          <!-- // 검색 전 -->
          <div class="addr_search">
            <div class="addr_sch_inp">
              <input type="text" v-model="keyword" placeholder="동 이름(읍/면/리) 또는 도로명 입력" ref="keywordFocus" @keypress.enter.prevent="searchAddresses">
              <a class="btn_remove" @click.prevent="keywordClean" :style="keyword.length === 0 ? 'display:none':''">삭제</a>
            </div>
            <a class="btn_style3 btn_search" @click.prevent="searchAddresses">검색</a>
          </div>
          <div class="addr_sch_init" v-if="initflg">
            검색결과가 없습니다.
          </div>
          <div v-if="!initflg">
            <div class="addr_sch_con" v-if="addresses && addresses.length > 0">
              <h3 class="title">검색결과
                <span>{{miliFormat(addresses.totalCount)}}</span>개</h3>
              <ul class="addr_sch_list">
                <addressItem v-for="addressItem in addresses" :key="addressItem.zipCode" :addressItem="addressItem" @addressItemclose="addressSelect"></addressItem>
                <mugen-scroll :handler="fetchAddressesMore" :should-handle="loading" scroll-container="wrap">
                  <div id="loader" v-show="loading">
                    <div class="loader_img"></div>
                    <p class="loader_txt">불러오는 중입니다...</p>
                  </div>
                </mugen-scroll>
              </ul>
            </div>
            <div class="addr_sch_con" v-if="addresses && addresses.length === 0">
              <h3 class="title">검색결과
                <span>0</span>개</h3>
              <div class="no_addr_sch">
                <strong class="pcolor1">{{this.searchkeyword}}</strong>에 대한 검색결과가 없습니다.
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formatCurrency } from '@/utils/StringUtils'
import MugenScroll from 'vue-mugen-scroll'
import addressItem from '@/components/common/AddressItem'
export default {
  data () {
    return {
      keyword: '', // '삼평동'
      initflg: true,
      searchkeyword: ''
    }
  },
  metaInfo: {
    title: '주소찾기'
  },
  methods: {
    searchAddresses () {
      if (this.keyword === '' && this.keyword.length === 0) {
        alert('검색어를 입력하세요')
        this.$refs.keywordFocus.focus()
        return
      }
      this.initflg = false
      const params = {
        keyword: this.keyword
      }
      this.searchkeyword = this.keyword
      this.$store.dispatch('common/fetchAddresses', params)
    },
    close () {
      this.$emit('closePop')
    },
    addressSelect (type, zipCode, address, jibunAddress, detailAddress) {
      this.$emit('enterAndClose', type, zipCode, address, jibunAddress, detailAddress)
    },
    keywordClean () {
      this.keyword = ''
    },
    miliFormat (num) {
      return formatCurrency(num)
    },
    ...mapActions('common', ['fetchAddressesMore'])
  },
  computed: {
    ...mapState('common', ['addresses', 'loading'])
  },
  components: {
    addressItem,
    MugenScroll
  }
}
</script>

<style>
.addr_sch_con #loader {
  position: static;
  transform: none;
}
</style>