<template>
  <div class="post-box">
    <h1 class="post-title">{{ currentPost.title }}</h1>
    <h6 class="info-box">
      <template v-if="!currentPost.isUnknown">
        <router-link
          :to="{
            path: '/user/other',
            query: {
              id: currentPost.user._id,
              title: currentPost.user.user_name
            }
          }"
        >
          <el-avatar :size="40" :src="avatarURL(currentPost.user.avatar)"></el-avatar>
        </router-link>

        <div class="info-text">{{ postInfo }}</div>
      </template>
      <template v-else>
        <el-avatar icon="el-icon-user-solid" :size="40"></el-avatar>
        <div class="info-text">{{ unknownPostInfo }}</div>
      </template>

      <div class="info-tags">
        <el-tag
          v-for="(tag, index) in currentPost.tags"
          :key="index"
          :disable-transitions="false"
          style="margin: 5px"
        >
          {{ tag }}
        </el-tag>
      </div>
    </h6>
    <el-divider>内容</el-divider>
    <el-card class="content-box">{{ currentPost.content }}</el-card>
    <el-divider>评论</el-divider>
    <PostComment></PostComment>
  </div>
</template>

<script setup lang="ts">
import PostComment from '../comment/Post-Comment.vue'
import { type Post } from '@/stores/post'
import { avatarURL } from '@/utils/index'
import { computed } from 'vue'
import { useStatusStore } from '@/stores/status'
const StatusStore = useStatusStore()
//获取当前帖子
const currentPost: Post = StatusStore.currentPost
//非匿名帖子的信息
const postInfo = computed(() => {
  return `${currentPost.user.user_name} 于 ${currentPost.format_time} 发布 | 👍:${currentPost.support} 👎:${currentPost.oppose} | 评论数:${currentPost.comments.length}`
})
//匿名的帖子信息
const unknownPostInfo = computed(() => {
  return `匿名用户 于 ${currentPost.format_time} 发布 | 👍:${currentPost.support} 👎:${currentPost.oppose} | 评论数:${currentPost.comments.length}`
})
</script>

<style scoped>
.post-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.content-box {
  white-space: pre-line;
  width: 80%;
  min-height: 600px;
  overflow: hidden;
}
.info-box {
  color: grey;
  display: flex;
}
.info-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
}

.info-tags {
  display: flex;
  margin-left: 10px;
}
.post-title {
  text-align: center;
  line-height: 60px;
  min-width: 100px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  margin: 30px;
}
</style>
