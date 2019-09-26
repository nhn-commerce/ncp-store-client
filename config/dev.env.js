var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PAY_PLUS_JS: '"https://testpay.kcp.co.kr/plugin/payplus_web.jsp"',
})
