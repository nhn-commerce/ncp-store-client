<template>
  <div id="btnBack">
    <a @click.prevent="goBlack()">Back</a>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    goBlack () {
      const currComp = this.$route.name
      const myclaim = this.$route.query.myclaim
      if (currComp === 'PaymentConfirm') {
        this.$router.push({
          path: '/'
        })
      } else if (myclaim === 'done') {
        alert('클레임 신청 대상 건이 존재하지 않습니다')
      } else {
        this.hide_search_layer()
        window.history.back()
      }
    },
    ...mapMutations('search', ['hide_search_layer'])
  }
}
</script>

