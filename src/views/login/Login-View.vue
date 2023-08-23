<template>
  <div class="login-container center">
    <div class="login-box">
      <h1 class="login-title">Yuzu</h1>
      <el-input placeholder="请输入账号" class="login-input" v-model="account"></el-input>
      <el-input v-model="password" placeholder="密码" class="login-input" show-password></el-input>
      <div class="login-button-box">
        <el-button type="primary" style="flex: 0.8" @click="login">登录</el-button>
        <el-button type="info" @click="toRegister">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

onMounted(() => {
  //如果有token则直接跳转到home,不允许再进入登录页面
  localStorage.getItem('token') && router.replace('/home')
})

const account = ref('')
const password = ref('')
const router = useRouter()

function login() {
  axios
    .post('/login', {
      account:account.value,
      password:password.value
    })
    .then(({ data: { data } }) => {
      console.log(data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user_id', data.user_id)
      localStorage.setItem('user_name', data.user_name)
      localStorage.setItem('user_account', data.user_account)
      localStorage.setItem('avatar', data.avatar)
      //跳转到首页
      router.replace('/')
      //提示登录成功
      ElMessage.success({
        message: '登录成功',
        offset: 80
      })
    })
    .catch((err) => {
      //登录失败
      ElMessage.error({
        message: "登录失败",
        offset: 80
      })
      console.log(err)
    })
}
function toRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('@/../public/beauty.jpg') fixed no-repeat;
  background-size: cover;
}
.login-container::before {
  content: '';
  position: absolute; /* 一定要用绝对定位 */
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
}
.login-box {
  padding: 50px 80px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-box * {
  margin: 10px;
}
.login-input {
  width: 16rem;
}
.login-title {
  color: #3d5245;
  margin-bottom: 20px;
}
.login-button-box {
  width: 18rem;
  justify-content: space-around;
  display: flex;
}
</style>
