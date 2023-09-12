<template>
    <div class="container">
        <el-input
            class="title"
            placeholder="修改标题"
            v-model="PostStore.currentPost.title"
            style="width: 20%"
        ></el-input>
        <h6 class="info-box">
            <el-avatar :size="40" :src="avatarURL(PostStore.currentPost.user.avatar)"></el-avatar>
            <div class="info-text">{{ postInfo }}</div>
            <div class="info-tags">
                <el-tag
                    v-for="(tag, index) in PostStore.currentPost.tags"
                    :key="index"
                    :disable-transitions="false"
                    style="margin: 5px"
                >
                    {{ tag }}
                </el-tag>
            </div>
        </h6>
        <el-divider>修改内容</el-divider>
        <YuzuEditor :post="PostStore.currentPost"></YuzuEditor>
        <el-popover
            placement="top"
            width="200"
            title="保存"
            trigger="hover"
            content="保存当前修改的所有内容"
        >
            <template #reference>
                <el-button type="danger" @click="saveEdited" style="margin: 20px">保存</el-button>
            </template>
        </el-popover>
        <el-divider>评论区设置</el-divider>
        <Post-Comment-Edit :post="PostStore.currentPost"></Post-Comment-Edit>
    </div>
</template>

<script setup lang="ts">
import PostCommentEdit from '../comment/Post-Comment-Edit.vue'
import YuzuEditor from '@/components/Editor/Yuzu-Editor.vue'

import { computed } from 'vue'
import { avatarURL } from '@/utils/index'
import { usePostStore } from '@/stores/modules/post'
import { ElMessage } from 'element-plus'
import { useStatusStore } from '@/stores/modules/status'

//引入状态管理
const PostStore = usePostStore()
const StatusStore = useStatusStore()
//记录博客信息
const postInfo = computed(() => {
    return `${PostStore.currentPost.user.user_name} 于 ${PostStore.currentPost.format_time} 发布 | 👍:${PostStore.currentPost.support} 👎:${PostStore.currentPost.oppose} | 评论数:${PostStore.currentPost.comments.length}`
})

//保存编辑
async function saveEdited() {
    //保存并且结束编辑模式
    try {
        //等待更新完毕后再结束编辑模式
        await PostStore.updatePost(PostStore.currentPost)
        //结束编辑模式
        StatusStore.isEditing = false
        ElMessage.success({
            message: '保存成功',
            offset: 80
        })
    } catch (err) {
        console.log(err)
        ElMessage.error({
            message: '保存失败',
            offset: 80
        })
    }
}
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    text-align: center;
    line-height: 60px;
    min-width: 100px;
    margin: 30px;
}
.content {
    white-space: pre-line;
    width: 80%;
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
</style>
