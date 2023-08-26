<template>
    <div>
        <div class="title">个人中心</div>
        <el-divider content-position="right">自己</el-divider>
        <el-card class="user-info">
            <div class="user-item">
                <el-avatar :size="100" :src="avatarURL(user.avatar)"></el-avatar>
            </div>
            <div class="user-item">
                <el-input
                    v-model="user.user_name"
                    style="margin: 10px"
                    placeholder="用户名"
                    maxlength="8"
                    show-word-limit
                >
                    <template #prepend>用户名:</template>
                </el-input>
                <el-input
                    v-model="user.account"
                    style="margin: 10px"
                    placeholder="密码"
                    minlength="6"
                >
                    <template #prepend>密码:</template>
                </el-input>
            </div>
            <div class="btn-box">
                <el-button type="danger" @click="save">保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import {   toRaw } from 'vue'
import { useUserStore } from '@/stores/user'
import { avatarURL } from '@/utils/index'
import { useStatusStore } from '../../../stores/status'
import { ElMessage } from 'element-plus'

//编辑用户信息相关的逻辑
//#region
//获取状态管理
const UserStore = useUserStore()
const StatusStore = useStatusStore()
//获取原始用户信息
const originUser = toRaw(UserStore.currentUser.origin)
const user = UserStore.currentUser.origin
//同步本地存储
function updateLocalStroage() {
    localStorage.setItem('user_name', user.user_name)
}
//检查编辑输入
function checkInput() {
    if (user.user_name.trim() === '') {
        ElMessage.error({
            message: '用户名不能为空!',
            offset: 80
        })
        return false
    } else if (user.user_name.trim() === originUser.user_name){
        //用户信息未被修改
        ElMessage.success({
            message: '保存成功!',
            offset: 80
        })
        StatusStore.isEditing = false
        return false
    }else {
        return true
    }
}
//保存
async function save() {
    //检查输入
    if (!checkInput()) return
    try {
        //更新用户信息
        await UserStore.updateUser(user)
        //刷新用户信息
        await UserStore.getCurrentUser()
        //同步本地存储
        updateLocalStroage()
        //退出编辑状态
        StatusStore.isEditing = false
        //弹窗提示
        ElMessage.success({
            message: '保存成功!',
            offset: 80
        })
    } catch (error) {
        //提示失败
        ElMessage.error({
            message: '保存失败',
            offset: 80
        })
    }
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
}
.btn-box {
    display: flex;
    justify-content: center;
}
</style>
