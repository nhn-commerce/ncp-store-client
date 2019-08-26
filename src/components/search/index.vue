<template>
  <div class="search_contents">
    <ProductListBox :fromType="'search'" :showName="searchKey" />
  </div>
</template>

<script>
import ProductListBox from '@/components/productList/ProductListBox'

export default {
  metaInfo: {
    title: '검색결과'
  },
  components: {
    ProductListBox
  },
  computed: {
    searchKey: {
      get () {
        return (this.$route.query.q || '').trim()
      }
    }
  }
}
</script>

<style>

</style>
