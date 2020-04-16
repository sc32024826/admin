<template>
    <div>
        <div desktop=12 tablet=8>
            <h1>Login successful</h1>
            <h1>Your browser should be redirected soon</h1>
        </div>
    </div>
</template>
<script>
import applicationUserManager from '../Auth/applicationusermanager'

export default {
    name: 'logincallback-view',
    data () {
        return {
        }
    },
    async created () {
        try {
            // 核心的就是这里了
            await applicationUserManager.signinRedirectCallback()
            let user = await applicationUserManager.getUser()
            // 将 token 存储在客户端
            this.$store.commit('saveToken', user.access_token)
            // 调整首页
            this.$router.push({ name: 'home' })
        } catch (e) {
            console.log(e)
            this.$root.$emit('show-snackbar', { message: e })
        }
    }
}
</script>
