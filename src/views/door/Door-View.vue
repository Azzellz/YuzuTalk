<template>
    <div class="container">
        <div class="box">
            <h1 class="title">Yuzu</h1>
            <el-tabs v-model="activeName" class="tabs">
                <el-tab-pane name="login">
                    <template #label>
                        <span class="label" :style="loginLabelStyle">登录</span>
                    </template>
                    <LoginView></LoginView>
                </el-tab-pane>
                <el-tab-pane name="register">
                    <template #label>
                        <span class="label" :style="registerLabelStyle">注册</span>
                    </template>
                    <RegisterView></RegisterView>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import LoginView from './Login-View.vue'
import RegisterView from './Register-View.vue'
//标签初始选择
const activeName = ref('login')
//标签样式
const loginLabelStyle = computed(() => {
    if (activeName.value === 'login') {
        return {
            fontSize: '20px'
        }
    } else {
        return {
            fontWeight: '700'
        }
    }
})
const registerLabelStyle = computed(() => {
    if (activeName.value === 'register') {
        return {
            fontSize: '20px'
        }
    } else {
        return {
            fontWeight: '700'
        }
    }
})
</script>

<style lang="less" scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('@/../public/beauty.jpg') fixed no-repeat;
    background-size: cover;
    &:before {
        content: '';
        position: absolute; /* 一定要用绝对定位 */
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
    }
    .box {
        padding: 50px 80px;
        border: none;
        background-color: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        border-radius: 25px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        * {
            margin: 10px;
        }
        .title {
            color: #3d5245;
            margin-bottom: 20px;
        }
    }
}
</style>
