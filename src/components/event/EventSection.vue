<template>
  <div>
    <section :id="`section${i}`" v-for="(sectionItem, i) in event.section" :key="sectionItem.label" :class="{section_margin : (event.section && event.section.length > 1)}">
      <div class="content_wide_section_top" v-if="sectionItem.products.length > 0 && event.slickMenu && event.slickMenu.length > 0 && event.slickMenu[0].length > 1">
        <h3 class="title_style1 title">{{sectionItem.label}}</h3>
      </div>
      <ul :class="[sectionItem.mobilePerRow === 1 ? 'list_type_list type2' : 'gallery_type_list wide']">
        <li v-for="product in sectionItem.products" :key="product.productNo">
          <ProductCard :product="product" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import ProductCard from '@/components/common/ProductCard'
import CouponItem from '@/components/common/CouponItem'

export default {
  props: ['event'],
  components: {
    ProductCard,
    CouponItem
  }
}
</script>

<style>
.section_margin {
    margin-top: 10px;
}
</style>
