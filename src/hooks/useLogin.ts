import axios from 'axios'
import {  ref } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'

export function useLogin() {
    //初始化数据
    const account = ref('')
    const password = ref('')
    //登录的逻辑
    function login() {
        axios
            .post('/login', {
                account: account.value,
                password: password.value
            })
            .then(({ data: { data } }) => {
                console.log(data)
                localStorage.setItem('token', data.token)
                localStorage.setItem('user_id', data.user_id)
                localStorage.setItem('user_name', data.user_name)
                localStorage.setItem('user_account', data.user_account)
                localStorage.setItem('avatar', data.avatar)
                //跳转到首页
                router.replace('/home')
                //提示登录成功
                ElMessage.success({
                    message: '登录成功',
                    offset: 80
                })
            })
            .catch((err) => {
                //登录失败
                ElMessage.error({
                    message: '登录失败',
                    offset: 80
                })
                console.log(err)
            })
    }
    return {
        account,
        password,
        login
    }
}
