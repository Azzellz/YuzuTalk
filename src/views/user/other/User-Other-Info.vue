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
            <h1 style="margin: 10px auto">用户名:{{ UserStore.otherUser.origin.user_name }}</h1>
            <h2 style="margin: 10px auto; color: #ccc; font-weight: 500">
                账号:{{ UserStore.otherUser.origin.account }}
            </h2>
            <h6 style="margin: 10px auto; color: #ccc">
                帖子数:{{ UserStore.otherUser.publishedPosts.total }} 被关注数:{{
                    UserStore.otherUser.origin.fans.length
                }}
            </h6>
        </div>
        <div class="right">
            <!-- 右侧用来展示帖子 -->
            <h1 style="margin: 20px">作品</h1>
            <PostList
                :postList="UserStore.otherUser.publishedPosts"
                :listHeight="450"
                @getPosts="getPosts"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { useUserStore } from '@/stores/modules/user'
import { avatarURL } from '@/utils/index'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UserAPI } from '@/api/modules/user'
import type { I_GetPostOption } from '@/models/modules/post/interface'
import { usePostStore } from '@/stores/modules/post'

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
//分页逻辑函数组装
//#region
const PostStore = usePostStore()
async function getPosts(option: I_GetPostOption) {
    await PostStore.getOtherUserPublishedPosts(option)
}
//#endregion
//判断是否已经关注
//#region
const isFollowed = ref(false)
async function checkIsFollowed() {
    try {
        const {
            data: { data }
        } = await UserAPI.get(`/isFollow`, {
            params: {
                user_id: localStorage.getItem('user_id'),
                follow_id: id
            }
        })
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
        await UserAPI.put('/follow', {
            user_id: localStorage.getItem('user_id'),
            follow_id: id
        })
        ElMessage.success({
            message: '关注成功',
            offset: 80
        })
        isFollowed.value = true
        await UserStore.getCurrentUser()
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
        await UserAPI.put('/unFollow', {
            user_id: localStorage.getItem('user_id'),
            follow_id: id
        })
        ElMessage.success({
            message: '取关成功',
            offset: 80
        })
        isFollowed.value = false
        await UserStore.getCurrentUser()
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
