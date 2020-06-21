import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from "vuex-persistedstate"
import app from './modules/app'
import user from './modules/user'
//import permission from './modules/permission'
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  getters,
  app,
  user,
  state,
  mutations,
  actions,
  // plugins: [createPersistedState({
  //   storage: window.sessionStorage
  // })]
})

export default store
