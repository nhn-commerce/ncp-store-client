<template>
  <div class="search_contents">
    <ProductListBox :showName="currentBrandName" :fromType="'brand'" />
  </div>
</template>

<script>
import ProductListBox from '@/components/productList/ProductListBox'
import { mapGetters } from 'vuex'

export default {
  metaInfo: {
    title: '상품리스트'
  },
  components: {
    ProductListBox
  },
  computed: {
    ...mapGetters('brand', ['currentBrandName'])
  }
}
</script>

<style>

</style>
