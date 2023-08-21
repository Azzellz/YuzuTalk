<template>
  <div class="container" v-if="isReady">
    <div class="recent-posts">
      <h1 style="text-align: center">最新</h1>
      <PostCard v-for="post in postStore.latestPosts" :key="post._id" :post="post" />
    </div>
    <div class="recent-users">
      <div class="hot-user-post">
        <h1 style="text-align: center; margin: 20px">您</h1>
        <div class="user-box">
          <router-link
            :to="{
              path: '/user/other',
              query: {
                id: userStore.user._id,
                title: userStore.user.user_name
              }
            }"
          >
            <el-avatar :size="120" :src="avatarURL(userStore.user.avatar)" fit="fill" style="margin: 20px"></el-avatar>
          </router-link>

          <div class="user-meta">
            <h1 style="color: black">{{ userStore.user.user_name }}</h1>
            <p>发表了{{ userStore.publishedTotal }}篇帖子</p>
            <p>收藏了{{ userStore.favoritesTotal }}篇帖子</p>
          </div>
        </div>
      </div>
      <div class="recent-visitor">
        <h1 style="text-align: center; margin: 20px">最近访客</h1>
        <div style="padding: 20px">
          <!-- 这里应该套上一层router-view,点击用户头像即可跳转到目标用户界面 -->
          <router-link
            v-for="user in userStore.recentUsers"
            :key="user._id"
            :to="{
              path: '/user/other',
              query: {
                id: user._id,
                title: user.user_name
              }
            }"
            ><el-avatar :size="50" :src="avatarURL(user.avatar)" style="margin: 10px"></el-avatar>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePostStore } from '@/stores/post'
import PostCard from '../post/card/Post-Card.vue'
import { useUserStore } from '@/stores/user'
import { avatarURL } from '@/utils/index';

//初始化数据
//#region
const postStore = usePostStore()
const userStore = useUserStore()
const isReady = ref(false)
await Promise.all([postStore.getLatestPosts(), userStore.getUser(), userStore.getRecentUsers()])
isReady.value = true
//#endregion


</script>

<style scoped>
.container {
  margin-top: 60px;
  padding: 50px;
  display: flex;
}
.recent-posts {
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 610px;
  overflow: auto;
  box-shadow: 0 0 10px #ccc;
  margin: 20px;
  padding: 50px;
  border-radius: 10px;
  flex: 0.6;
}
.recent-users {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  flex: 0.4;
}
.hot-user-post {
  box-shadow: 0 0 10px #ccc;
  margin: 20px;
  border-radius: 10px;
  flex: 0.5;
}
.recent-visitor {
  box-shadow: 0 0 10px #ccc;
  margin: 20px;
  border-radius: 10px;
  flex: 0.5;
}

.user-box {
  display: flex;
  padding: 20px;
}
.user-meta {
  padding: 25px;
  line-height: 1.5;
  flex: 1;
  text-align: center;
  color: #999999;
}
</style>
