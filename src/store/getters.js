import { hasAccessToken } from '@/utils/utils'
import cookies from 'js-cookie'
export default {
  isLogined (state) {
    return hasAccessToken()
  },
  memberStatus () {
    return cookies.get('memberStatus')
  }
}
