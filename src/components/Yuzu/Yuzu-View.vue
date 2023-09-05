<template>
    <el-drawer v-model="StatusStore.isYuzu" title="Yuzu" direction="ttb" size="25%">
        <div>浏览过的post:</div>
        <el-tabs
            v-if="!PostStore.visitedPosts.isEmpty()"
            v-model="StatusStore.currentPost._id"
            type="card"
            closable
            @tab-click="selectPost"
        >
            <el-tab-pane
                v-for="visitedPost in PostStore.visitedPosts.list"
                :key="visitedPost._id"
                :label="visitedPost.title"
                :name="visitedPost._id"
            >
                <!-- 这里可以放限制字数的内容 -->
            </el-tab-pane>
        </el-tabs>
        <div v-else>当前还没有访问任何post哦!</div>
    </el-drawer>
</template>

<script setup lang="ts">
import { useStatusStore } from '@/stores/status'
import { onMounted, onUnmounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { type TabsPaneContext } from 'element-plus'
import router from '@/router/index';

//获取状态管理仓库
const StatusStore = useStatusStore()
//监听开启快捷键
//#region
onMounted(() => {
    window.addEventListener('keydown', function (e: KeyboardEvent) {
        //ctrl+y/Y 开启yuzu
        if ((e.key === 'y' && e.ctrlKey) || (e.key === 'Y' && e.ctrlKey)) {
            console.log('Now enter Yuzu')
            StatusStore.isYuzu = !StatusStore.isYuzu
        }
    })
})
//解绑事件
onUnmounted(() => {
    window.removeEventListener('keydown', function (e: KeyboardEvent) {
        console.log(e)
    })
})
//#endregion
//展示已经浏览过的post
//#region
//获取仓库
const PostStore = usePostStore()
//获取初始指向:用当前浏览的id作为初始指向
async function selectPost(pane: TabsPaneContext) {
    const post_id = pane.paneName as string
    //根据id找到visitedPosts中的对应post
    //这里肯定存在,因为数据就是从那里来的
    const targetPost = PostStore.findVisitedPostById(post_id)!
    //跳转至目标
    router.replace({
        path: '/post/item',
        query: {
            id: targetPost._id,
            FROM: targetPost.FROM,
            currentPage: targetPost.currentPage,
            pageSize: targetPost.pageSize
        }
    }) //跳转到文章详情页
    //关闭Yuzu
    StatusStore.isYuzu=false
}
//#endregion
</script>

<style lang="less" scoped>
.visited-list {
    display: flex;
}
</style>
