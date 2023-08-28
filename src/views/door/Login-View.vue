<template>
    <div class="login-box">
        <el-input placeholder="请输入账号" class="input" v-model="account"></el-input>
        <el-input v-model="password" placeholder="密码" class="input" show-password></el-input>
        <div class="buttons">
            <el-button type="primary" style="flex: 0.8" @click="login">登录</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/hooks/useLogin'
//使用LoginHooks
const { account, password, login } = useLogin()
</script>

<style lang="less" scoped>
.login-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    * {
        margin: 10px;
    }
    .input {
        width: 16rem;
    }
    .buttons {
        width: 18rem;
        justify-content: space-around;
        display: flex;
    }
}
</style>
