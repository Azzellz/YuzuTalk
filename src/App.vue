<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from './components/Header/Header-Nav.vue'
import LoadingView from './components/Loading/Loading-View.vue'

//获取当前路由
const currentRoute = useRoute()
//是否展示Header的计算属性
const isHideHeader = computed(() => {
    return !currentRoute.meta.hideHeader
})
//是否展示Aside的计算属性
const isHideAside = computed(() => {
    return !currentRoute.meta.hideAside
})
</script>

<template>
    <!-- 顶部导航栏 -->
    <HeaderNav v-if="isHideHeader"></HeaderNav>
    <router-view v-if="isHideAside" name="aside"></router-view>
    <!-- 内容展示 -->
    <!-- 需要套层异步Suspense -->
    <Suspense>
        <router-view style="flex: 1"></router-view>
        <!-- 这里可以搞个加载效果的组件 -->
        <template #fallback> <LoadingView></LoadingView> </template>
    </Suspense>
</template>

<style scoped></style>
