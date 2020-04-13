import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setTitle } from '@/libs/util'
// import config from '@/config'
import applicationUserManager from '@/Auth/applicationusermanager'

// const { homeName } = config
Vue.use(Router)
const router = new Router({
    routes,
    mode: 'history'
})
// const LOGIN_PAGE_NAME = 'login'

// const turnTo = (to, access, next) => {
//     if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
//     else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
// }

var storeTemp = store
router.beforeEach((to, from, next) => {
    console.log('跳转前判断')
    iView.LoadingBar.start()
    // const token = getToken()
    if (!storeTemp.state.token) {
        console.log('未设置token')
        storeTemp.commit('saveToken', window.localStorage.Token)
    }
    if (to.meta.requireAuth) {
        // 判断该路由是否需要登录权限
        if (storeTemp.state.token) {
            // 通过vuex state获取当前的token是否存在
            console.log(storeTemp.state.token)
            next()
        } else {
            console.log('需要认证')
            // 这里使用Id4授权认证，用Jwt，请删之，并把下边的跳转login 打开；
            applicationUserManager.login()

            // 这里使用Jwt登录，如果不用Id4授权认证，这里打开它；
            // next({
            //   path: "/login",
            //   query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            // });
        }
    } else {
        next()
    }
})
// else {
//     if (store.state.user.hasGetInfo) {
//         turnTo(to, store.state.user.access, next)
//     } else {
//         // store.dispatch('getUserInfo').then(user => {
//         //     // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
//         //     turnTo(to, user.access, next)
//         // }).catch(() => {
//         //     setToken('')
//         //     next({
//         //         name: 'login'
//         //     })
//         // })
//         console.log('22')
//         applicationUserManager.login()
//         debugger
//     }
// }
router.afterEach(to => {
    setTitle(to, router.app)
    iView.LoadingBar.finish()
    window.scrollTo(0, 0)
})

export default router
