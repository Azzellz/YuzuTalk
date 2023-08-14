<template>
  <div class="aside-nav">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="border: none"
      router
      :default-active="activeIndex"
    >
      <el-menu-item v-if="currentIndex" :index="activeIndex">
        <template #title>
          <el-icon><location /></el-icon>
          <span>当前</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/post/list">
        <template #title>
          <el-icon><DocumentCopy /></el-icon>
          <span>全部</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/post/publish">
        <template #title>
          <el-icon><Edit /></el-icon>
          <span>发布</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { usePostAsideNavRouteCheck } from '@/hooks/useNavRouteCheck';
const {currentIndex,activeIndex}=usePostAsideNavRouteCheck()
</script>

<style scoped>
.aside-nav {
  width: 100px;
  height: 100%;
  margin-top: 60px;
  background-color: #545c64;
  font-weight: bold;
  overflow-y: auto;
  position: fixed;
}
</style>
