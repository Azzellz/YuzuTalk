<template>
    <el-card shadow="hover" style="margin: 20px">
        <div class="comment-line">
            <div class="comment-user-info">
                <UserAvatarRoute :user="comment.user" :is-show-user-name="true"></UserAvatarRoute>
                <!-- <div v-if="comment.user">{{ comment.user.user_name }}</div>
                <div v-else>注销用户</div> -->
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-meta">
                <div>{{ comment.format_time }}</div>
                <div>{{ index + 1 }} 楼</div>
                <div>
                    <el-button type="success" @click="supportComment(comment)" plain size="small"
                        >👍:{{ comment.support }}</el-button
                    >
                    <el-button type="danger" @click="opposeComment(comment)" plain size="small"
                        >👎:{{ comment.oppose }}</el-button
                    >
                </div>
            </div>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { PostAPI } from '@/api/modules/post';
import UserAvatarRoute from '@/components/User/User-Avatar-Route.vue'
import type { I_Comment } from '@/models/modules/post/interface'
import { ElMessage } from 'element-plus'
//定义Props
defineProps<{
    index: number
    comment: I_Comment
}>()
//点赞和点踩的两个方法
//#region
//给评论点赞
async function supportComment(comment: I_Comment) {
    const comment_id = comment._id
    const post_id = comment.post._id
    //给评论点赞
    try {
        await PostAPI.put('/comment/support', {
            comment_id,
            post_id
        })
        ElMessage.success({
            message: '点赞成功',
            offset: 80
        })
        //更新状态
        //直接改
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
async function opposeComment(comment: I_Comment) {
    const comment_id = comment._id
    const post_id = comment.post._id
    //给评论点踩
    try {
        await PostAPI.put('/comment/support', {
            comment_id,
            post_id
        })
        ElMessage.success({
            message: '点踩成功',
            offset: 80
        })
        //更新状态
        //直接改
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
</style>
