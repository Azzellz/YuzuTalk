<!-- eslint-disable vue/no-mutating-props -->
<!-- 这边先允许props可以改,之后用事件改变 -->
<template>
    <!-- 分页的逻辑 -->
    <div class="page-box">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model:current-page="list.currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="list.pageSize"
            :total="list.total"
            layout="total,sizes, prev, pager, next"
        >
        </el-pagination>
    </div>
</template>

<script setup lang="ts">
import type { I_PaginatedPostList } from '@/models/post/interface'
//定义emits
const props = defineProps<{
    list: I_PaginatedPostList //要分页的列表:实现了分页接口
}>()
//定义事件触发
const emit = defineEmits<{
    handleSizeChange: []
    handleCurrentChange: []
}>()
//定义分页逻辑
//#region
//这两个方法要修改list的分页相关的数据,如currentPage,pageSize
function handleSizeChange(newPageSize: number) {
    console.log(`修改为每页 ${newPageSize} 条`)
    // eslint-disable-next-line vue/no-mutating-props
    props.list.pageSize = newPageSize
    emit('handleSizeChange')
}
function handleCurrentChange(currentPage: number) {
    console.log(`当前页: ${currentPage}`)
    // eslint-disable-next-line vue/no-mutating-props
    props.list.currentPage = currentPage
    emit('handleCurrentChange')
}
//#endregion
</script>

<style scoped>
.page-box {
    margin: 20px;
}
</style>
