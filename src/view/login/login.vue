<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
    components: {
        LoginForm
    },
    methods: {
        ...mapActions([
            'handleLogin',
            'getUserInfo'
        ]),
        handleSubmit ({ userName, password }) {
            this.handleLogin({ userName, password }).then(res => {
                this.getUserInfo().then(res => {
                    this.$router.push({
                        name: this.$config.homeName
                    })
                })
            })
        }
    },
    mounted () {
        // var url = encodeURIComponent('http://localhost:8080/report/production_report')
        // var goto = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=appid&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=' + url)
        // var obj = DDLogin({
        //     id: 'login_container',
        //     goto: goto,
        //     style: 'border:none;background-color:#FFFFFF;',
        //     width: '365',
        //     height: '400'
        // })
    }
}
</script>

<style>
</style>
