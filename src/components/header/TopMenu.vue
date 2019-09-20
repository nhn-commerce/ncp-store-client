<template>
  <div class="util_box">
    <a href="/search" class="btn_search" @click.prevent="show_search_layer()">검색버튼</a>
    <router-link :to="getMyPagePath()" class="btn_mymenu">마이페이지</router-link>
    <router-link to="/cart" class="btn_cart">
      <span v-if="count && count.count>0" class="num">{{count.count>=100?'99+':count.count}}</span>
    </router-link>
    <a href="#" class="btn_close" @click.prevent="closeApp()">닫기</a>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cookies from 'js-cookie'
import CategoryAside from '@/components/productList/CategoryAside'
import config from '@/config'

export default {
  props: {
    type: {
      type: String
    }
  },
  components: {
    CategoryAside
  },
  data () {
    return {
      viewShow: false
    }
  },
  computed: {
    isWebView () {
      return process.env.BUILD_TARGET === 'webview'
    },
    ...mapState('cart', ['count'])
  },
  methods: {
    closeApp () {
      cookies.remove('APP-TOKEN')
      location.href = `${config.urlScheme}://close`
    },
    ...mapMutations('search', ['show_search_layer']),
    getMyPagePath () {
      if (!this.$store.getters.isLogined) {
        return '/member/nonemember/ordersearch'
      }
      return '/mypage'
    }
  },
  beforeMount () {
    /** cart post to server */
    const preItems = JSON.parse(window.localStorage.cartInfo || '[]')
    if (preItems.length > 0 && this.$store.getters.isLogined) {
      if (cookies.get('ncpMemberAgree') === 'Y') {
        this.$store.dispatch('cart/addToCart', preItems)
        delete window.localStorage.cartInfo
      }
    }
    this.$store.dispatch('cart/fetchCartCount')
  }
}
</script>
