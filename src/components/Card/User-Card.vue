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
            <el-card class="container">
                <div class="user-info">
                    <el-avatar :size="50" :src="avatarURL(user.avatar)"></el-avatar>
                    <p>{{ user.user_name }}</p>
                </div>
            </el-card>
        </router-link>
    </template>
    <template v-else>
        <el-card class="container">
            <div class="user-info">
                <el-avatar :size="50" icon="Close"></el-avatar>
                <p>注销用户</p>
            </div>
        </el-card>
    </template>
</template>

<script setup lang="ts">
import type { I_MainUserInfo } from '@/models/modules/user/interface/index'
import { avatarURL } from '@/utils/index'
defineProps<{
    user: I_MainUserInfo | null
}>()
</script>

<style lang="less" scoped>
a {
    text-decoration: none;
    color: black;
}
.container {
    margin: 10px;
    .user-info {
        display: flex;
        * {
            margin: 5px;
        }
        p {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 26px;
            font-weight: bold;
        }
    }
}
</style>
