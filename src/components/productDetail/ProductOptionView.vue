<template>
  <div>
    <div class="pdt_info_bnr">
      <img src="../../assets/images/content/optionview.jpg" alt="">
    </div>
    <div class="pdt_info_con">
      <div v-for="item in optionsMainImgs" :class="['pdt_info_img' , {'soldout':item.soldout}]" :key="item.optionNo">
        <img :src="item.imageUrl" alt="" @click.prevent="showView(item.optionNo)">
        <span class="soldout" v-if="item.soldout">
          <em>SOLD OUT</em>
        </span>
      </div>
    </div>
    <productViewMorePop v-if="showViewFlg" :optionNo="optionViewNo" @closePop="closeView" />
  </div>
</template>

<script>
import productViewMorePop from '@/components/productDetail/ProductViewMorePop'
import { mapState, mapMutations } from 'vuex'
import { addClass, removeClass } from '@/utils/utils'

export default {
  data () {
    return {
      showViewFlg: false,
      optionViewNo: 0
    }
  },
  methods: {
    showView (optionNo) {
      if (!this.detailBottomOpen) {
        const currScroll = document.body.scrollTop | document.documentElement.scrollTop
        this.SET_BODY_SCROLL_TOP(currScroll * -1)
        document.body.style.top = this.bodyScrollTop + 'px'
        addClass(document.body, 'no_scroll')
      }
      this.optionViewNo = optionNo
      this.SELECT_OPTION(optionNo)
      this.showViewFlg = true
      this.SET_VIEW_POP_OPEN(true)
    },
    closeView () {
      if (!this.detailBottomOpen) {
        removeClass(document.body, 'no_scroll')
        document.body.style.top = '0px'
        window.scrollTo(0, this.bodyScrollTop * -1)
      }
      this.SELECT_OPTION('')
      this.showViewFlg = false
      this.SET_VIEW_POP_OPEN(false)
    },
    ...mapMutations('product', ['SELECT_OPTION', 'SET_VIEW_POP_OPEN', 'SET_BODY_SCROLL_TOP', 'CLEAR_OPTION_IMGS'])
  },
  components: {
    productViewMorePop
  },
  computed: {
    ...mapState('product', ['optionsMainImgs', 'detailBottomOpen', 'viewPopOpen', 'bodyScrollTop'])
  },
  destroyed () {
    this.CLEAR_OPTION_IMGS()
  }
}
</script>

<style>

</style>
