<template>
    <el-drawer v-model="StatusStore.isYuzu" class="container" title="Yuzu(ctrl+y)" direction="ttb">
        <div class="body">
            <div>浏览过的post:</div>
            <div v-if="tipTime" class="tip" v-text="tipContent"></div>
            <el-tabs
                v-if="!PostStore.visitedPosts.isEmpty()"
                v-model="selectKey"
                type="card"
                closable
                @tab-click="goToVisitedPost"
                @tab-remove="deleteVisitedPost"
            >
                <el-tab-pane
                    v-for="visitedPost in PostStore.visitedPosts.list"
                    :key="visitedPost._id"
                    :label="filterTitle(visitedPost.title)"
                    :name="visitedPost._id"
                >
                    <!-- 展示缩略内容 -->
                    <el-text truncated>{{ filterContent }}</el-text>
                </el-tab-pane>
            </el-tabs>
            <div v-else>当前还没有访问任何post哦!</div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { useStatusStore } from '@/stores/status'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePostStore } from '@/stores/post'
import { type TabPaneName, type TabsPaneContext } from 'element-plus'
import router from '@/router/index'
import { type I_VisitedPost } from '@/models/post/interface/index'

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
//初始化tip
//#region
const tipTime = ref<boolean>(false)
const tipContent = ref<string>('')
//展示提示,并在一定时间后关闭提示
const showTip = (content: string, delay: number = 3000): void => {
    tipTime.value = true
    tipContent.value = content
    setTimeout(() => {
        tipTime.value = false
        tipContent.value = ''
    }, delay)
}

//#endregion
//动态selectKey
//#region
const selectKey = computed(() => {
    //如果currentPost不存在_id属性,说明当前不在Item界面,所以将select设置为空
    if (!PostStore.currentPost._id) return ''
    else return PostStore.currentPost._id
})
//#endregion
//选择post:跳转到目标路由
async function goToVisitedPost(pane: TabsPaneContext) {
    const post_id: string = pane.paneName as string
    //根据id找到visitedPosts中的对应post
    //这里肯定存在,因为数据就是从那里来的
    const targetPost = PostStore.findVisitedPostById(post_id)!
    //跳转至目标
    await router.replace({
        path: '/post/item',
        query: {
            id: targetPost._id,
            FROM: targetPost.FROM,
            currentPage: targetPost.currentPage,
            pageSize: targetPost.pageSize
        }
    }) //跳转到文章详情页
    //关闭Yuzu
    StatusStore.isYuzu = false
}
//删除标签页
function deleteVisitedPost(tabName: TabPaneName) {
    //拿到被删除的post_id
    const post_id: string = tabName.toString()
    if (post_id === PostStore.currentPost._id) {
        //不能删除当前正在访问的post
        //展示提示
        showTip('tip:不能删除当前正在浏览的post')
        return
    }
    //过滤VisitedPosts
    PostStore.filterVisitedPosts((post: I_VisitedPost) => {
        return post._id !== post_id
    })
}
//过滤相关
//#region
//展示选中post的过滤内容
const filterContent = computed(() => {
    return PostStore.currentPost.content?.slice(0, 10) + '...'
})
const filterTitle = (title: string): string => {
    return title.length > 10 ? title.slice(0, 10) + '...' : title
}
//#endregion

//#endregion
</script>

<style lang="less" scoped>
.container {
    .body {
        display: flex;
        flex-direction: column;
        * {
            margin: 5px;
        }
        .tip {
            color: gray;
        }
    }
}
</style>
