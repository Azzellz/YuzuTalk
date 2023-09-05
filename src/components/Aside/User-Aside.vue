<template>
    <div class="container">
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
                    <el-icon><Location /></el-icon>
                    <span>当前</span>
                </template>
            </el-menu-item>
            <el-menu-item index="/user/info">
                <template #title>
                    <el-icon><Tickets /></el-icon>
                    <span>资料</span>
                </template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { useUserAsideNavRouteCheck } from '@/hooks/useNavRouteCheck'
const { currentIndex, activeIndex } = useUserAsideNavRouteCheck()
</script>

<style scoped>
.container {
    width: 100px;
    height: 100%;
    margin-top: 60px;
    background-color: #545c64;
    font-weight: bold;
    overflow-y: auto;
    position: fixed;
}
</style>
