<template>
  <div class="container">
    <el-input placeholder="搜索" suffix-icon="el-icon-search" class="search" v-model="keyword">
    </el-input>
    <!-- 用组过渡每个post -->
    <!-- <transition-group name="el-fade-in"> -->
    <PostCard
      v-for="post in PostStore.posts"
      :key="post._id"
      :post="post"
      :pageSize="pageSize"
      :currentPage="currentPage"
    ></PostCard>
    <!-- </transition-group> -->
    <div class="page-box">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-model:current-page="currentPage"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageSize"
        :total="PostStore.total"
        layout="total,sizes, prev, pager, next"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from './Post-Card.vue'
import {  ref, watch } from 'vue'
import { usePostStore } from '../../stores/post'
//分页的逻辑
//#region
const pageSize = ref(10)
const currentPage = ref(1)
const keyword = ref('')
//获取仓库
const PostStore = usePostStore()
//页面尺寸被改变时
function handleSizeChange(newPageSize: number) {
  console.log(`修改为每页 ${newPageSize} 条`)
  pageSize.value = newPageSize
  PostStore.getPosts({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    keyword: keyword.value
  })
}
//页码被用户改变时
function handleCurrentChange(currentPage: number) {
  console.log(`当前页: ${currentPage}`)
  PostStore.getPosts({
    currentPage: currentPage,
    pageSize: pageSize.value,
    keyword: keyword.value
  })
}
//#endregion

//搜索的逻辑
//#region
//实时监听搜索框的值
watch(keyword, (newKeyword) => {
  PostStore.getPosts({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    keyword: newKeyword
  })
})
//懒搜索
function goSearch() {
  console.log('Go to search..', keyword.value)
  PostStore.getPosts({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    keyword: keyword.value
  })
}
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
