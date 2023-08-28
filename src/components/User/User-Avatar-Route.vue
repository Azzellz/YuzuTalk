<template>
    <template v-if="user">
        <router-link
            :to="{
                path: '/user/other',
                query: {
                    id: user._id,
                    title: user.user_name
                }
            }"
        >
            <el-avatar :size="50" :src="avatarURL(user.avatar)"></el-avatar>
        </router-link>
        <div v-if="isShowUserName">{{ user.user_name }}</div>
    </template>
    <template v-else>
        <el-avatar :size="50" icon="Close"></el-avatar>
        <div>注销用户</div>
    </template>
</template>

<script setup lang="ts">
import { type I_MainUserInfo } from '@/models/user/interface/index'
import { avatarURL } from '@/utils/index'
defineProps<{
    user: I_MainUserInfo | null
    isShowUserName: boolean
}>()
</script>

<style scoped>
* {
    margin: 2px;
}
</style>
