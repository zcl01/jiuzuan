import router from '../router'
import { removeToken } from '../utils/auth'

export function validateLogin(message) {
  if (message === '该账号已被登陆，请重新登录。') {
    var confirmResult = confirm('帐号在其他地方登录')
    if (confirmResult) {
      removeToken()
      router.push({ path: '/login' })
    }
  }
}
