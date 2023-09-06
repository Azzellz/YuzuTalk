<template>
    <div class="container">
        <h1 class="title">找找其他人</h1>
        <!-- 搜索功能 -->
        <el-input placeholder="输入用户名" suffix-icon="Search" class="search" v-model="keyword">
        </el-input>
        <div class="user-list">
            <UserCard v-for="user in userList" :key="user._id" :user="user"></UserCard>
            <h5 class="tip" v-if="isFirst">搜搜吧</h5>
            <h5 class="tip" v-if="userList.length === 0 && !isFirst">没有找到哦</h5>
        </div>
    </div>
</template>

<script setup lang="ts">
import UserCard from '../card/User-Card.vue'
import { ref, watch } from 'vue'
import { type I_MainUserInfo } from '@/models/user/interface/index'
import axios from 'axios'

//搜索功能的逻辑实现
//#region
const keyword = ref<string>('')
const userList = ref<Array<I_MainUserInfo>>([])
const isFirst = ref<boolean>(true)
//实时监听搜索框的值
watch(keyword, async (newKeyword: string) => {
    //初始默认查找所有用户
    isFirst.value = false
    try {
        const {
            data: { data }
        } = await axios.get(`/users?userNameKeyword=${newKeyword}`)
        userList.value = data as Array<I_MainUserInfo>
    } catch (error) {
        console.log(error)
    }
})
//#endregion
</script>

<style lang="less" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    .title {
        color: gray;
        margin: 20px;
    }
    .search {
        width: 50%;
        margin: 20px;
        height: 40px;
    }
    .user-list {
        display: flex;
        flex-direction: column;
        .tip {
            color: gray;
            margin: 20px;
        }
    }
}
</style>
