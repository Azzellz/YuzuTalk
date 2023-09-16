<template>
    <router-view :class="autoFitClass"></router-view>
</template>

<script setup lang="ts">
import { usePostStore } from '@/stores/modules/post'
import { useAutoFitClass } from '@/hooks/useAutoFitClass'

//根据路由动态展示css类
const { autoFitClass } = useAutoFitClass()

//初始化逻辑放到路由中转组件这里做
//初始化Post数据
//#region
const PostStore = usePostStore()
//获取option
const option = PostStore.getOption()
//这边既是为了获取初始化数据,也是为了防止刷新后数据丢失
try {
    await PostStore.getPosts(option)
} catch (error) {
    console.log(error)
}

//#endregion
</script>

<style scoped></style>
