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
            <el-avatar
                :size="avatarSize"
                :src="avatarURL(user.avatar)"
                v-bind="options"
            ></el-avatar>
        </router-link>
        <div v-if="isShowUserName">{{ user.user_name }}</div>
    </template>
    <template v-else>
        <el-avatar :size="avatarSize" icon="Close" v-bind="options"></el-avatar>
        <div>注销用户</div>
    </template>
</template>

<script setup lang="ts">
import { type I_MainUserInfo } from '@/models/modules/user/interface/index'
import { avatarURL } from '@/utils/index'
//配置默认Props
withDefaults(
    defineProps<{
        user: I_MainUserInfo | null //可能是null
        isShowUserName?: boolean //是否展示名字
        avatarSize?: number //头像的大小
        options?: object //拓展element-ui的avatar
    }>(),
    {
        isShowUserName: false, //默认不展示名字
        avatarSize: 50  //默认50
    }
)
</script>

<style scoped>
* {
    margin: 2px;
}
</style>
