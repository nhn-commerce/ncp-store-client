import Vue from 'vue'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    slickCategories: [],
    categories: null
  },
  actions: {
    async fetchAll ({ state, dispatch, commit, rootState }, { to }) {
      await store.dispatch('common/fetchMalls', {}, { root: true }).then(malls => {
        state.categories = malls.categories.multiLevelCategories
        let rootNo = null
        let subNo = null
        if (to.name === 'Category') {
          rootNo = to.params.rootCategoryNo
          subNo = to.params.subCategoryNo
          commit('SLICK_CATEGORIES', to.params)
        }
        commit('ASIDE_CATES', { rootNo, subNo })
      })
      return state.categories
    }
  },
  getters: {
    bestCategoryName (state, getters, rootState) {
      if (state.categories && rootState.route.params.rootCategoryNo) {
        const bestCateNames = {}
        const root = state.categories.find(category => category.categoryNo === Number(rootState.route.params.rootCategoryNo))
        bestCateNames.rootName = root.label
        if (rootState.route.params.subCategoryNo) {
          const sub = root.children.find(category => category.categoryNo === Number(rootState.route.params.subCategoryNo))
          bestCateNames.subName = sub.label
        }
        return bestCateNames
      }
    },
    selectCates (state, getters, rootState) {
      if (state.categories && rootState.route.params.rootCategoryNo) {
        const cates = []
        const rootCategorie = state.categories.find(category => category.categoryNo === Number(rootState.route.params.rootCategoryNo))
        cates[0] = {
          categoryNo: rootCategorie.categoryNo,
          label: rootCategorie.label
        }
        if (rootState.route.params.subCategoryNo) {
          const subCategorie = rootCategorie.children.find(category => category.categoryNo === Number(rootState.route.params.subCategoryNo))
          cates[1] = {
            categoryNo: subCategorie.categoryNo,
            label: subCategorie.label
          }
          if (rootState.route.params.subThCategoryNo) {
            const subThCategorie = subCategorie.children.find(category => category.categoryNo === Number(rootState.route.params.subThCategoryNo))
            cates[2] = {
              categoryNo: subThCategorie.categoryNo,
              label: subThCategorie.label
            }
          }
        }
        if (cates) {
          return cates
        }
      }
    },
    productCates: (state) => (cateNos) => {
      if (state.categories && cateNos && cateNos.length > 0) {
        let productCates = state.categories.map(item => {
          return {
            categoryNo: item.categoryNo,
            label: item.label,
            children: item.children,
            isSelected: item.categoryNo === cateNos[0].categoryNo,
            link_to: `/category/${item.categoryNo}`
          }
        })
        if (cateNos.length > 1) {
          let tempCates = productCates.find(category => category.categoryNo === cateNos[0].categoryNo)
          productCates = tempCates.children.map(item => {
            return {
              categoryNo: item.categoryNo,
              label: item.label,
              children: item.children,
              isSelected: item.categoryNo === cateNos[1].categoryNo,
              link_to: `/category/${cateNos[0].categoryNo}/${item.categoryNo}`
            }
          })
          if (cateNos.length > 2) {
            tempCates = productCates.find(category => category.categoryNo === cateNos[1].categoryNo)
            productCates = tempCates.children.map(item => {
              return {
                categoryNo: item.categoryNo,
                label: item.label,
                children: item.children,
                isSelected: item.categoryNo === cateNos[2].categoryNo,
                link_to: `/category/${cateNos[0].categoryNo}/${cateNos[1].categoryNo}/${item.categoryNo}`
              }
            })
            if (cateNos.length > 3) {
              tempCates = productCates.find(category => category.categoryNo === cateNos[2].categoryNo)
              productCates = tempCates.children.map(item => {
                return {
                  categoryNo: item.categoryNo,
                  label: item.label,
                  children: item.children,
                  isSelected: item.categoryNo === cateNos[3].categoryNo,
                  link_to: `/category/${cateNos[0].categoryNo}/${cateNos[1].categoryNo}/${cateNos[2].categoryNo}/${item.categoryNo}`
                }
              })
            }
          }
        }
        if (productCates) {
          return productCates
        }
      }
    },
    showCategoryName (state, getters, rootState) {
      if (state.categories && rootState.route.params.rootCategoryNo) {
        const rootCategorie = state.categories.find(category => category.categoryNo === Number(rootState.route.params.rootCategoryNo))
        if (rootState.route.params.subCategoryNo) {
          const subCategorie = rootCategorie.children.find(category => category.categoryNo === Number(rootState.route.params.subCategoryNo))
          if (rootState.route.params.subThCategoryNo) {
            const subThCategorie = subCategorie.children.find(category => category.categoryNo === Number(rootState.route.params.subThCategoryNo))
            return rootCategorie.label + ' > ' + subCategorie.label + ' > ' + subThCategorie.label
          }
          return rootCategorie.label + ' > ' + subCategorie.label
        }
        return rootCategorie.label
      }
    },
    currentSubCategories (state, getters, rootState) {
      if (state.categories && rootState.route.params.rootCategoryNo) {
        const root = state.categories
          .find(category => category.categoryNo === Number(rootState.route.params.rootCategoryNo))
        return root && root.children
      }
      return null
    }
  },
  mutations: {
    ASIDE_CATES (state, { rootNo, subNo }) {
      if (state.categories) {
        state.categories.forEach(categorie => {
          Vue.set(categorie, 'isSelected', categorie.categoryNo === Number(rootNo))
          categorie.children && categorie.children.forEach(item => {
            Vue.set(item, 'isSelected', item.categoryNo === Number(subNo))
          })
        })
      }
    },
    SELECT_OPTION (state, selCateNo) {
      state.categories.forEach(categorie => {
        if (categorie.categoryNo === selCateNo) {
          categorie.isSelected = !categorie.isSelected
        } else {
          categorie.isSelected = false
        }
      })
    },
    EMPTY_SLICK_CATEGORIES (state) {
      state.slickCategories = []
    },
    SLICK_CATEGORIES (state, params) {
      if (params.rootCategoryNo && state.categories) {
        const tempCategories = []
        const rootCate = state.categories.find(item => item.categoryNo === Number(params.rootCategoryNo))
        let subCate = null
        if (params.subCategoryNo) {
          subCate = rootCate.children.find(item => item.categoryNo === Number(params.subCategoryNo))
        }
        if (params.subThCategoryNo) {
          const thCate = subCate.children.find(item => item.categoryNo === Number(params.subThCategoryNo))
          if (thCate.children && thCate.children.length > 0) {
            tempCategories.push({
              label: '전체',
              link_to: `/category/${params.rootCategoryNo}/${params.subCategoryNo}/${params.subThCategoryNo}`,
              isSelected: !params.subFoCategoryNo
            })
            tempCategories.push(
              ...thCate.children.map(item => {
                return {
                  categoryNo: item.categoryNo,
                  label: item.label,
                  link_to: `/category/${params.rootCategoryNo}/${params.subCategoryNo}/${params.subThCategoryNo}/${item.categoryNo}`,
                  isSelected: params.subFoCategoryNo ? item.categoryNo === Number(params.subFoCategoryNo) : false
                }
              })
            )
          }
        } else if (params.subCategoryNo) {
          if (subCate.children && subCate.children.length > 0) {
            tempCategories.push(
              ...subCate.children.map(item => {
                return {
                  categoryNo: item.categoryNo,
                  label: item.label,
                  link_to: `/category/${params.rootCategoryNo}/${params.subCategoryNo}/${item.categoryNo}`
                }
              })
            )
          }
        } else {
          if (rootCate.children && rootCate.children.length > 0) {
            tempCategories.push(
              ...rootCate.children.map(item => {
                return {
                  categoryNo: item.categoryNo,
                  label: item.label,
                  link_to: `/category/${params.rootCategoryNo}/${item.categoryNo}`
                }
              })
            )
          }
        }

        const slickCategories = []
        let tempPage = []
        tempCategories.forEach(item => {
          tempPage.push(item)
          if (tempPage.length === 6) {
            slickCategories.push(tempPage)
            tempPage = []
          }
        })

        if (tempPage.length > 0) {
          slickCategories.push(tempPage)
        }
        state.slickCategories = slickCategories
      }
    }
  }
}
