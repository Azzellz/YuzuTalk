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
        <div class="icon" @click="openYuzu">
            <el-avatar :size="40" fit="fill" src="/yuzu.png"></el-avatar>
        </div>
        <div class="icon">
            <!-- github仓库 -->
            <a href="https://github.com/Azzellz/YuzuTalk" target="_blank">
                <el-avatar :size="40" fit="fill" src="/github.jpg"></el-avatar>
            </a>
        </div>
        <div style="flex: 0.5"></div>
        <!-- Yuzu模态框 -->
        <!-- 这里不用Teleport是因为顶部会被Header遮住,所以直接在Header中展示就行 -->
        <!-- <Teleport to="body"> -->
        <YuzuView />
        <!-- </Teleport> -->

        <el-menu-item index="/home">
            仪表盘
            <el-icon>
                <Compass />
            </el-icon>
        </el-menu-item>

        <el-menu-item index="/post/list">
            帖子
            <el-icon>
                <ChatLineSquare />
            </el-icon>
        </el-menu-item>

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
import { useUserStore } from '@/stores/modules/user'
import { useStatusStore } from '@/stores/modules/status'

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
    justify-content: start;
    font-weight: bold;
    .icon {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 10px;
        cursor: pointer;
    }
}
</style>
