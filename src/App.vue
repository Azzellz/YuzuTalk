<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './components/Header/Header-Nav.vue'
import LoadingView from './components/Loading/Loading-View.vue'
import CursorView from './components/Cursor/Cursor-View.vue'

//获取当前路由
const currentRoute = useRoute()
//是否展示Header的计算属性
const isShowHeader = computed(() => {
    //这里要判断是否为初始路径 /
    if (currentRoute.path === '/') return false //返回false防止加载HeaderNav
    return !currentRoute.meta.isHideHeader
})
//是否展示Aside的计算属性
const isShowAside = computed(() => {
    return !currentRoute.meta.isHideAside
})
</script>

<template>
    <!-- 顶部导航栏 -->
    <HeaderNav v-if="isShowHeader" />
    <!-- 全局鼠标特效 -->
    <CursorView />
    <router-view v-if="isShowAside" name="aside"></router-view>
    <!-- 内容展示 -->
    <!-- 需要套层异步Suspense -->
    <Suspense>
        <router-view style="flex: 1"></router-view>
        <!-- 这里可以搞个加载效果的组件 -->
        <template #fallback> <LoadingView></LoadingView> </template>
    </Suspense>
</template>

<style scoped></style>
