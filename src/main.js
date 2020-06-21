import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './api/xhook'
import localStorage from './api/localStorage'
import 'lib-flexible/flexible'
// import FastClick from 'fastclick'
import $ from 'jquery'
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/reset.css'
import './assets/styles/border.css'
import './assets/styles/public.css'
import qs from 'qs'
import moment from 'moment'

Vue.config.productionTip = false;
// FastClick.attach(document.body);
Vue.prototype.$ = $
Vue.prototype.$qs = qs;
Vue.prototype.$moment = moment;
Vue.use(ElementUI);
Vue.use(Vant);

Vue.prototype.getRight = function (path) {
  return true
  let user = localStorage.getUser()
  for (var _i = 0; _i < user.routes.length; ++_i) {
    if (user.routes[_i] == path) {
      return true
    }
  }
  return false
}

new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  render: h => h(App)
})
