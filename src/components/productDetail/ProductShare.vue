<template>
  <div class="pv_i_share">
    <h3>공유하기</h3>
    <ul class="share_list">
      <li @click.prevent="share('KT')"><a>카카오톡</a></li>
      <li @click.prevent="share('FB')"><a>페이스북</a></li>
      <li @click.prevent="share('BD')"><a>밴드</a></li>
      <li @click.prevent="share('KS')"><a>카카오스토리</a></li>
      <li @click.prevent="share('SMS')"><a>SMS</a></li>
      <li v-clipboard:copy="thisUrl" v-clipboard:success="onCopy"><a>URL복사</a></li>
    </ul>
  </div>
</template>

<script>
import { shareAndLoadScript } from '@/utils/utils'

export default {
  props: ['thisUrl', 'product'],
  methods: {
    share (type) {
      // const imgurl = this.product.baseInfo.imageUrls[0] ? this.product.baseInfo.imageUrls[0] : ''
      const share = {
        shareType: type,
        msg: this.product.baseInfo.productName,
        link: this.thisUrl,
        imageUrl: this.product.baseInfo.imageUrls[0],
        regularPrice: this.product.price.salePrice,
        discountPrice: this.product.price.salePrice - this.product.price.immediateDiscountAmt - this.product.price.additionDiscountAmt,
        discountRate: (this.product.price.immediateDiscountAmt + this.product.price.additionDiscountAmt) / this.product.price.salePrice * 100
      }
      shareAndLoadScript(share)
    },
    onCopy () {
      const u = navigator.userAgent
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isiOS) {
        this.$iosAlert({
          title: 'URL 복사 완료',
          text: '클립보드에 복사하였습니다. 공유하고 싶은 곳에 붙여넣기 하세요.',
          okText: '확인'
        })
      } else {
        this.$toasted.show('클립보드에 복사하였습니다. 공유하고 싶은 곳에 붙여넣기 하세요.')
        setTimeout(() => {
          this.$toasted.clear()
        }, 3000)
      }
    }
  }
}
</script>

<style>
.toasted-container {
  margin-top: 5rem;
}
</style>
