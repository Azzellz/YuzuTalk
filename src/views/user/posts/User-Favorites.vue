<template>
    <PostList :post-list="postList" @get-posts="getPosts" :list-height="350"></PostList>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import type { I_GetPostOption } from '@/models/post/interface/index'
//获取仓库
const PostStore = usePostStore()
const UserStore = useUserStore()
//获取postList
const postList = UserStore.currentUser.favoritesPosts
async function getPosts(option?: I_GetPostOption) {
    PostStore.getCurrentUserFavoritesPosts(option)
}
//先初始化获取数据
try {
    // if (UserStore.currentUser.favoritesPosts.isEmpty()) {
    await PostStore.getCurrentUserFavoritesPosts()
    // }
} catch (error) {
    console.log(error)
}
</script>

<style scoped></style>
