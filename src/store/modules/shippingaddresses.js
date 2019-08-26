import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_recent-addresses',
    property: 'recentAddresses',
    path: 'profile/shipping-addresses',
    onSuccess (state, res) {
      state.recentAddresses = res.data.recentAddresses || []
      if (state.recentAddresses.length > 5) {
        state.recentAddresses.splice(5, state.recentAddresses.length - 5)
      }
    }
  },
  {
    action: '_recent-delete',
    property: 'deleteRencent',
    path: 'profile/shipping-addresses/{addressNo}',
    pathParams: ['addressNo'],
    method: 'delete'
  },
  {
    action: '_recent-put',
    property: 'putRencent',
    path: 'profile/shipping-addresses/{addressNo}',
    pathParams: ['addressNo'],
    method: 'put'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    async recentAddresses ({ commit, dispatch, rootState }) {
      if (!rootState.memberIsLogin()) {
        return
      }
      await dispatch('_recent-addresses')
    },
    async deleteRecentAddresses ({ commit, dispatch, rootState }, addressNo) {
      if (!rootState.memberIsLogin()) {
        return
      }
      await dispatch('_recent-delete', { params: { addressNo } })
      return dispatch('_recent-addresses')
    },
    async putRecentAddress ({ commit, dispatch, rootState }, address) {
      if (!rootState.memberIsLogin()) {
        return
      }
      await dispatch('_recent-put', { params: { addressNo: address.addressNo }, data: address })
      return dispatch('_recent-addresses')
    }
  }
}
