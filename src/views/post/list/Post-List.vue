<template>
    <PostList :post-list="PostStore.mainPosts" @get-posts="getPosts" />
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { usePostStore } from '@/stores/modules/post'
import { type I_GetPostOption } from '@/models/modules/post/interface/index'
//获取仓库
const PostStore = usePostStore()
async function getPosts(option: I_GetPostOption) {
    await PostStore.getPosts(option)
}
</script>

<style scoped></style>
