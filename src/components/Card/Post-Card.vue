<template>
    <router-link
        :to="{
            path: '/post/item',
            query: {
                id: post._id,
                FROM: FROM
            }
        }"
    >
        <el-card class="post-card">
            <div class="user-info">
                <template v-if="!post.isUnknown">
                    <UserAvatarRoute :user="post.user" />
                    <div style="flex: 1">
                        {{ postInfo }}
                    </div>
                </template>
                <template v-else>
                    <el-avatar icon="el-icon-user-solid" :size="50"></el-avatar>
                    <div style="flex: 1">{{ postInfo }}</div>
                </template>
                <div style="font-size: 15px; color: #999">{{ postMeta }}</div>
            </div>
            <el-divider v-if="post.tags.length"></el-divider>
            <el-tag
                v-for="(tag, index) in post.tags"
                :key="index"
                :disable-transitions="false"
                style="margin: 0 5px"
            >
                {{ tag }}
            </el-tag>
            <el-divider></el-divider>
            <div class="title">{{ post.title }}</div>
            <div v-if="post.isShowContent">
                <el-divider></el-divider>
                <div>
                    {{ postContent }}
                </div>
            </div>
        </el-card>
    </router-link>
</template>

<script setup lang="ts">
import UserAvatarRoute from '@/components/User/User-Avatar-Route.vue'
import { computed } from 'vue'
import { getBetterFormatTime } from '@/utils/index'
import type { POST_FROM } from '@/models/modules/post/enum'
import type { I_Post } from '@/models/modules/post/interface'

//声明接收props
const props = defineProps<{
    post: I_Post
    FROM: POST_FROM
}>()
//展示post相关信息的逻辑
//#region
//postMeta: post元信息
const postMeta = computed(() => {
    return `👍:${props.post.support} 👎:${props.post.oppose} ⭐:${props.post.follow} 评论:${props.post.comments.length}`
})
//postInfo: post发布人信息
const postInfo = computed(() => {
    return props.post.isUnknown
        ? `匿名用户 发表于 ${betterFormatTime.value}`
        : `${props.post.user.user_name} 发表于 ${betterFormatTime.value}`
})
//postContent: 过滤后的post内容
const postContent = computed(() => {
    return props.post.content.substring(0, 100) + '...'
})
//betterFormatTime: 更好的格式化时间
const betterFormatTime = getBetterFormatTime(props.post.format_time)
//#endregion
</script>

<style scoped>
a {
    display: flex;
    justify-content: center;
    text-decoration: none;
    width: fit-content;
    height: fit-content;
    width: 50vw;
}
.post-card {
    width: 100%;
    min-height: 200px;
    margin: 20px;
    cursor: pointer;
}
.user-info {
    display: flex;
}
.user-info div {
    display: flex;
    font-size: 20px;
    font-weight: bold;
    align-items: center;
    padding: 0 20px;
}
.post-info {
    font-size: 15px;
    color: #999;
    padding: 0 20px;
}
.title {
    font-size: 30px;
    font-weight: bold;
    text-align: left;
    line-height: 1.5;
}
</style>
