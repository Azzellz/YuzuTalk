import { ref } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
import type { UploadInstance } from 'element-plus'

//注册的逻辑
export function useRegister() {
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
    //!注意,这里必须暴露在setup中才能获取到
    const uploadRef = ref<UploadInstance>()
    const register = () => {
        if (check()) uploadRef.value!.submit()
    }
    //#endregion

    return {
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
    }
}
