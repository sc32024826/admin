import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setTitle } from '@/libs/util'
import applicationUserManager from '@/Auth/applicationusermanager'

Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history'
})

var storeTemp = store
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    // const token = getToken()
    if (!storeTemp.state.token) {
        storeTemp.commit('saveToken', window.localStorage.Token)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        let ss = storeTemp.state.token
        console.log(typeof ss)
        if (ss && ss !== 'undefined') {
            // 通过vuex state获取当前的token是否存在
            console.log('token 已存在')
            console.log(storeTemp.state.token)
            next()
        } else {
            console.log('认证')
            // 这里使用Id4授权认证，用Jwt，请删之，并把下边的跳转login 打开；
            applicationUserManager.login()
        }
    } else {
        next()
    }
})

router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
