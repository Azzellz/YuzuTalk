<template>
  <router-view :class="autoFit"></router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {  usePostStore } from '@/stores/post'
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

//初始化逻辑放到路由中转组件这里做
//初始化Post数据
//#region
const PostStore = usePostStore()
//获取option
const option = PostStore.getOption()
//这边既是为了获取初始化数据,也是为了防止刷新后数据丢失
await PostStore.getPosts(option)
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
