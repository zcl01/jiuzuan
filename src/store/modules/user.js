import {logout, getUserInfo} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'
import localStorage from '../../api/localStorage'
import {api} from '../../api'

const user = {
  state: {
    Handle: null,
    Cornet: null,
    Headportrait: null,
  },

  mutations: {

  },
  actions: {

  }
}

export default user
