module.exports = {
  NODE_ENV: '"production"',
  BUILD_TARGET: JSON.stringify(process.env.BUILD_TARGET || 'mobileweb'),
  BUILD_ENV: JSON.stringify(process.env.BUILD_ENV || 'prod'),
  PAY_PLUS_JS: '"https://pay.kcp.co.kr/plugin/payplus_web.jsp"'
}
