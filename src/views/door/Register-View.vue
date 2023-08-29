<template>
    <div class="register-box">
        <el-upload
            class="avatar-uploader"
            action="http://localhost:4000/register"
            ref="uploadRef"
            :data="{
                user_name,
                account,
                password
            }"
            name="avatar"
            :show-file-list="false"
            :on-error="handleAvatarError"
            :on-change="showAvatar"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
        >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
                <div style="font-size: 12px; color: grey">你的头像</div>
            </template>
        </el-upload>
        <el-input
            maxlength="8"
            minlength="1"
            show-word-limit
            placeholder="请输入用户名"
            class="input"
            v-model="user_name"
        ></el-input>
        <el-input
            maxlength="14"
            minlength="6"
            show-word-limit
            placeholder="请输入账号"
            class="input"
            v-model="account"
        ></el-input>
        <el-input
            v-model="password"
            minlength="6"
            placeholder="密码"
            class="input"
            show-password
        ></el-input>
        <div class="buttons">
            <el-button type="primary" style="flex: 0.8" @click="register">注册</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRegister } from '@/hooks/useRegister'
//暴露钩子提供的变量
const {
    user_name,
    account,
    password,
    uploadRef,
    imgUrl,
    showAvatar,
    handleAvatarError,
    beforeAvatarUpload,
    handleAvatarSuccess,
    register
} = useRegister()
</script>

<style lang="less" scoped>
.register-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    * {
        margin: 10px;
    }
    .input {
        width: 16rem;
    }
    .buttons {
        width: 18rem;
        justify-content: space-around;
        display: flex;
    }
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
            border-color: #409eff;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
    }
}
</style>
