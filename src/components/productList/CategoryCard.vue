<template>
  <li :class="{'is_active' : category.isSelected}">
    <a @click.prevent="selectedCate">{{category.label}}</a>
    <div class="sub_category_2">
      <h3>
        <a @click.prevent="closeView()">{{category.label}} 전체보기</a>
      </h3>
      <ul>
        <li v-for="categoryDepth2 in category.children" :key="categoryDepth2.categoryNo">
          <a :class="{'is_curr' : categoryDepth2.isSelected}" @click.prevent="closeView(categoryDepth2.categoryNo)">
            {{categoryDepth2.label}}
          </a>
        </li>
      </ul>
    </div>
  </li>
</template>

<script>

import { mapMutations } from 'vuex'

export default {
  props: ['category'],
  methods: {
    closeView (subCategoryNo) {
      this.hide_search_layer()
      const categoryNos = this.category.categoryNo + (subCategoryNo ? ('/' + subCategoryNo) : '')
      this.$router.push({
        path: '/category/' + categoryNos
      })
      this.$emit('closeView')
    },
    selectedCate () {
      this.$store.commit('categories/SELECT_OPTION', this.category.categoryNo)
    },
    ...mapMutations('search', ['hide_search_layer'])
  }
}
</script>

<style>
.icon > span {
  position: absolute;
  margin-top: 0.6rem;
  margin-left: 1.5rem;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 1px solid rgb(204, 204, 204);
  background-repeat: no-repeat;
  background-color: rgb(255, 255, 255);
  background-position: 50%;
  background-size: 3.5rem;
}

.sub_category_2 ul > li a.is_curr {
  color: rgb(255, 74, 105);
}
</style>
