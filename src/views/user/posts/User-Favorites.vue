<template>
    <PostList :post-list="PostStore.favoritesPost" @get-posts="getPosts"></PostList>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { usePostStore } from '@/stores/post'
import { type GetPostOption } from '../../../models/post/interface/index'
//获取仓库
const PostStore = usePostStore()
async function getPosts(option: GetPostOption) {
    await PostStore.getFavoritesPosts(option)
}
//先初始化获取数据
await PostStore.getFavoritesPosts()
</script>

<style scoped></style>
