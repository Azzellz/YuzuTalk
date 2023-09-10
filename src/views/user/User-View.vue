<template>
    <!-- 路由中转站 -->
    <router-view :class="autoFit"></router-view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
//根据路由动态展示css类
//#region
const route = useRoute()
const autoFit = computed(() => {
    if (route.meta.isHideAside && route.meta.isHideHeader) return ''
    else if (route.meta.isHideAside) return 'without-aside'
    else if (route.meta.isHideHeader) return 'without-header'
    else return 'with-aside-header'
})
//#endregion

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
.with-aside-header {
    margin-top: 60px;
    margin-left: 100px;
}
.without-aside {
    margin-top: 60px;
}
.without-header {
    margin-left: 100px;
}
</style>
