<template>
    <Post-Item-Normal v-if="!StatusStore.isEditing"></Post-Item-Normal>
    <Post-Item-Edit v-else></Post-Item-Edit>
</template>

<script setup lang="ts">
import PostItemNormal from './Post-Item-Normal.vue'
import PostItemEdit from './Post-Item-Edit.vue'
import { useStatusStore } from '@/stores/status'
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, watch } from 'vue'
import { type POST_FROM } from '@/models/post/enum'
import { usePostStore } from '@/stores/post'
import { type Post } from '@/models/post/interface/index'

//定义要接收的Props
//这里只需要接收id即可
//注意这里的props是通过路由传递过来的
const props = defineProps<{
    id: string
    FROM: POST_FROM
    //这里接收分页参数是为了分页刷新
    currentPage?: number
    pageSize?: number
}>()
//获取状态管理对象
const StatusStore = useStatusStore()
const PostStore = usePostStore()
try {
    //让StatusStore获取当前文章的引用
    await PostStore.getPost(props.id)
    //记录当前浏览的post
    //先判断是否已经在队列中了
    const post = PostStore.findVisitedPostById(PostStore.currentPost._id)
    if (!post) {
        PostStore.recordVisitedPost(
            PostStore.currentPost,
            props.FROM,
            props.currentPage,
            props.pageSize
        )
    }
} catch (error) {
    //如果不存在,则跳转到文章列表页
    ElMessage.error({
        message: '文章不存在',
        offset: 80
    })
    const router = useRouter()
    router.push('/post/list')
}
//如果当前路由参数发生变化,则重新获取post
const route = useRoute()
watch(route, async (newRoute: RouteLocationNormalized) => {
    //路由改变时重新获取post
    await PostStore.getPost(newRoute.query.id as string)
    //关闭编辑状态
    StatusStore.isEditing = false
})

//钩子
onBeforeUnmount(() => {
    //离开页面时,强制结束编辑状态
    StatusStore.isEditing = false
    //清空当前访问的post
    PostStore.currentPost = {} as Post
    //调用动态更新数据源方法
    //注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //离开时动态更新数据源,让用户离开界面后能看到PostCard的改变
    PostStore.dynamicUpdate(useRoute(), props.FROM)
})
</script>

<style scoped></style>
