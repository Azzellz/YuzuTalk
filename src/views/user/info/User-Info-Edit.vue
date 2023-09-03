<template>
    <div class="container">
        <el-card class="left">
            <div class="user-info">
                <div class="user-avatar">
                    <el-avatar :size="100" :src="avatarURL(user.avatar)"></el-avatar>
                </div>
                <div class="user-item">
                    <el-input
                        v-model="user.user_name"
                        style="margin: 10px 0"
                        placeholder="用户名"
                        maxlength="8"
                        show-word-limit
                    >
                        <template #prepend>用户名:</template>
                    </el-input>
                    <el-input
                        v-model="user.account"
                        style="margin: 10px 0"
                        placeholder="密码"
                        minlength="6"
                    >
                        <template #prepend>密码:</template>
                    </el-input>
                </div>
                <el-button type="danger" @click="save">保存</el-button>
            </div>
            <el-divider content-position="left">关注</el-divider>
            <div class="user-follows">
                <el-space wrap>
                    <UserCard
                        v-for="user in UserStore.currentUser.origin.follows"
                        :key="user._id"
                        :user="user"
                    ></UserCard>
                </el-space>
            </div>
        </el-card>
        <el-card class="right">
            <el-tabs v-model="activeName">
                <el-tab-pane label="发布的帖子" name="published">
                    <UserPublished></UserPublished>
                </el-tab-pane>
                <el-tab-pane label="收藏的帖子" name="favorites">
                    <UserFavorites></UserFavorites>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import UserCard from '../card/User-Card.vue'
import UserFavorites from '../posts/User-Favorites.vue'
import UserPublished from '../posts/User-Published.vue'

import { ref, toRaw } from 'vue'
import { useUserStore } from '@/stores/user'
import { avatarURL } from '@/utils/index'
import { useStatusStore } from '../../../stores/status'
import { ElMessage } from 'element-plus'

//编辑用户信息相关的逻辑
//#region
//获取状态管理
const UserStore = useUserStore()
const StatusStore = useStatusStore()
//初始化指向tab
const activeName = ref<string>('published')
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
    } else if (user.user_name.trim() === originUser.user_name) {
        //用户信息未被修改
        ElMessage.success({
            message: '保存成功!',
            offset: 80
        })
        StatusStore.isEditing = false
        return false
    } else {
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
.container {
    display: flex;
    .left {
        margin: 10px;
        flex: 0.3;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        .user-info {
            display: flex;
            flex-direction: column;
            .user-avatar {
            }
            .user-item {
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 30px;
                font-weight: bold;
            }
            .btn-box {
                display: flex;
            }
        }
        .user-follows {
            display: flex;
        }
    }
    .right {
        margin: 10px;
        flex: 0.7;
    }
}
</style>
