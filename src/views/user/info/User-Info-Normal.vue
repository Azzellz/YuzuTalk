<template>
    <div>
        <div class="title">个人中心</div>
        <el-divider content-position="right">自己</el-divider>
        <el-card class="user-info">
            <div class="user-item">
                <el-avatar :size="100" :src="avatarURL(user.avatar)"></el-avatar>
            </div>
            <div class="user-item">
                <div>用户名:</div>
                <div>{{ user.user_name }}</div>
            </div>
            <div class="user-item">
                <div>账号:</div>
                <div>{{ user.account }}</div>
            </div>
            <div class="btn-box">
                <el-popconfirm title="确定退出登录吗" @confirm="quitLogin">
                    <template #reference>
                        <el-button type="warning" style="flex: 1">退出登录</el-button>
                    </template>
                </el-popconfirm>
                <el-popconfirm title="确定要注销吗" @confirm="deregistration">
                    <template #reference>
                        <el-button type="danger" style="flex: 1">注销</el-button>
                    </template>
                </el-popconfirm>
                <el-button type="primary" style="flex: 1" @click="goingEdit">编辑</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { avatarURL } from '@/utils/index'
import { useUserStore } from '@/stores/user'
import { useStatusStore } from '@/stores/status'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import axios from 'axios'

//获取User
const UserStore = useUserStore()
const user = UserStore.currentUser.origin
//获取状态管理
const StatusStore = useStatusStore()
//用户相关的逻辑
//#region
//退出登录
const router = useRouter()
function quitLogin() {
    localStorage.clear() //清空本地存储
    router.replace('/login') //跳转到登录界面
    ElMessage.success({
        message: '退出登录成功!',
        offset: 80
    })
}
//注销
async function deregistration() {
    try {
        const {
            data: { data }
        } = await axios.delete(`/user?id=${localStorage.getItem('user_id')}`, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        localStorage.clear() //清空本地存储
        router.replace('/login') //导航至登录页面
        console.log(data)
        ElMessage.success({
            message: '注销成功!',
            offset: 80
        })
    } catch (error) {
        console.log(error)
    }
}
//修改用户信息---进入编辑模式
function goingEdit() {
    //进入编辑模式
    StatusStore.isEditing = true
    ElMessage.success({
        message: '进入编辑模式',
        offset: 80
    })
}
//#endregion
</script>

<style scoped>
.user-info {
    display: flex;
    flex-direction: column;
    width: 80%;
    min-height: 500px;
    margin: 0 auto;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}
.user-item {
    margin: 30px;
    display: flex;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
}
.btn-box {
    display: flex;
}
</style>
