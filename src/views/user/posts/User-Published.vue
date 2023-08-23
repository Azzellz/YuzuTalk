<template>
    <PostList :post-list="PostStore.publishedPost" @get-posts="getPosts"></PostList>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { usePostStore } from '@/stores/post'
import { type GetPostOption } from '../../../models/post/interface/index'
//获取仓库
const PostStore = usePostStore()
async function getPosts(option: GetPostOption) {
    await PostStore.getPublishedPosts(option)
}
//先初始化获取数据
await PostStore.getPublishedPosts()
</script>

<style scoped></style>