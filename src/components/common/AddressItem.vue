<template>
  <li>
    <a @click.prevent="selectAddress('address')">
      <div class="addr_sch_item">
        <div class="type">
          <span>도로명</span>
        </div>
        <div class="code">{{addressItem.zipCode}}</div>
        <div class="info">
          {{addressItem.address}}<br> {{addressItem.detailAddress}}
        </div>
      </div>
    </a>
    <a @click.prevent="selectAddress('jibun')">
      <div class="addr_sch_item">
        <div class="type">
          <span>지번</span>
        </div>
        <div class="code">{{addressItem.zipCode}}</div>
        <div class="info">
          {{addressItem.jibunAddress}}<br> {{addressItem.detailAddress}}
        </div>
      </div>
    </a>
  </li>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: ['addressItem'],
  methods: {
    selectAddress (addresstype) {
      if (addresstype === 'address') {
        this.$emit('addressItemclose', 'address', this.addressItem.zipCode, this.addressItem.address, this.addressItem.jibunAddress, this.addressItem.detailAddress)
      } else if (addresstype === 'jibun') {
        this.$emit('addressItemclose', 'jibun', this.addressItem.zipCode, this.addressItem.address, this.addressItem.jibunAddress, this.addressItem.detailAddress)
      }
    }
  },
  components: {
  },
  computed: {
  }
}
</script>