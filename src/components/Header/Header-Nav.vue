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
        <el-menu-item @click="openYuzu">
            <el-avatar :size="40" src="/bear-walking.gif"></el-avatar>
        </el-menu-item>
        <!-- Yuzu拟态框 -->
        <YuzuView></YuzuView>

        <el-menu-item index="/home">仪表盘</el-menu-item>

        <el-menu-item index="/post/list">帖子</el-menu-item>

        <el-menu-item index="/user/info">
            <el-avatar :size="40" :src="avatarURL(userAvatar)"></el-avatar>
        </el-menu-item>

        <el-menu-item v-if="currentIndex" :index="activeIndex">{{
            currentIndexContent
        }}</el-menu-item>
    </el-menu>
</template>

<script setup lang="ts">
import YuzuView from '../Yuzu/Yuzu-View.vue'

import { useHeaderNavRouteCheck } from '@/hooks/useNavRouteCheck'
import { avatarURL } from '@/utils/index'
import { useUserStore } from '@/stores/user'
import { useStatusStore } from '@/stores/status'

//顶部Nav路由检查
const { currentIndex, currentIndexContent, activeIndex } = useHeaderNavRouteCheck()
//获取用户头像url
const userAvatar = localStorage.getItem('avatar') || useUserStore().currentUser.origin.avatar
//Yuzu工具栏
//#region
const StatusStore = useStatusStore()
function openYuzu() {
    //更新状态仓库
    StatusStore.isYuzu = true
}
//#endregion
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
