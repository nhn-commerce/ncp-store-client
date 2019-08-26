import { createNcpApiStore } from '@/api'
import Hangul from 'hangul-js'

const apiStore = createNcpApiStore([
  {
    action: '_fetchAllBrand',
    property: 'brand',
    path: 'display/brands',
    onSuccess (state, payload) {
      state.brand.push(...payload.data.items)
      state.totalCount = payload.data.totalCount
    }
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  state: {
    current: 'Hangul',
    txt: '',
    totalCount: 0,
    brand: [],
    fetchListParams: {
      hasTotalCount: true,
      pageSize: 500,
      pageNumber: 1
    }
  },
  actions: {
    async execFetchAllBrand ({ state, commit, dispatch }) {
      await dispatch('_fetchAllBrand', { params: state.fetchListParams })
      if (state.totalCount !== state.brand.length) {
        state.fetchListParams.pageNumber++
        dispatch('execFetchAllBrand')
      }
    },
    fetchAllBrand ({ state, commit, dispatch }) {
      commit('ININ_DATA')
      dispatch('execFetchAllBrand')
    }
  },
  getters: {
    currentBrandName (state, getters, rootState) {
      if (!state.brand || state.brand.length === 0) {
        return null
      }
      const brandNo = rootState.route.params.brandNo
      const currBrand = state.brand.filter(brand => brand.brandNo === Number(brandNo))[0]
      if (currBrand) {
        return currBrand.nameType === 'NAME_EN' ? currBrand.nameEn : currBrand.name
      } else {
        return null
      }
    },
    currentGroup (state, getters) {
      if (!state.brand || state.brand.length === 0) {
        return null
      }
      if (state.current === 'Hangul') {
        const group = {}
        const hangul = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', '기타']
        hangul.forEach(char => {
          group[char] = []
          if (getters.groupByHangul[char]) {
            group[char] = getters.groupByHangul[char]
          }
        })
        return group
      } else {
        const group = {}
        const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '기타']
        alphabet.forEach(char => {
          group[char] = []
          if (getters.groupByAlphabet[char]) {
            group[char] = getters.groupByAlphabet[char]
          }
        })
        return group
      }
    },
    groupByHangul (state) {
      if (!state.brand || state.brand.length === 0) {
        return null
      }
      const ret = {}
      state.brand
        .filter(brand => brand.nameType === 'NAME_KO')
        .forEach(brand => {
          const name = brand.name
          if (/^[가-힣]/.test(name)) {
            const splited = Hangul.disassemble(name)
            // 쌍자음 -> 단자음
            if (splited[0] === 'ㄲ') {
              splited[0] = 'ㄱ'
            } else if (splited[0] === 'ㄸ') {
              splited[0] = 'ㄷ'
            } else if (splited[0] === 'ㅃ') {
              splited[0] = 'ㅂ'
            } else if (splited[0] === 'ㅆ') {
              splited[0] = 'ㅅ'
            } else if (splited[0] === 'ㅉ') {
              splited[0] = 'ㅈ'
            }
            if (!ret[splited[0]]) {
              ret[splited[0]] = []
            }
            ret[splited[0]].push({
              name,
              no: brand.brandNo
            })
          } else {
            ret['기타'] = ret['기타'] || []
            ret['기타'].push({
              name,
              no: brand.brandNo
            })
          }
        })
      return ret
    },
    groupByAlphabet (state) {
      if (!state.brand || state.brand.length === 0) {
        return null
      }
      const ret = {}
      state.brand
        .filter(brand => brand.nameType === 'NAME_EN')
        .forEach(brand => {
          const name = brand.nameEn
          if (!/^[a-zA-Z\s]/.test(name)) {
            ret['기타'] = ret['기타'] || []
            ret['기타'].push({
              name,
              no: brand.brandNo
            })
            return
          }
          if (!ret[name[0].toUpperCase()]) {
            ret[name[0].toUpperCase()] = []
          }
          ret[name[0].toUpperCase()].push({
            name,
            no: brand.brandNo
          })
        })
      return ret
    },
    searchResult (state, getters) {
      if (!state.txt.trim()) {
        return []
      }
      if (getters.currentGroup) {
        const ret = []
        for (var char in getters.currentGroup) {
          getters.currentGroup[char].forEach(brand => {
            if (brand.name.toUpperCase().indexOf(state.txt.toUpperCase()) >= 0 || Hangul.search(brand.name, state.txt) >= 0) {
              ret.push(brand)
            }
          })
        }
        return ret.slice(0, 10)
      }
      return null
    }
  },
  mutations: {
    toggleGroup (state, payload) {
      if (payload) {
        state.current = payload
        return
      }
      if (state.current === 'Hangul') {
        state.current = 'Alphabet'
      } else {
        state.current = 'Hangul'
      }
    },
    setTxt (state, payload) {
      state.txt = payload
    },
    SET_INIT (state) {
      state.txt = ''
    },
    ININ_DATA (state) {
      state.brand = []
      state.totalCount = 0
      state.fetchListParams.pageNumber = 1
    }
  }
}
