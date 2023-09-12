<template>
    <div class="container">
        <el-card class="left">
            <div class="user-info">
                <div class="user-avatar">
                    <el-avatar :size="100" :src="avatarURL(user.avatar)"></el-avatar>
                </div>
                <div class="user-item">
                    <div><span>用户名:</span>{{ user.user_name }}</div>
                    <div><span>账号:</span>{{ user.account }}</div>
                    <div><span>已发布:</span>{{ user.published.length }}篇</div>
                    <div><span>已收藏:</span>{{ user.favorites.length }}篇</div>
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
import UserCard from '@/components/Card/User-Card.vue'
import UserFavorites from '../posts/User-Favorites.vue'
import UserPublished from '../posts/User-Published.vue'

import { avatarURL } from '@/utils/index'
import { useUserStore } from '@/stores/modules/user'
import { useStatusStore } from '@/stores/modules/status'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { UserAPI } from '@/api/modules/user';

//初始化
//#region
//获取User
const UserStore = useUserStore()
const user = UserStore.currentUser.origin
//获取状态管理
const StatusStore = useStatusStore()
//默认指向发布tab
const activeName = ref<string>('published')
//#endregion

//用户相关的逻辑
//#region
//退出登录
const router = useRouter()
function quitLogin() {
    localStorage.clear() //清空本地存储
    router.replace('/door') //跳转到登录界面
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
        } = await UserAPI.delete('/', {
            headers: {
                Authorization: localStorage.getItem('token')
            },
            params:{
                id:localStorage.getItem('user_id')
            }
        })
        localStorage.clear() //清空本地存储
        router.replace('/door') //导航至登录页面
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

<style lang="less" scoped>
.container {
    display: flex;
    padding: 30px;
    .left {
        margin: 10px;
        flex: 0.3;
        height: 700px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        .user-info {
            .user-item {
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 30px;
                font-weight: bold;
                * {
                    margin: 5px 0;
                }
                span {
                    color: rgb(189, 189, 189);
                    font-weight: normal;
                }
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
        height: 700px;
        overflow: auto;
    }
}
</style>
