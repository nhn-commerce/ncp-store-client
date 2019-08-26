import Vue from 'vue'

const filters = {
  formatNumber (num) {
    const str = String(num.toFixed(0))
    return str.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  },
  pad (num, size) {
    const str = String(num)
    return new Array(size - str.length + 1).join('0') + str
  }
}

Object.keys(filters).forEach(name => Vue.filter(name, filters[name]))

export default filters
