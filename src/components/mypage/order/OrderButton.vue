<template>
  <div class="ctl_item_bottom">
    <strong>{{option.statusLabel}}</strong>
    <div :class="'btn_box btn_' + option.buttonCount">
      <template v-for="button in option.buttons">
        <a v-if="button === 'CANCEL'" @click.prevent="cancelOrder" class="btn_style4" :key="button">주문취소</a>
        <a v-if="button === 'WRITE_REVIEW' && !noneMember" @click.prevent="reviewOption" class="btn_style4" :key="button">
          <template v-if="option.buttonCount === 1">
            상품평 작성
          </template>
          <template v-else>
            상품평작성
          </template>
        </a>
        <a v-if="button === 'CANCEL_VIEW_CLAIM'" @click.prevent="viewCancelClaim" class="btn_style4" :key="button">
          <template v-if="option.buttonCount === 1">
            취소처리 결과
          </template>
          <template v-else>
            취소처리현황
          </template>
        </a>
        <a v-if="button === 'RETURN_VIEW_CLAIM'" @click.prevent="viewReturnClaim" class="btn_style4" :key="button">
          <template v-if="option.buttonCount === 1">
            <template v-if="option.claimStatusType !== 'RETURN_DONE'">
              반품처리 현황
            </template>
            <template v-else>
              반품처리 결과
            </template>
          </template>
          <template v-else>
            반품처리현황
          </template>
        </a>
        <a v-if="button === 'VIEW_DELIVERY'" @click.prevent="deliveryTracking" class="btn_style4" :key="button">배송조회</a>
        <a v-if="button === 'RETURN'" @click.prevent="requestReturn" class="btn_style4" :key="button">반품신청</a>
        <a v-if="button === 'WITHDRAW_CANCEL'" @click.prevent="withdrawClaim" class="btn_style4" :key="button">취소철회</a>
        <a v-if="button === 'WITHDRAW_RETURN'" @click.prevent="withdrawClaim" class="btn_style4" :key="button">반품철회</a>
        <span class="btn_refundable" v-if="button === 'NOT_REFUNDABLE'">환불불가</span>
      </template>
    </div>
  </div>
</template>

<script>
  import config from '@/config'

  export default {
    props: ['option', 'noneMember'],
    components: {
    },
    methods: {
      cancelOrder () {
        const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
        if (this.noneMember) {
          this.$router.push({
            path: '/nonemember/cancel/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        } else {
          this.$router.push({
            path: '/mypage/cancel/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        }
      },
      deliveryTracking () {
        if (this.option.delivery.retrieveInvoiceUrl) {
          if (this.$store.state.osType() === 'WEB') {
            window.open(this.option.delivery.retrieveInvoiceUrl)
          } else {
            window.location.href = `${config.urlScheme}://newBrowser?url=` + encodeURIComponent(this.option.delivery.retrieveInvoiceUrl)
          }
        } else {
          alert('판매자의 직접배송상품 입니다. 판매자에게 문의를 부탁드립니다.')
        }
      },
      reviewOption () {
        const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
        this.$router.push({
          path: '/mypage/addreview/' + this.option.orderNo + '/' + this.option.orderOptionNo,
          query: {
            fromUrl: thisUrl
          }
        })
      },
      requestReturn () {
        if (this.noneMember) {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/nonemember/return/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        } else {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/mypage/return/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        }
      },
      viewCancelClaim () {
        if (this.noneMember) {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/nonemember/canceldetail/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        } else {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/mypage/canceldetail/' + this.option.orderOptionNo,
            query: {
              fromUrl: thisUrl
            }
          })
        }
      },
      viewReturnClaim () {
        if (this.noneMember) {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/nonemember/returndetail/' + this.option.claimNo,
            query: {
              fromUrl: thisUrl
            }
          })
        } else {
          const thisUrl = `${location.protocol}//${location.host}${this.$route.fullPath}`
          this.$router.push({
            path: '/mypage/returndetail/' + this.option.claimNo,
            query: {
              fromUrl: thisUrl
            }
          })
        }
      },
      withdrawClaim () {
        const withdrawparam = {
          claimNo: this.option.claimNo
        }
        if (this.noneMember) {
          this.$store.dispatch('guestorder/putGuestClaimWithdraw', withdrawparam).then(() => {
            alert('철회되었습니다.')
            window.location.href = `/member/nonemember/orderdetail/${this.option.orderNo}`
          })
        } else {
          this.$store.dispatch('myorder/putOrderOptionClaimWithdraw', withdrawparam).then(() => {
            alert('철회되었습니다.')
            window.location.href = '/mypage/orderlist'
          })
        }
      }
    }
  }
</script>

<style>

</style>
