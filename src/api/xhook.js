import localStorage from '../api/localStorage'
import xhook from 'xhook'

// 拦截发送请求
xhook.before(function(request) {
  const user = localStorage.getUser();
  // 附加请求头token信息
  // if (user && user.Token) {
  //   request.xhr.setRequestHeader('Authorization', user.Token)
  //   // request.xhr.setRequestHeader('ASP.NET_SessionId', user.token)
  // }
  // 附加请求头userId信息
  // if (user && user.userId) {
  //   request.xhr.setRequestHeader('x-session-userid', user.userId)
  // }
})
// 拦截返回请求
xhook.after(function(request, response) {
  // 当返回重新登录，跳转登录页
  // const responseData = JSON.parse(response.data)
  // if (responseData.State != null) {
  //   if (responseData.State === 401) {
  //     var confirmResult = confirm('帐号在其他地方登录')
  //     if (confirmResult) {
  //       removeToken()
  //       router.push({ path: '/login' })
  //     }
  //   }
  // }
  // if (response && response.data && response.data.toString().indexOf('请重新登录') !== -1) {
  //   // Toast('登录信息失效，请重新登录')
  //   router.push({ path: '/login' })
  // }
  // if (response.status === 403 || response.status === -1 || response.status === 0) {
  //   window.location.href = '/'
  // }
})
