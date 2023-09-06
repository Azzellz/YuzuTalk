<!-- eslint-disable vue/no-mutating-props -->
<!-- 这边先允许props可以改,之后用事件改变 -->
<template>
    <!-- 分页的逻辑 -->
    <div class="page-box">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model:current-page="currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="list.pageSize"
            :total="list.total"
            layout="total,sizes, prev, pager, next"
        >
        </el-pagination>
    </div>
</template>

<script setup lang="ts">
import type { I_PaginatedPostList } from '@/models/post/interface';
import { computed } from 'vue';
//定义emits
const props = defineProps<{
    list: I_PaginatedPostList //要分页的列表:实现了分页接口
}>()
//定义事件触发
const emit = defineEmits<{
    handleSizeChange: [currentPage: number, newPageSize: number]
    handleCurrentChange: [currentPage: number, pageSize: number]
}>()
//定义分页逻辑
//#region
//这里是因为list中的currentPage从0开始,但是pagination需要从1开始的currentPage
const currentPage = computed<number>(()=>{
    return props.list.currentPage+1
})
function handleSizeChange(newPageSize: number) {
    console.log(`修改为每页 ${newPageSize} 条`)
    // eslint-disable-next-line vue/no-mutating-props
    props.list.pageSize = newPageSize
    emit('handleSizeChange', props.list.currentPage, newPageSize)
}
function handleCurrentChange(currentPage: number) {
    console.log(`当前页: ${currentPage}`)
    emit('handleCurrentChange', currentPage, props.list.pageSize)
}
//#endregion
</script>

<style scoped>
.page-box {
    margin: 20px;
}
</style>
