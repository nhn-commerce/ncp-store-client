<template>
  <dl class="rt_star">
    <dt>구매 만족도</dt>
    <dd>
      <div class="star">
        <div class="star_on" v-bind:style="styStar"></div>
      </div>
      <div class="txt">{{averageRate.toFixed(1)}}</div>
    </dd>
  </dl>
</template>

<script>
export default {
  data () {
    return {
      styStar: {
        width: Math.ceil(this.averageRate * 2).toFixed(1) * 10 + '%'
      }
    }
  },
  props: ['averageRate'],
  methods: {
  },
  components: {
  }
}
</script>
