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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'
//获取路由器
const router = useRouter()
onMounted(() => {
    //如果有token则直接跳转到home,不允许再进入注册页面
    localStorage.getItem('token') && router.replace('/home')
})
//初始化注册信息
const user_name = ref<string>('')
const account = ref<string>('')
const password = ref<string>('')
const imgUrl = ref<string>('')

//头像相关的逻辑
//#region
//展示上传的头像
function showAvatar(file: any) {
    imgUrl.value = URL.createObjectURL(file.raw)
}
//处理上传头像错误
function handleAvatarError() {
    ElMessage.error('用户名或账号已存在')
}
//检查头像大小和类型
function beforeAvatarUpload(file: any): boolean {
    //限制文件类型和大小
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
        ElMessage.error({
            message: '上传头像图片只能是 JPG/PNG 格式!',
            offset: 80
        })
    }
    if (!isLt2M) {
        ElMessage.error({
            message: '上传头像图片大小不能超过 2MB!',
            offset: 80
        })
    }
    return isJPG && isLt2M
}
//#endregion

//注册相关的逻辑
//#region
//处理注册成功
function handleAvatarSuccess(res: any) {
    const { data } = res
    console.log(data)
    //向本地存储加东西
    localStorage.setItem('avatar', data.avatar)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user_id', data._id) //这里要用_id
    localStorage.setItem('user_name', data.user_name)
    localStorage.setItem('user_account', data.account)
    //跳转至home
    router.replace('/home') //这里提示要放路由跳转后面,不然有延迟很难看
    ElMessage.success({
        message: '注册成功',
        offset: 80
    })
}
//检查用户是否已经完成信息填写
function check(): boolean {
    if (!imgUrl.value) {
        ElMessage.error('请上传头像')
        return false
    } else if (!user_name.value) {
        ElMessage.error('用户名不得为空')
        return false
    } else if (account.value.length < 6) {
        ElMessage.error('账号长度不得小于6位')
        return false
    } else if (password.value.length < 6) {
        ElMessage.error('密码长度不得小于6位')
        return false
    } else return true
}
//手动提交注册
//获取upload组件的同名ref
const uploadRef = ref<UploadInstance>()
const register = () => {
    if (check()) uploadRef.value!.submit()
}
//#endregion
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
