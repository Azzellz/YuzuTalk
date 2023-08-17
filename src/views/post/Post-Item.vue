<template>
  <Post-Item-Normal v-if="!StatusStore.isEditing" :post="post"></Post-Item-Normal>
  <Post-Item-Edit v-else :post="post"></Post-Item-Edit>
</template>

<script setup lang="ts">
import PostItemNormal from './Post-Item-Normal.vue'
import PostItemEdit from './Post-Item-Edit.vue'

import { provide, computed, onMounted } from 'vue';
import { useStatusStore } from '../../stores/status'
import { usePostStore, POST_FROM } from '../../stores/post'
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

//定义要接收的Props
const props = defineProps<{
    id: string
    currentPage?: number
    pageSize?: number
}>()
//先静态注入当前页码和每页数量
provide('pageSize', props.pageSize)
provide('currentPage', props.currentPage)
//获取状态管理对象
const StatusStore = useStatusStore()
const PostStore = usePostStore()
const UserStore = useUserStore()
//获取post对象,首先要先去三个Posts中找,并且注入来源枚举值
let FROM:POST_FROM = POST_FROM.UNKNOWN;
const post = computed(() => {
  const postFromPosts = PostStore.posts.find((post) => post._id === props.id)
  if (postFromPosts) {
    // provide('POST_FROM', POST_FROM.LIST_POSTS)
    FROM = POST_FROM.LIST_POSTS
    return postFromPosts
  }
  const postFromUserPublished = UserStore.user.published.find((post) => post._id === props.id)
  if (postFromUserPublished) {
    // provide('POST_FROM', POST_FROM.USER_POSTS)
    FROM = POST_FROM.USER_POSTS
    return postFromUserPublished
  }
  const postFromUserFavorites = UserStore.user.favorites.find((post) => post._id === props.id)
  if (postFromUserFavorites) {
    // provide('POST_FROM', POST_FROM.USER_POSTS)
    FROM = POST_FROM.USER_POSTS
    return postFromUserFavorites
  }
  const postFromLatestPosts = PostStore.latestPosts.find((post) => post._id === props.id)
  if (postFromLatestPosts) {
    // provide('POST_FROM', POST_FROM.LATEST_POSTS)
    FROM = POST_FROM.LATEST_POSTS
    return postFromLatestPosts
  }
  return undefined
})
provide('POST_FROM', FROM)

//如果不存在,则跳转到文章列表页
onMounted(() => {
  if (!post.value) {
    ElMessage.error({
      message: '文章不存在',
      offset:80
    })
    const router = useRouter()
    router.push('/post/list')
  }
})

</script>

<style scoped></style>
