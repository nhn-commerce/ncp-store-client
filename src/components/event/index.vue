<template>
  <div>
    <Loading></Loading>
    <div v-if="event">
      <template v-for="order in event.orders">
        <event-order :event="event" :slickOptions="slickOptions" :type="order" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Loading from '@/components/common/Loading'
import EventOrder from '@/components/event/EventOrder'
// import config from '@/config'

export default {
  data () {
    return {
      slickOptions: {
        dots: true,
        draggable: true,
        autoplay: false,
        arrows: false,
        initialSlide: 0
      }
    }
  },
  metaInfo: {
    title: '기획전'
  },
  methods: {
    ...mapMutations('event', ['CLEAR_EVENT'])
  },
  components: {
    Loading,
    EventOrder
  },
  computed: {
    ...mapState('event', ['event'])
  },
  beforeUpdate () {
    if (this.event && this.event.slickMenu) {
      this.slickOptions.dots = this.event.slickMenu.length > 1
    }
  },
  mounted () {
    let that = this
    this.$nextTick(function () {
      setTimeout(function () { that.$store.commit('loading/done') }, 300)
    })
  },
  destroyed () {
    this.$store.commit('loading/init')
  },
  beforeRouteLeave (to, from, next) {
    this.CLEAR_EVENT()
    next()
  },
  beforeCreate () {
    // const empNo = sessionStorage.getItem('empNo')
    // if (this.$route.path === config.internalEventPath && !empNo) {
    //   window.location.href = '/member/internal?next=' + this.$route.fullPath
    // }
  }
}
</script>
