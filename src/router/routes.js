import MainHeader from '@/components/header/MainHeader'
import ListByBrandHeader from '@/components/header/ListByBrandHeader'
import SearchHeader from '@/components/header/SearchHeader'
import EventHeader from '@/components/header/EventHeader'
import ErrorHeader from '@/components/header/ErrorHeader'
import TitleHeader from '@/components/header/TitleHeader'
import SiteFooter from '@/components/footer'

import store from '@/store'
import config from '@/config'
import { asyncComponent } from './utils'

function genTitleHeader (title) {
  return {
    components: {
      TitleHeader
    },
    render (createElement) {
      return createElement('TitleHeader', {
        props: {
          title
        }
      })
    }
  }
}

export default [
  /** main */
  {
    path: '/',
    components: {
      default: asyncComponent('main/index'),
      header: MainHeader,
      footer: SiteFooter
    },
    children: [
      /** main home */
      {
        path: '',
        name: 'MainHome',
        component: asyncComponent('main/home/index'),
        meta: {
          action: true
        }
      },
      /** main best */
      {
        path: 'best/:rootCategoryNo?/:subCategoryNo?',
        name: 'MainBest',
        component: asyncComponent('main/best/index'),
        meta: {
          action: true
        }
      },
      /** main today sale */
      {
        path: 'today',
        name: 'MainToday',
        component: asyncComponent('main/today/index'),
        meta: {
          action: true
        }
      },
      /** main brand */
      {
        path: 'brand',
        name: 'MainBrand',
        component: asyncComponent('main/brand/index'),
        meta: {
          action: true
        }
      },
      /** main event */
      {
        path: 'event',
        name: 'MainEvent',
        component: asyncComponent('main/event/index'),
        meta: {
          action: true
        }
      }
    ]
  },
  /** category */
  {
    path: '/category/:rootCategoryNo/:subCategoryNo?/:subThCategoryNo?/:subFoCategoryNo?',
    name: 'Category',
    components: {
      default: asyncComponent('category/index'),
      header: genTitleHeader('카테고리'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** brand detail */
  {
    path: '/brand/:brandNo',
    name: 'Brand',
    components: {
      default: asyncComponent('brand/index'),
      header: ListByBrandHeader,
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** event detail */
  {
    path: '/event/:eventNo',
    name: 'Event',
    components: {
      default: asyncComponent('event/index'),
      header: EventHeader,
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** product search */
  {
    path: '/search',
    name: 'Search',
    components: {
      default: asyncComponent('search/index'),
      header: SearchHeader,
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** product detail */
  {
    path: '/product',
    components: {
      default: asyncComponent('productDetail/ProductDetail'),
      header: genTitleHeader('상품 정보'),
      footer: SiteFooter
    },
    beforeEnter (to, form, next) {
      // if (to.query.preview === 'true' && !document.referrer.match(/.*\.e-ncp.com\/.*/)) {
      //   alert('정상적인 접근이 아닙니다.')
      //   next({ path: '/' })
      // } else {
      //   next()
      // }
      next()
    },
    children: [
      /** product detail content */
      {
        path: ':productId(\\d+)',
        name: 'ProductDetail',
        component: asyncComponent('productDetail/ProductDetailView'),
        meta: {
          keepScroll: true,
          action: true
        }
      },
      /** product detail review */
      {
        path: 'review/:productId(\\d+)',
        name: 'ProductDetailReview',
        component: asyncComponent('productDetail/review/ProductDetailReview'),
        meta: {
          keepScroll: true,
          action: true
        }
      },
      /** product detail inquiry */
      {
        path: 'inquiry/:productId(\\d+)',
        name: 'ProductDetailInquiry',
        component: asyncComponent('productDetail/inquiry/ProductDetailInquiry'),
        meta: {
          keepScroll: true,
          action: true
        }
      },
      /** product detail information */
      {
        path: 'info/:productId(\\d+)',
        name: 'ProductDetailMoreInfo',
        component: asyncComponent('productDetail/ProductDetailProductInfo'),
        meta: {
          keepScroll: true,
          action: true
        }
      }
    ]
  },
  /** cart */
  {
    path: '/cart',
    name: 'Cart',
    components: {
      default: asyncComponent('cart/index'),
      header: genTitleHeader('장바구니'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** order */
  {
    path: '/order/getsheetno',
    name: 'BeforeOrder',
    components: {
      default: asyncComponent('order/BeforeOrder')
    },
    meta: {
      action: true
    }
  },
  {
    path: '/order/:orderSheetNo(\\d+)',
    name: 'OrderSheet',
    components: {
      default: asyncComponent('order/OrderSheet'),
      header: genTitleHeader('주문결제'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** payment result confirm */
  {
    path: '/order/paymentconfirm',
    name: 'PaymentConfirm',
    components: {
      default: asyncComponent('order/PaymentConfirm'),
      header: genTitleHeader('주문완료'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** member Convention agreement */
  {
    path: '/member/agreement',
    name: 'MemberAgreement',
    components: {
      default: asyncComponent('member/Agreement'),
      header: genTitleHeader(`${config.mallName} 약관 동의`),
      footer: SiteFooter
    }
  },
  /** member setting */
  {
    path: '/member/setting',
    name: 'MemberSetting',
    components: {
      default: asyncComponent('member/Setting'),
      header: genTitleHeader(`${config.mallName} 탈퇴`),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  {
    path: '/member/internal',
    name: 'Internal',
    components: {
      default: asyncComponent('member/Internal')
    }
  },
  /** no member order search */
  {
    path: '/member/nonemember/ordersearch',
    name: 'OrderSearch',
    components: {
      default: asyncComponent('member/nonemember/OrderSearch'),
      header: genTitleHeader('비회원 주문조회'),
      footer: SiteFooter
    }
  },
  /** no member order detail */
  {
    path: '/member/nonemember/orderdetail/:orderNo(\\d+)',
    name: 'NoneMemberDetail',
    components: {
      default: asyncComponent('member/nonemember/OrderDetail'),
      header: genTitleHeader('주문상세정보'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** no member password forget  */
  {
    path: '/member/nonemember/pwsearch',
    name: 'PwSearch',
    components: {
      default: asyncComponent('member/nonemember/PwSearch'),
      header: genTitleHeader('비회원 주문 비밀번호 찾기'),
      footer: SiteFooter
    }
  },
  /** my page */
  {
    path: '/mypage',
    name: 'MyPage',
    components: {
      default: asyncComponent('mypage/MyPage'),
      header: genTitleHeader('마이페이지'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page order list */
  {
    path: '/mypage/orderlist',
    name: 'OrderList',
    components: {
      default: asyncComponent('mypage/order/list/OrderList'),
      header: genTitleHeader('주문내역'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      keepScroll: true,
      action: true
    }
  },
  /** my page cancel list */
  {
    path: '/mypage/cancellist',
    name: 'CancelList',
    components: {
      default: asyncComponent('mypage/order/list/CancelList'),
      header: genTitleHeader('주문내역'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      keepScroll: true,
      action: true
    }
  },
  /** my page order detail */
  {
    path: '/mypage/orderdetail/:orderNo(\\d+)',
    name: 'OrderDetail',
    components: {
      default: asyncComponent('mypage/order/detail/OrderDetail'),
      header: genTitleHeader('주문상세정보'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page my reviewable */
  {
    path: '/mypage/myreviewable',
    name: 'MyReviewable',
    components: {
      default: asyncComponent('mypage/review/MyReviewable'),
      header: genTitleHeader('상품평 내역'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page my reviews */
  {
    path: '/mypage/myreviews',
    name: 'MyReviews',
    components: {
      default: asyncComponent('mypage/review/MyReviews'),
      header: genTitleHeader('상품평 내역'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page add review */
  {
    path: '/mypage/addreview/:orderNo(\\d+)/:orderOptionNo(\\d+)',
    name: 'AddReview',
    components: {
      default: asyncComponent('mypage/review/AddReview'),
      header: genTitleHeader('상품평 작성'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page edit review */
  {
    path: '/mypage/editreview/:orderNo(\\d+)/:orderOptionNo(\\d+)/:reviewNo(\\d+)/:productNo(\\d+)',
    name: 'EditReview',
    components: {
      default: asyncComponent('mypage/review/EditReview'),
      header: genTitleHeader('상품평 작성'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page like products */
  {
    path: '/mypage/likeproducts',
    name: 'LikeProducts',
    components: {
      default: asyncComponent('mypage/like/likeProducts'),
      header: genTitleHeader('찜한상품'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page my coupon */
  {
    path: '/mypage/mycoupon',
    components: {
      default: asyncComponent('mypage/coupon/myCoupon'),
      header: genTitleHeader('내 쿠폰함'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    },
    children: [
      {
        path: '/',
        name: 'ValidCoupon',
        component: asyncComponent('mypage/coupon/validCoupon'),
        meta: {
          keepScroll: true,
          action: true
        }
      },
      {
        path: 'novalidcoupon',
        name: 'NoValidCoupon',
        component: asyncComponent('mypage/coupon/noValidCoupon'),
        meta: {
          keepScroll: true,
          action: true
        }
      }
    ]
  },
  /** my page regist coupon */
  {
    path: '/mypage/registcoupon',
    name: 'RegistCoupon',
    components: {
      default: asyncComponent('mypage/coupon/registCoupon'),
      header: genTitleHeader('쿠폰코드 등록'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true
    }
  },
  /** my page return order */
  {
    path: '/mypage/return/:orderOptionNo(\\d+)',
    name: 'Return',
    components: {
      default: asyncComponent('mypage/order/claim/Return'),
      header: genTitleHeader('반품신청'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page return detail */
  {
    path: '/mypage/returndetail/:claimNo(\\d+)',
    name: 'ReturnDetail',
    components: {
      default: asyncComponent('mypage/order/claim/ReturnDetail'),
      header: genTitleHeader('반품 상세정보'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page cancel detail */
  {
    path: '/mypage/canceldetail/:orderOptionNo(\\d+)',
    name: 'CancelDetail',
    components: {
      default: asyncComponent('mypage/order/claim/CancelDetail'),
      header: genTitleHeader('취소 상세정보'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page cancel */
  {
    path: '/mypage/cancel/:orderOptionNo(\\d+)',
    name: 'Cancel',
    components: {
      default: asyncComponent('mypage/order/claim/Cancel'),
      header: genTitleHeader('취소신청'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page my product inquirys */
  {
    path: '/mypage/myproductinquirys',
    name: 'MyProductInquirys',
    components: {
      default: asyncComponent('mypage/productinquiry/MyProductInquirys'),
      header: genTitleHeader('상품문의 내역'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** my page my profile inquirys */
  {
    path: '/mypage/myprofileinquirys',
    name: 'ProfileInquiries',
    components: {
      default: asyncComponent('mypage/profileinquiry/ProfileInquiries'),
      header: genTitleHeader('1:1문의'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** no member return order */
  {
    path: '/nonemember/return/:orderOptionNo(\\d+)',
    name: 'NoneMemberReturn',
    components: {
      default: asyncComponent('member/nonemember/NoneMemberReturn'),
      header: genTitleHeader('반품신청'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** no member cancel detail */
  {
    path: '/nonemember/canceldetail/:orderOptionNo(\\d+)',
    name: 'NoneMemberCancelDetail',
    components: {
      default: asyncComponent('member/nonemember/NoneMemberCancelDetail'),
      header: genTitleHeader('취소 상세정보'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** no member return detail */
  {
    path: '/nonemember/returndetail/:claimNo(\\d+)',
    name: 'NoneMemberReturnDetail',
    components: {
      default: asyncComponent('member/nonemember/NoneMemberReturnDetail'),
      header: genTitleHeader('반품 상세정보'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** no member cancel */
  {
    path: '/nonemember/cancel/:orderOptionNo(\\d+)',
    name: 'NoneMemberCancel',
    components: {
      default: asyncComponent('member/nonemember/NoneMemberCancel'),
      header: genTitleHeader('취소 상세정보'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** faq */
  {
    path: '/etc/faq',
    name: 'Boards',
    components: {
      default: asyncComponent('etc/Boards'),
      header: genTitleHeader('자주하는 질문'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** shop_list */
  {
    path: '/etc/shoplist',
    name: 'ShopList',
    components: {
      default: asyncComponent('etc/ShopList'),
      header: genTitleHeader('개인정보 제공 판매업체 리스트'),
      footer: SiteFooter
    },
    meta: {
      action: true
    }
  },
  /** inquire */
  {
    path: '/etc/boardinquire/:prefixContents?',
    name: 'BoardInquiry',
    components: {
      default: asyncComponent('etc/BoardInquiry'),
      header: genTitleHeader('1:1문의하기'),
      footer: SiteFooter
    },
    meta: {
      needAuth: true,
      action: true
    }
  },
  /** agree */
  {
    path: '/etc/agree',
    name: 'Agree',
    components: {
      default: asyncComponent('etc/Agree'),
      header: genTitleHeader('이용약관'),
      footer: SiteFooter
    }
  },
  {
    path: '/etc/agreev02',
    name: 'AgreeV02',
    components: {
      default: asyncComponent('etc/AgreeV02'),
      header: genTitleHeader('이용약관'),
      footer: SiteFooter
    }
  },
  {
    path: '/etc/privacy',
    name: 'Privacy',
    components: {
      default: asyncComponent('etc/Privacy'),
      header: genTitleHeader('개인정보 처리방침'),
      footer: SiteFooter
    }
  },
  {
    path: '/etc/privacyv02',
    name: 'PrivacyV02',
    components: {
      default: asyncComponent('etc/PrivacyV02'),
      header: genTitleHeader('개인정보 처리방침'),
      footer: SiteFooter
    }
  },
  {
    path: '/etc/privacyv03',
    name: 'PrivacyV03',
    components: {
      default: asyncComponent('etc/PrivacyV03'),
      header: genTitleHeader('개인정보 처리방침'),
      footer: SiteFooter
    }
  },
  {
    path: '/etc/dataerror',
    name: 'DataError',
    components: {
      default: asyncComponent('etc/DataError'),
      header: ErrorHeader,
      footer: SiteFooter
    }
  },
  {
    path: '/etc/construction',
    name: 'Construction',
    components: {
      default: asyncComponent('etc/Construction'),
      header: ErrorHeader
    }
  },
  // {
  //   path: '/logincallback',
  //   name: 'LoginCallback',
  //   beforeEnter (to, form, next) {
  //     store.dispatch('saveLogin', { code: to.query.code, token: to.query.token, nxturl: to.query.nxturl })
  //   }
  // },
  {
    path: '/paycocertify',
    name: 'PaycoCertify',
    beforeEnter (to, form, next) {
      store.dispatch('paycoCertify', { nxturl: to.query.nxturl })
    }
  },
  {
    path: '/tokenerror',
    name: 'TokenError',
    components: {
      default: asyncComponent('etc/TokenError')
    }
  },
  /** page not find */
  {
    path: '/*',
    name: '404',
    components: {
      default: asyncComponent('etc/PageNotFound'),
      header: ErrorHeader,
      footer: SiteFooter
    }
  }
]
