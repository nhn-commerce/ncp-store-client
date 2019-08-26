import cookies from 'js-cookie'
let config = {}

if (process.env.BUILD_ENV === 'prod') {
  config = require('./prod').default
}
if (process.env.BUILD_ENV === 'alpha') {
  config = require('./alpha').default
}
config.platform = function () {
  if (process.env.BUILD_TARGET === 'mobileweb') {
    return 'MOBILE_WEB'
  }
  const ostype = cookies.get('osType')
  if (ostype === 'aos') {
    return 'AOS'
  }
  return 'IOS'
}

export default config
