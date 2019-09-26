// config for alpha

import productionConfig from './prod'

export default {
  ...productionConfig,

  ncpClientId: '<clientId>',
  homeBannerCode: '<homeBannerCode>',
  homeMagicBannerCode: '<homeMagicBannerCode>',
  homeSectionNo: '<homeSectionNo>',
  todaySectionNo: '<todaySectionNo>',
  faqBoardNo: '<faqBoardNo>',
  // kakaoKey: '<kakao key>',

  ncpApiBaseUrl: 'https://alpha-api.e-ncp.com/',

  payJs: 'ncp_pay_alpha.js',
  searchJs: 'ncp_search_alpha.js'
}
