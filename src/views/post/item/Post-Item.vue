<template>
    <Post-Item-Normal v-if="!StatusStore.isEditing"></Post-Item-Normal>
    <Post-Item-Edit v-else></Post-Item-Edit>
</template>

<script setup lang="ts">
import PostItemNormal from './Post-Item-Normal.vue'
import PostItemEdit from './Post-Item-Edit.vue'
import { useStatusStore } from '@/stores/modules/status'
import { useRouter, useRoute, type RouteLocationNormalized } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, watch } from 'vue'
import { type POST_FROM } from '@/models/modules/post/enum'
import { usePostStore } from '@/stores/modules/post'
import { Post } from '@/models/modules/post/class/index'

//定义要接收的Props
//这里只需要接收id即可
//注意这里的props是通过路由传递过来的
const props = defineProps<{
    id: string
    FROM: POST_FROM
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
//这里是为了处理Yuzu导航栏在Item页跳转另一个item的时候更新状态
const route = useRoute()
watch(route, async (newRoute: RouteLocationNormalized) => {
    //路由改变时重新获取post
    //如果不是item跳转那么就不进行之后的操作
    if (newRoute.path !== '/post/item') return
    await PostStore.getPost(newRoute.query.id as string)
    //关闭编辑状态
    StatusStore.isEditing = false
})

//钩子
onBeforeUnmount(() => {
    //离开页面时,强制结束编辑状态
    StatusStore.isEditing = false
    //清空当前访问的post
    PostStore.currentPost = new Post()
    //调用动态更新数据源方法
    //注意!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //离开时动态更新数据源,让用户离开界面后能看到PostCard的改变
    PostStore.dynamicUpdate(useRoute(), props.FROM)
})
</script>

<style scoped></style>
