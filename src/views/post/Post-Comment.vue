<template>
  <!-- 是否可见评论区 -->
  <el-card v-if="currentPost.isCommentable" class="comment-container">
    <div class="comment-edit-box">
      <el-input
        type="textarea"
        maxlength="100"
        show-word-limit
        class="comment-input"
        v-model="commentContent"
        @keydown.enter="publishComment"
        placeholder="添加评论(回车发布评论,最多100个字)"
      ></el-input>
      <el-button
        type="primary"
        style="margin: 5px 10px"
        size="large"
        icon="Check"
        @click="publishComment"
      ></el-button>
      <el-button type="success" size="large" style="margin: 5px 10px" @click="supportPost" plain
        >👍</el-button
      >
      <el-button type="danger" size="large" style="margin: 5px 10px" @click="opposePost" plain
        >👎</el-button
      >
      <el-button
        v-if="!isFavorite"
        type="warning"
        style="margin: 5px 10px"
        icon="Star"
        size="large"
        plain
        @click="favoritePost"
      ></el-button>
      <el-button
        v-else
        type="warning"
        style="margin: 5px 10px"
        icon="StarFilled"
        size="large"
        @click="unfavoritePost"
      ></el-button>
      <el-button
        type="primary"
        v-if="isAuthor"
        style="margin: 5px 10px"
        size="large"
        @click="goingToEditMode"
        plain
        >编辑</el-button
      >
    </div>
    <el-divider></el-divider>
    <div class="comment-display-box">
      <Post-Comment-Card
        v-for="(comment, index) in currentPost.comments"
        :key="comment._id"
        :comment="comment"
        :index="index"
      ></Post-Comment-Card>
    </div>
  </el-card>
  <!-- 评论区若不可见则显示 -->
  <div v-else class="close-tip">
    <h1>作者已关闭评论区</h1>
    <el-button type="primary" v-if="isAuthor" @click="openComment" style="margin: 20px"
      >重新开启</el-button
    >
  </div>
</template>

<script setup lang="ts">
import PostCommentCard from './Post-Comment-Card.vue'
import axios from 'axios'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useStatusStore } from '@/stores/status'
import { usePostStore } from '@/stores/post'
//获取状态管理
const StatusStore = useStatusStore()
const PostStore = usePostStore()
//引用props中的post
const currentPost = StatusStore.currentPost
//判断是否为作者
const isAuthor = computed(() => {
  return currentPost.user._id === localStorage.getItem('user_id')
})

//封装公共逻辑
//#region
//#endregion

//判断是否收藏文章
//TODO: 等待优化,这里不应该以发请求的方式去判断,应该将收藏状态放在post对象中
//#region
const isFavorite = ref(false)
try {
  const {
    data: { data }
  } = await axios.post('/user/isfavorite', {
    user_id: localStorage.getItem('user_id'),
    post_id: currentPost._id
  })
  isFavorite.value = data
} catch (error) {
  console.log(error)
  ElMessage.error({
    message: '获取收藏状态失败',
    offset: 80
  })
}
//#endregion

//评论相关的逻辑
//#region
const commentContent = ref('')
//发布评论
async function publishComment() {
  if (!commentContent.value) return ElMessage.error('评论不能为空')
  //要求内容：post(id),user(id),content,support,oppose
  const comment = {
    post: currentPost._id,
    user: localStorage.getItem('user_id'),
    content: commentContent.value,
    support: 0,
    oppose: 0
  }
  //给服务器发送评论请求
  //TODO: 这里可以做个评论区校验,防止用户恶意评论
  try {
    //这里不需要接收返回值,因为在评论区会重新获取评论列表
    await axios.post('/comment', comment)
    //更新当前post引用
    await StatusStore.updateCurrentPost()
  } catch (error) {
    console.log(error)
    //提示失败
    ElMessage.error({
      message: '评论失败',
      offset: 80
    })
  }
}
//重新开启评论区
async function openComment() {
  //更新当前帖子的评论区状态，设置为关闭
  currentPost.isCommentable = true
  //更新帖子
  await PostStore.updatePost(currentPost)
  ElMessage.success({
    message: '评论区开启成功',
    offset: 80
  })
}
//#endregion

//进入编辑模式
//#region
//进入编辑模式,切换组件
function goingToEditMode() {
  StatusStore.isEditing = true
  ElMessage.warning({
    message: '编辑模式开启,点击保存后修改生效',
    offset: 80
  })
}
//#endregion

//Post相关的逻辑
//#region
//给帖子点赞
async function supportPost() {
  //给帖子点赞
  try {
    await axios.post('/support/post', {
      post_id: currentPost._id
    })
    ElMessage.success({
      message: '点赞成功',
      offset: 80
    })
    //调用动态更新
    // await dynamicUpdate()
    //直接展示变化
    currentPost.support++
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '点赞失败',
      offset: 80
    })
  }
}
//给帖子点踩
async function opposePost() {
  //给帖子点踩
  try {
    await axios.post('/oppose/post', {
      post_id: currentPost._id
    })
    ElMessage.success({
      message: '点踩成功',
      offset: 80
    })
    //调用动态更新
    // await dynamicUpdate()
    //直接展示变化
    currentPost.oppose++
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '点踩失败',
      offset: 80
    })
  }
}
//收藏帖子
async function favoritePost() {
  //收藏帖子
  try {
    await axios.post('/favorite/post', {
      post_id: currentPost._id,
      user_id: localStorage.getItem('user_id')
    })
    ElMessage.success({
      message: '收藏成功',
      offset: 80
    })
    //即时展示收藏结果
    isFavorite.value = true
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '收藏失败',
      offset: 80
    })
  }
}
//取消收藏帖子
async function unfavoritePost() {
  //取消收藏帖子
  try {
    await axios.post('/unfavorite/post', {
      post_id: currentPost._id,
      user_id: localStorage.getItem('user_id')
    })
    ElMessage.success({
      message: '取消收藏成功',
      offset: 80
    })
    //即时展示收藏结果
    isFavorite.value = false
  } catch (error) {
    console.log(error)
    ElMessage.error({
      message: '取消收藏失败',
      offset: 80
    })
  }
}
//#endregion
</script>

<style scoped>
.comment-container {
  width: 80%;
  margin-bottom: 20px;
}
.comment-input {
  width: 80%;
}

.comment-edit-box {
  display: flex;
  margin: 20px;
}
.comment-edit-box * {
  margin: 0 10px;
}
.close-tip {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
</style>
