<template>
    <div class="container">
        <div class="title">发布</div>
        <el-divider></el-divider>
        <el-input v-model="post.title" placeholder="请输入标题" style="width: 20%"></el-input>
        <div class="tag-box">
            <el-tag
                v-for="tag in post.tags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
            >
                {{ tag }}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="showInput"
                v-model="tagValue"
                ref="saveTagInput"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
                size="small"
            ></el-input>
            <el-button v-else @click="showInputBtn" size="small" class="button-new-tag"
                >+标签</el-button
            >
        </div>
        <!-- 编辑器 -->
        <YuzuEditor :post="post"/>
        <div class="publish-box">
            <el-button type="primary" @click="publish" style="margin: 10px 20px">发布</el-button>
            <el-checkbox v-model="post.isShowContent" style="margin: 10px 20px"
                >发布后展示内容</el-checkbox
            >
            <el-checkbox v-model="post.isCommentable" style="margin: 10px 10px"
                >开启评论区</el-checkbox
            >
            <el-checkbox v-model="post.isUnknown" style="margin: 10px 10px">匿名发布</el-checkbox>
        </div>
    </div>
</template>

<script setup lang="ts">
import YuzuEditor from '@/components/Editor/Yuzu-Editor.vue'
import { reactive, ref, nextTick, toRaw } from 'vue'
import type { I_PublishPost } from '@/models/post/interface'
import axios from 'axios'
import { ElInput, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'


//发布post的逻辑
//#region
//声明post对象
const post: I_PublishPost = reactive({
    title: '',
    content: '',
    comments: [],
    support: 0,
    oppose: 0,
    follow: 0,
    tags: [],
    isShowContent: false,
    isCommentable: true,
    isUnknown: false
})
//初始化
const router = useRouter()
//发布
async function publish() {
    //检测标题或者内容是否为空
    if (!post.title || !post.content) {
        ElMessage.error({
            showClose: true,
            message: '标题或内容不能为空',
            offset: 80
        })
        return
    }
    //发送发布post请求
    try {
        const {
            data: { data }
        } = await axios.post('/post', {
            post: toRaw(post), //这里要返回普通对象
            user_id: localStorage.getItem('user_id') //发送当前用户id
        })
        router.replace({
            path: '/post/item',
            query: {
                id: data._id
            }
        }) //跳转到文章详情页
        ElMessage.success({
            showClose: true,
            message: '发布成功',
            offset: 80
        })
    } catch (error) {
        console.log(error)
        ElMessage.error({
            message: '发布失败',
            offset: 80
        })
    }
}
//#endregion

//标签的逻辑
//#region
const tagValue = ref('')
const showInput = ref(false)
//获取标签组件的同名引用
const saveTagInput = ref<InstanceType<typeof ElInput>>()
//显示添加标签的输入框
function showInputBtn() {
    showInput.value = true
    nextTick(() => {
        //获取焦点
        saveTagInput.value!.input!.focus()
    })
}
//手动关闭标签
function handleClose(tag: string) {
    post.tags.splice(post.tags.indexOf(tag), 1)
}
//确认添加标签
function handleInputConfirm() {
    //添加标签
    if (tagValue.value) {
        post.tags.push(tagValue.value)
    }
    showInput.value = false
    tagValue.value = ''
}
//#endregion
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.title {
    margin: 2rem auto;
    font-weight: bold;
    text-align: center;
    font-size: 30px;
    line-height: 30px;
}
.tag-box {
    display: flex;
    margin: 10px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.publish-box {
    display: flex;
    margin: 20px;
}
</style>
