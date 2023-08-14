<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import HeaderNav from './components/Header/Header-Nav.vue'

//获取当前路由
const currentRoute = useRoute()
//是否展示Header的计算属性
const isHideHeader = computed(()=>{
  return !currentRoute.meta.hideHeader;
})
//是否展示Aside的计算属性
const isHideAside = computed(()=>{
  return !currentRoute.meta.hideAside;
})

</script>

<template>
  <!-- 顶部导航栏 -->
  <HeaderNav v-if="isHideHeader"></HeaderNav>
  <router-view v-if="isHideAside" name="aside"></router-view>
  <!-- 内容展示 -->
  <router-view style="flex: 1;"></router-view>

</template>

<style scoped>

</style>
