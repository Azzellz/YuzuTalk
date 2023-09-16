<template>
    <!-- 路由中转站 -->
    <router-view :class="autoFitClass"></router-view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { useAutoFitClass } from '@/hooks/useAutoFitClass'

//根据路由动态展示css类
const { autoFitClass } = useAutoFitClass()

//初始化User数据
//#region
const UserStore = useUserStore()
try {
    await UserStore.getCurrentUser()
} catch (error) {
    console.log(error)
}
//#endregion
</script>

<style scoped>
</style>
