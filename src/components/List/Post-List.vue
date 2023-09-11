<template>
    <div class="container">
        <!-- 搜索框 -->
        <SearchBox @search="search" search-type="immediate" placeholder="找找看..." />
        <div v-if="isOptionable" class="option-box">
            <el-checkbox v-model="isNewOrder" label="最新顺序" size="large" />
        </div>
        <!-- 用组过渡每个post -->
        <!-- 列表展示 -->
        <h5 v-if="postList.list.length === 0" class="tip">没找到哦...</h5>
        <el-scrollbar :height="listHeight">
            <template v-for="post in postList.list" :key="post._id">
                <PostCard v-if="post.user" :post="post" :FROM="postList.FROM" />
            </template>
        </el-scrollbar>
        <!-- 分页的逻辑 -->
        <PaginationBox
            :list="postList"
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
        />
    </div>
</template>

<script setup lang="ts">
import PostCard from '@/components/Card/Post-Card.vue'
import SearchBox from '@/components/Search/Search-Box.vue'
import PaginationBox from '@/components/Pagination/Pagination-Box.vue'
import type { I_PaginatedPostList } from '@/models/modules/post/interface'
import { computed, ref, watch } from 'vue'
import { type I_GetPostOption } from '@/models/modules/post/interface/index'

//声明接收list数据源
withDefaults(
    defineProps<{
        postList: I_PaginatedPostList //要渲染的列表:实现了分页接口
        isOptionable?: boolean
        listHeight?: number //list的高度
    }>(),
    {
        listHeight: 650, //默认680px高度
        isOptionable: true //默认开启选项
    }
)
//定义getPosts事件:对于不同的postList,有不同的getPosts方法
const emit = defineEmits<{
    getPosts: [option: I_GetPostOption]
}>()
//用户来选择怎样获取列表
//#region
//是否按照最新的顺序,默认选中
const isNewOrder = ref<boolean>(true)
const order = computed<'new' | 'old'>(() => {
    return isNewOrder.value ? 'new' : 'old'
})
watch(order, (newOrder: 'new' | 'old') => {
    const option: I_GetPostOption = {
        keyword: keyword.value,
        order: newOrder
    }
    emit('getPosts', option)
})
//#endregion

//分页的逻辑
//#region
const keyword = ref<string>('')

//页面尺寸被改变时
function handleSizeChange() {
    const option: I_GetPostOption = {
        keyword: keyword.value,
        order: order.value
    }
    emit('getPosts', option)
}
//页码被用户改变时
function handleCurrentChange() {
    const option: I_GetPostOption = {
        keyword: keyword.value,
        order: order.value
    }
    emit('getPosts', option)
}
//#endregion
//搜索的逻辑
//#region
//实时监听搜索框的值
async function search(newKeyword: string) {
    const option: I_GetPostOption = {
        keyword: newKeyword,
        order: order.value
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
    .option-box {
        width: 50%;
        display: flex;
        justify-content: center;
    }
    .tip {
        margin-top: 50px;
        color: gray;
    }
}
</style>
