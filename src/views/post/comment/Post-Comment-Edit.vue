<template>
  <el-card class="comment-container">
    <div class="comment-setting">
      <el-popover
        placement="top"
        width="200"
        title="删除"
        trigger="hover"
        content="这将删除所有评论"
      >
        <template #reference>
          <el-button type="danger" @click="deleteAllComments" icon="Delete">删除所有评论</el-button>
        </template>
      </el-popover>

      <el-popover
        placement="top"
        width="200"
        title="关闭"
        trigger="hover"
        content="这将关闭评论区"
        v-if="currentPost.isCommentable"
      >
        <template #reference>
          <el-button type="danger" @click="closeComment" icon="Close">关闭评论区</el-button>
        </template>
      </el-popover>
      <el-popover
        placement="top"
        width="200"
        title="打开"
        trigger="hover"
        content="这将打开评论区"
        v-else
      >
        <template #reference
          ><el-button type="primary" @click="openComment" icon="Check"
            >打开评论区</el-button
          ></template>
      </el-popover>
      <el-popover
        placement="top"
        width="200"
        title="删除"
        trigger="hover"
        content="这将删除本篇文章"
      >
        <template #reference>
            <el-button type="danger" @click="deleteCurrentPost" icon="Close">删除本篇文章</el-button>
        </template>
      </el-popover>
    </div>
    <el-divider></el-divider>
    <div>
      <Post-Comment-Card-Edit
        v-for="(comment, index) in currentPost.comments"
        :key="comment._id"
        :comment="comment"
        :index="index"
        @deleteOneComment="deleteOneComment"
        @topComment="topComment"
      ></Post-Comment-Card-Edit>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import PostCommentCardEdit from './Post-Comment-Card-Edit.vue';

import { useStatusStore } from '@/stores/status'
import { usePostStore, type Post, type Comment } from '@/stores/post'
import { ElMessage } from 'element-plus'

//获取PostStore状态管理
const PostStore = usePostStore()

//获取当前Post的引用
const StatusStore = useStatusStore()
const currentPost: Post = StatusStore.currentPost
//评论区管理的逻辑
//#region
//删除当前文章
async function deleteCurrentPost() {
  try {
    await PostStore.deletePost(currentPost._id)
    //这里应该更新一下总数据源
    //回退的上一页
    history.back()
    ElMessage.success({
      message: '删除成功',
      offset: 80
    })
  } catch (err) {
    console.log(err)
    ElMessage.error({
      message: '删除失败,请重试',
      offset: 80
    })
  }
}
//以下均是需要保存生效的方法
//删除所有评论
function deleteAllComments() {
  //清空当前文章的评论
  currentPost.comments = []
  ElMessage.success({
    message: '全部删除成功',
    offset: 80
  })
}
//删除某个评论
function deleteOneComment(index: number) {
  ElMessage.success({
    message: '删除成功',
    offset: 80
  })
  currentPost.comments.splice(index, 1)
}
//顶置评论
function topComment(comment: Comment, currentIndex: number) {
  currentPost.comments.splice(currentIndex, 1)
  currentPost.comments.unshift(comment)
  ElMessage.success({
    message: '顶置成功',
    offset: 80
  })
}
//关闭评论区
function closeComment() {
  currentPost.isCommentable = false
  ElMessage.error({
    message: '评论区关闭成功,保存后生效',
    offset: 80
  })
}
//打开评论区
function openComment() {
  currentPost.isCommentable = true
  ElMessage.success({
    message: '评论区打开成功,保存后生效',
    offset: 80
  })
}
//#endregion
</script>

<style scoped>
.comment-container {
  width: 80%;
  margin-bottom: 20px;
}
.comment-setting {
  display: flex;
  margin: 20px;
}
.comment-setting * {
  margin: 0 10px;
}
</style>
