<template>
    <PostList :post-list="postList" @get-posts="getPosts" :list-height="350"></PostList>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { usePostStore } from '@/stores/modules/post'
import { type I_GetPostOption } from '@/models/modules/post/interface/index'
import { useUserStore } from '@/stores/modules/user'
//获取仓库
const PostStore = usePostStore()
const UserStore = useUserStore()
//获取postList
const postList = UserStore.currentUser.publishedPosts
async function getPosts(option: I_GetPostOption) {
    await PostStore.getCurrentUserPublishedPosts(option)
}
//先初始化获取数据
try {
    await PostStore.getCurrentUserPublishedPosts()
} catch (error) {
    console.log(error)
}
</script>

<style scoped></style>
