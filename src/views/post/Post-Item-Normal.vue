<template>
  <div class="post-box">
    <h1 class="post-title">{{ post.title }}</h1>
    <h6 class="info-box">
      <template v-if="!post.isUnknown">
        <router-link
          :to="{
            path: '/user/other',
            query: {
              id: post.user._id,
              title: post.user.user_name
            }
          }"
        >
          <el-avatar :size="40" :src="avatarURL(post.user.avatar)"></el-avatar>
        </router-link>

        <div class="info-text">{{ postInfo }}</div>
      </template>
      <template v-else>
        <el-avatar icon="el-icon-user-solid" :size="40"></el-avatar>
        <div class="info-text">{{ unknownPostInfo }}</div>
      </template>

      <div class="info-tags">
        <el-tag
          v-for="(tag, index) in post.tags"
          :key="index"
          :disable-transitions="false"
          style="margin: 5px"
        >
          {{ tag }}
        </el-tag>
      </div>
    </h6>
    <el-divider>内容</el-divider>
    <el-card class="content-box">{{ post.content }}</el-card>
    <el-divider>评论</el-divider>
    <Post-Comment :post="post"></Post-Comment>
  </div>
</template>

<script setup lang="ts">
import { type Post } from '../../stores/post'
import { avatarURL } from '../../tools/index'
import { computed } from 'vue'
const props = defineProps<{
  post: Post
}>()
//非匿名帖子的信息
const postInfo = computed(() => {
  return `${props.post.user.user_name} 于 ${props.post.format_time} 发布 | 👍:${props.post.support} 👎:${props.post.oppose} | 评论数:${props.post.comments.length}`
})
//匿名的帖子信息
const unknownPostInfo = computed(() => {
  return `匿名用户 于 ${props.post.format_time} 发布 | 👍:${props.post.support} 👎:${props.post.oppose} | 评论数:${props.post.comments.length}`
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
