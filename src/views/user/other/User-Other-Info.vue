<template>
    <div class="container">
        <div class="left">
            <!-- 左侧用来展示个人资料 -->
            <el-avatar
                :size="200"
                :src="avatarURL(UserStore.otherUser.origin.avatar)"
                style="margin: 50px auto"
            ></el-avatar>
            <el-button v-if="!isFollowed" style="margin: 10px auto" @click="follow" type="primary"
                >关注</el-button
            >
            <el-button v-else style="margin: 10px auto" type="danger" @click="unFollow"
                >取消关注</el-button
            >
            <h1 style="margin: 10px auto">{{ UserStore.otherUser.origin.user_name }}</h1>
            <h2 style="margin: 10px auto; color: #ccc; font-weight: 500">
                {{ UserStore.otherUser.origin.account }}
            </h2>
            <div style="margin: 10px auto">
                帖子数:{{ UserStore.otherUser.publishedPosts.total }} 被关注数:{{
                    UserStore.otherUser.origin.fans.length
                }}
            </div>
        </div>
        <div class="right">
            <!-- 右侧用来展示帖子 -->
            <h1 style="margin: 20px">作品</h1>
            <!-- 这里没做分页,可能会有性能问题 -->
            <div style="padding: 20px; height: 600px; overflow: auto">
                <PostCard
                    v-for="post in UserStore.otherUser.publishedPosts.list"
                    :key="post._id"
                    :post="post"
                    :FROM="UserStore.otherUser.publishedPosts.FROM"
                ></PostCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import PostCard from '@/views/post/card/Post-Card.vue'

import { useUserStore } from '@/stores/user'
import { avatarURL } from '../../../utils/index'
import axios from 'axios'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

//初始化
//#region
//显示声明接收id参数
const props = defineProps<{
    id: string
    title: string //在顶部导航显示user_name
}>()
const id = props.id
//获取当前浏览的用户信息
const UserStore = useUserStore()
try {
    //等待获取当前浏览的用户信息完成
    await UserStore.getOtherUser(id)
    await UserStore.getOtherUserPublishedPosts()
} catch (error) {
    console.log(error)
}
//#endregion
//判断是否已经关注
//#region
const isFollowed = ref(false)
async function checkIsFollowed() {
    try {
        const {
            data: { data }
        } = await axios.get(
            `/user/isFollow?user_id=${localStorage.getItem('user_id')}&follow_id=${id}`
        )
        isFollowed.value = data
    } catch (error) {
        console.log(error)
    }
}
await checkIsFollowed()
//#endregion

//关注与取关的逻辑
//#region
//关注
async function follow() {
    try {
        await axios.put('/user/follow', {
            user_id: localStorage.getItem('user_id'),
            follow_id: id
        })
        ElMessage.success({
            message: '关注成功',
            offset: 80
        })
        isFollowed.value = true
    } catch (error) {
        ElMessage.error({
            message: '关注失败',
            offset: 80
        })
        console.log(error)
    }
}
//取关
async function unFollow() {
    try {
        await axios.put('/user/unFollow', {
            user_id: localStorage.getItem('user_id'),
            follow_id: id
        })
        ElMessage.success({
            message: '取关成功',
            offset: 80
        })
        isFollowed.value = false
    } catch (error) {
        ElMessage.error({
            message: '取注失败',
            offset: 80
        })
        console.log(error)
    }
}
//#endregion
</script>

<style scoped>
.container {
    display: flex;
}
.left {
    flex: 0.3;
    margin: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;

    display: flex;
    flex-direction: column;
    align-items: start;
}
.right {
    flex: 0.7;
    margin: 50px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;

    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
