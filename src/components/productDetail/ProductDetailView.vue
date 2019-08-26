<template>
  <div v-if="product">
    <div class="pdt_info_con">
      <div v-if="product.partnerNotice && product.partnerNotice.content" v-html="product.partnerNotice.content" class="pdti_notice">
      </div>
      <div v-if="product.baseInfo.contentHeader" v-html="product.baseInfo.contentHeader" class="pdti_top">
      </div>
      <div v-html="product.baseInfo.content" class="pdti_middle" v-if="!product.baseInfo.optionImageViewable">
      </div>
      <productOptionView v-else />
      <div v-if="product.baseInfo.contentFooter" v-html="product.baseInfo.contentFooter" class="pdti_bottom">
      </div>
    </div>
    <div v-bind:class="['pdi_notice' , {is_open : disContent}]" id="pdiNotice">
      <button @click="contentOpen" type="button" class="pdi_n_btn">상품정보제공고시</button>
      <div class="pdi_n_con">
        <table class="pd_table">
          <caption class="acc-hidden">상품정보제공고시 테이블</caption>
          <tbody>
            <tr v-for="content in JSON.parse(product.baseInfo.dutyInfo).contents" :key="Object.keys(content)[0]">
              <th>{{Object.keys(content)[0]}}</th>
              <td>{{content[Object.keys(content)[0]]}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
import productOptionView from '@/components/productDetail/ProductOptionView'

export default {
  data () {
    return {
      disContent: 'false'
    }
  },
  computed: {
    ...mapState('product', ['product'])
  },
  methods: {
    contentOpen () {
      this.disContent = !this.disContent
    }
  },
  components: {
    productOptionView
  },
  mounted () {
    if ($('.pdt_info_con iframe')) {
      $('.pdt_info_con iframe').wrap(`<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25% !important;"></div>`)
    }
  }
}
</script>

<style>
iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
