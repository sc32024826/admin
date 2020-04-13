import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: null
    },
    mutations: {
        saveToken (state, data) {
            state.token = data
            window.localStorage.setItem('Token', data)
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
