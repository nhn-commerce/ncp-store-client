import { createNcpApiStore } from '@/api'
import { formatBanners } from '@/utils/utils'
import config from '@/config'

const apiStore = createNcpApiStore([
  {
    action: 'fetchBanners',
    property: 'banners',
    path: `display/banners/${config.homeBannerCode}`
  },
  {
    action: 'fetchMagicBanners',
    property: 'magicBanners',
    path: `display/banners/${config.homeMagicBannerCode}`
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    fetchMainAll ({ state, commit, dispatch }) {
      if (state.banners && state.magicBanners) {
        return
      }
      dispatch('fetchBanners')
      dispatch('fetchMagicBanners')
    },
    fetchMyPageBanners ({ state, commit, dispatch }) {
    }
  },
  getters: {
    mainTopBanners (state) {
      if (!state.banners) {
        return
      }

      const oldbanners = formatBanners(state.banners[0].accounts[0].banners)

      const newArr = oldbanners.slice(0)
      newArr.sort(() => 0.5 - Math.random())

      let showBanners = []
      oldbanners.forEach((item, index) => {
        if (item.name === newArr[0].name) {
          const firstBanners = oldbanners.slice(index)
          const endBanners = oldbanners.slice(0, index)
          showBanners = firstBanners.concat(endBanners)
        }
      })
      return showBanners
    },
    mainMagicBanners (state) {
      if (!state.magicBanners) {
        return
      }
      return formatBanners(state.magicBanners[0].accounts[0].banners)
    },
    showBrandBanner (state) {
      return undefined
    },
    eventBanners (state) {
      return undefined
    },
    categoryBanner (state) {
      if (state.categoryBanner && state.categoryBanner.length && state.categoryBanner[0].accounts && state.categoryBanner[0].accounts.length) {
        state.categoryBanner[0].accounts.forEach(account => {
          const newArr = account.banners.slice(0)
          newArr.sort(() => 0.5 - Math.random())

          let showBanners = []
          account.banners.forEach((item, index) => {
            if (item.name === newArr[0].name) {
              const firstBanners = account.banners.slice(index)
              const endBanners = account.banners.slice(0, index)
              showBanners = firstBanners.concat(endBanners)
            }
          })
          account.banners = formatBanners(showBanners)
        })
        return state.categoryBanner[0].accounts
      }
    },
    myPageTopBanners (state) {
      return undefined
    },
    myPageBottomBanners (state) {
      return undefined
    }
  }
}
