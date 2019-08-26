import { createNcpApiStore } from '@/api'

const apiStore = createNcpApiStore([
  {
    action: '_postPaymentsReserve',
    property: 'reserve',
    path: 'payments/reserve',
    method: 'post'
  }
])

export default {
  namespaced: true,
  mixins: [apiStore],
  actions: {
    postPaymentsReserve ({ state, dispatch, commit }, paymentRequest) {
      return dispatch('_postPaymentsReserve', { data: paymentRequest })
    }
  }
}
