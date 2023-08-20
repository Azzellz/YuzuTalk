<template>
  <el-card shadow="hover" style="margin: 20px">
    <div class="comment-line">
      <div class="comment-user-info">
        <router-link
          :to="{
            path: '/user/other',
            query: {
              id: comment.user._id,
              title: comment.user.user_name
            }
          }"
        >
          <el-avatar :size="50" :src="avatarURL(comment.user.avatar)"></el-avatar>
        </router-link>

        <div>{{ comment.user.user_name }}</div>
      </div>
      <div class="comment-content">{{ comment.content }}</div>
      <div class="comment-meta">
        <div>{{ comment.format_time }}</div>
        <div>{{ index + 1 }} 楼</div>
        <div>
          <el-button type="success" @click="supportComment(comment)" plain size="mini"
            >👍:{{ comment.support }}</el-button
          >
          <el-button type="danger" @click="opposeComment(comment)" plain size="mini"
            >👎:{{ comment.oppose }}</el-button
          >
        </div>
      </div>
      <div class="comment-operation">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          @click="$emit('topComment', comment, index)"
          style="margin: 5px"
          >顶置</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="$emit('deleteOneComment', index)"
          style="margin: 5px"
          >删除</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Comment } from '@/stores/post'
import { avatarURL } from '@/tools/index'
import axios from 'axios'
import { ElMessage } from 'element-plus'
//定义Props
defineProps<{
  comment: Comment
  index: number
}>()
//评论相关操作的逻辑
//#region
//给评论点赞
async function supportComment(comment: Comment) {
  const comment_id = comment._id
  const post_id = comment.post._id
  //给评论点赞
  try {
    await axios.put('/post/comment/support', {
      comment_id,
      post_id
    })
    ElMessage.success({
      message: '点赞成功',
      offset: 80
    })
    //直接更新
    comment.support++
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '点赞失败',
      offset: 80
    })
  }
}
//给评论点踩
async function opposeComment(comment: Comment) {
  const comment_id = comment._id
  const post_id = comment.post._id
  try {
    await axios.put('/post/comment/oppose', {
      comment_id,
      post_id
    })
    ElMessage.success({
      message: '点踩成功',
      offset: 80
    })
    //直接更新
    comment.oppose++
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '点踩失败',
      offset: 80
    })
  }
}
//#endregion
</script>

<style scoped>
.comment-line {
  display: flex;
}
.comment-user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.comment-content {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  line-height: 1.5;
  margin: 0 20px;
  border-right: 1px solid #d5d5d5;
  border-left: 1px solid #d5d5d5;
  padding: 20px;
}
.comment-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.comment-operation {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding: 20px;
  border-left: 1px solid #d5d5d5;
}
</style>
