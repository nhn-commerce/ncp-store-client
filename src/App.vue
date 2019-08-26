<template>
  <div id="wrap">
    <router-view name="header"></router-view>
    <search-layer></search-layer>
    <router-view id="contents"></router-view>
    <main-pop @closePop="closeMainPop" v-if="!loading && popShowFlg && popShow && getPopupsData" :popupInfo="getPopupsData"></main-pop>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
import SearchLayer from './components/header/SearchLayer'
import MainPop from '@/components/main/MainPop'
import { mapState, mapGetters } from 'vuex'
import cookies from 'js-cookie'
import { getToday } from '@/utils/dateUtils'
import config from '@/config'

export default {
  data () {
    return {
      popShow: true
    }
  },
  name: 'app',
  metaInfo: {
    titleTemplate: (titleChunk) => {
      return titleChunk ? `${titleChunk} : ${config.mallName}` : config.mallName
    }
  },
  components: {
    SearchLayer,
    MainPop
  },
  computed: {
    ...mapState('loading', ['loading']),
    ...mapGetters('display', ['getPopupsData']),
    popShowFlg () {
      if (cookies.get('ncpMainPop')) {
        return cookies.get('ncpMainPop') !== getToday()
      }
      return true
    }
  },
  methods: {
    closeMainPop () {
      this.popShow = false
    }
  }
}
</script>

<style lang="scss">
@import './styles/normalize.css';
@import './styles/opt-default.css';
@import './styles/slick.css';

@import './styles/layout.css';
@import './styles/sub.css';
@import './styles/review.css';
@import './styles/member.css';
@import './styles/qna.css';
@import './styles/product.css';

@import './styles/escrow.css';
@import './styles/etc.css';
@import './styles/mypage.css';
@import './styles/list.css';
@import './styles/category.css';
@import './styles/main.css';
@import './styles/custom.css';

#contents {
  padding-top: 5rem;
}

.main #contents {
  padding-top: 8.6rem;
}
</style>
