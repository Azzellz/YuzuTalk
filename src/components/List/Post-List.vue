<template>
    <div class="container">
        <el-input placeholder="搜索" suffix-icon="Search" class="search" v-model="keyword">
        </el-input>
        <!-- 用组过渡每个post -->
        <PostCard
            v-for="post in postList.list"
            :key="post._id"
            :post="post"
            :FROM="postList.FROM"
            :pageSize="pageSize"
            :currentPage="currentPage"
        ></PostCard>
        <div class="page-box">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                v-model:current-page="currentPage"
                :page-sizes="[5, 10, 20, 50, 100]"
                :page-size="pageSize"
                :total="postList.total"
                layout="total,sizes, prev, pager, next"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import PostCard from '@/views/post/card/Post-Card.vue'
import type { PaginatedPostList } from '@/models/post/interface'
import { ref, watch } from 'vue'
import { type GetPostOption } from '../../models/post/interface/index'

//声明接收list数据源
defineProps<{
    postList: PaginatedPostList
}>()
//定义getPosts事件:对于不同的postList,有不同的getPosts方法
const emit = defineEmits<{
    getPosts: [option: GetPostOption]
}>()
//分页的逻辑
//#region
const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')

//页面尺寸被改变时
function handleSizeChange(newPageSize: number) {
    console.log(`修改为每页 ${newPageSize} 条`)
    pageSize.value = newPageSize
    const option: GetPostOption = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        keyword: keyword.value
    }
    emit('getPosts', option)
}
//页码被用户改变时
function handleCurrentChange(currentPage: number) {
    console.log(`当前页: ${currentPage}`)
    const option: GetPostOption = {
        currentPage: currentPage,
        pageSize: pageSize.value,
        keyword: keyword.value
    }
    emit('getPosts', option)
}
//#endregion
//搜索的逻辑
//#region
//实时监听搜索框的值
watch(keyword, async (newKeyword: string) => {
    const option: GetPostOption = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        keyword: newKeyword
    }
    emit('getPosts', option)
})
//#endregion
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.page-box {
    margin: 20px;
}
.search {
    width: 50%;
    margin: 20px;
    height: 40px;
}
</style>
