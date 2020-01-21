<template>
  <div id="contents" class="order" v-if="accumulations">
    <slot :accumulations="accumulations" 
          :ymd="ymd" 
          :select="select" 
          :toggle="toggle" 
          :accumulationsSummary="accumulationsSummary"
          :accumulationsSummary30="accumulationsSummary30"
          :manualList="manualList"
          :outside="outside"
          :accumulationConfig="accumulationConfig"></slot>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { getToday, getStrDate } from '@/utils/dateUtils'
export default {
  data () {
    return {
      ymd: {
        selectedOneMonthDisplay: false,
        selectedOneMonth: false,
        selectedOneMonthContent: null,
        selectedSomeMonth: 1,
        ymList: this.getYmList(6)
      },
      manualList: ['ADD_MANUAL', 'SUB_MANUAL']

    }
  },
  computed: {
    ...mapState('profile', ['accumulations', 'accumulationsSummary', 'accumulationsSummary30']),
    ...mapGetters('common', ['accumulationConfig'])

  },
  methods: {
    getYmList (before) {
      let list = []
      var date = new Date()
      for (let i = 0; i < before; i++) {
        list.push({
          year: date.getFullYear(),
          month: date.getMonth() + 1
        })
        date.setMonth(date.getMonth() - 1)
      }
      return list
    },
    select (param) {
      if (typeof param === 'object') {
        this.ymd.selectedOneMonthDisplay = false
        this.ymd.selectedOneMonth = true
        this.ymd.selectedOneMonthContent = param
        this.$store.dispatch('profile/fetchAccumulations', {startYmd: getStrDate(new Date(param.year, param.month - 1, 1)), endYmd: this.getLastDay(param.year, param.month)})
      } else if (typeof param === 'number' || typeof param === 'string') {
        this.ymd.selectedOneMonth = false
        this.ymd.selectedSomeMonth = param
        var date = new Date()
        date.setMonth(date.getMonth() - param)
        this.$store.dispatch('profile/fetchAccumulations', {startYmd: getStrDate(date), endYmd: getToday()})
      }
    },
    toggle () {
      this.ymd.selectedOneMonthDisplay = !this.ymd.selectedOneMonthDisplay
    },
    outside () {
      this.ymd.selectedOneMonthDisplay = false
    },
    getLastDay (year, month) {
      let currentDate = new Date()
      if (currentDate.getMonth() + 1 === month) {
        return getStrDate(new Date(year, month - 1, currentDate.getDate()))
      }
      let nextMonthFirstDay = new Date([month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1].join('-')).getTime()
      let oneDay = 1000 * 24 * 60 * 60
      return getStrDate(new Date(year, month - 1, new Date(nextMonthFirstDay - oneDay).getDate()))
    }
  }
}
</script>