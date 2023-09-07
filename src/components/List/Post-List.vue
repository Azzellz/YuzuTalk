<template>
    <div class="container">
        <!-- 搜索框 -->
        <SearchBox @search="search" search-type="immediate" placeholder="搜..."></SearchBox>
        <!-- 用组过渡每个post -->
        <!-- 列表展示 -->
        <el-scrollbar>
            <!-- 这里的两个Props:currentPage和PageSize是list的 -->
            <PostCard
                v-for="post in postList.list"
                :key="post._id"
                :post="post"
                :FROM="postList.FROM"
                :pageSize="postList.pageSize"
                :currentPage="postList.currentPage"
            ></PostCard>
        </el-scrollbar>
        <!-- 分页的逻辑 -->
        <PaginationBox
            :list="postList"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
        ></PaginationBox>
    </div>
</template>

<script setup lang="ts">
import PostCard from '@/views/post/card/Post-Card.vue'
import SearchBox from '@/components/Search/Search-Box.vue'
import PaginationBox from '@/components/Pagination/Pagination-Box.vue'
import type { I_PaginatedPostList } from '@/models/post/interface'
import { ref } from 'vue'
import { type I_GetPostOption } from '@/models/post/interface/index'

//声明接收list数据源
const props = withDefaults(
    defineProps<{
        postList: I_PaginatedPostList //要渲染的列表:实现了分页接口
        listHeight?: number //list的高度
    }>(),
    {
        listHeight: 650 //默认650px高度
    }
)

//定义getPosts事件:对于不同的postList,有不同的getPosts方法
const emit = defineEmits<{
    getPosts: [option: I_GetPostOption]
}>()
//分页的逻辑
//#region
const keyword = ref<string>('')

//页面尺寸被改变时
function handleSizeChange(currentPage: number, newPageSize: number) {
    const option: I_GetPostOption = {
        currentPage: currentPage,
        pageSize: newPageSize,
        keyword: keyword.value
    }
    emit('getPosts', option)
}
//页码被用户改变时
function handleCurrentChange(currentPage: number, pageSize: number) {
    const option: I_GetPostOption = {
        currentPage: currentPage,
        pageSize: pageSize,
        keyword: keyword.value
    }
    emit('getPosts', option)
}
//#endregion
//搜索的逻辑
//#region
//实时监听搜索框的值
async function search(newKeyword: string) {
    const option: I_GetPostOption = {
        currentPage: props.postList.currentPage,
        pageSize: props.postList.pageSize,
        keyword: newKeyword
    }
    //同步依赖
    keyword.value = newKeyword
    emit('getPosts', option)
}
//#endregion
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
