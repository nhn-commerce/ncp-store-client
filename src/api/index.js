import createApiStoreCreator from './createApiStoreCreator'
import ncpApi from './ncpApi'

const createNcpApiStore = createApiStoreCreator(ncpApi)

export {
  ncpApi as default,
  ncpApi,
  createNcpApiStore
}
