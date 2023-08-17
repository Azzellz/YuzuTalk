<template>
  <!-- 新导航栏 -->
  <el-menu
    :default-active="activeIndex"
    class="header-nav"
    mode="horizontal"
    router
    background-color="#fff"
    text-color="#000"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/post/list">帖子</el-menu-item>
    <el-menu-item index="/user/info">个人</el-menu-item>
    <el-menu-item v-if="currentIndex" :index="activeIndex">{{ currentIndexContent }}</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useHeaderNavRouteCheck } from '@/hooks/useNavRouteCheck'
const { currentIndex, currentIndexContent, activeIndex } = useHeaderNavRouteCheck()

</script>

<style scoped>
.header-nav {
  width: 100%;
  height: 60px;
  z-index: 10000;
  position: fixed;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
</style>
