import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    bShow_order: false, // 显示订单详情页面的
    order: {}
  },
  mutations: {
    traggle(state) {
      state.bShow_order = !state.bShow_order
    },
    orderSetter(state, newOrder) {
      console.log(newOrder)
      state.order = newOrder
    }
  },
  actions: {
    //
  },
  modules: {
    user,
    app
  }
})
