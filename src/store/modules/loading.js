export default {
  namespaced: true,
  state: {
    loading: true
  },
  mutations: {
    done (state) {
      state.loading = false
    },
    init (state) {
      state.loading = true
    }
  }
}
