<template>
    <UserInfoNormal v-if="!StatusStore.isEditing"></UserInfoNormal>
    <UserInfoEdit v-else></UserInfoEdit>
</template>

<script setup lang="ts">
import UserInfoEdit from "./User-Info-Edit.vue";
import UserInfoNormal from "./User-Info-Normal.vue";
import { useStatusStore } from '@/stores/modules/status';
import { onBeforeUnmount } from "vue";

//获取状态管理
const StatusStore = useStatusStore()
//离开界面时退出编辑模式
onBeforeUnmount(() => {
    StatusStore.isEditing = false
})
</script>

<style scoped></style>
