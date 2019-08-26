<template>
  <div>
    <Loading></Loading>
    <main-nav></main-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import MainNav from './Nav'
import Loading from '../common/Loading'

export default {
  name: 'Main',
  metaInfo: {
    bodyAttrs: {
      class: 'main'
    }
  },
  components: {
    MainNav,
    Loading
  }
}
</script>


