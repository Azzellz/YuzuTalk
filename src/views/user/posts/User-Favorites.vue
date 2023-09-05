<template>
    <PostList :post-list="postList" @get-posts="getPosts"></PostList>
</template>

<script setup lang="ts">
import PostList from '@/components/List/Post-List.vue'
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import type { GetPostOption } from '@/models/post/interface/index'
//获取仓库
const PostStore = usePostStore()
const UserStore = useUserStore()
//获取postList
const postList = UserStore.currentUser.favoritesPosts
async function getPosts(option?: GetPostOption) {
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
