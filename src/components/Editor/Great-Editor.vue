<template>
    <div class="yuzu-editor">
        <div id="tool-bar">
            <h5 class="title">工具箱</h5>
            <div class="buttons">
                <el-button @click="bolder">加粗</el-button>
            </div>
            <div class="selected-displayer" v-text="selectedContent"></div>
        </div>
        <div
            id="editor"
            contenteditable="true"
            spellcheck="true"
            autocorrect="on"
            role="textarea"
            aria-multiline="true"
            tabindex="0"
            ref="editor"
            @keydown.enter.prevent="pushParagraph"
        >
            <p v-for="p in paragraphs" :key="p.id" v-html="p.content"></p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { reactive, ref } from 'vue'

//模块化内容
//#region
//初始化段落队列
const paragraphs = reactive<
    Array<{
        id: string
        content: string
    }>
>([
    {
        id: nanoid(),
        content: '请输入'
    }
])
//绑定换行添加p段落
//获取模板引用
const editor = ref<HTMLDivElement | null>(null)
//键盘回车事件
const pushParagraph = (event: Event) => {
    if ((event as KeyboardEvent).key === 'Enter') {
        paragraphs.push({
            id: nanoid(),
            content: '<br>'
        })
    }
}
//#endregion

//光标相关
//#region
// function getCaretLineNumber(editor:HTMLDivElement) {
//     const { selectionStart } = editor.SEL
//     const textBeforeCaret = inputElement.value.slice(0, selectionStart)
//     const lineNumber = textBeforeCaret.split('\n').length
//     return lineNumber
// }
//#endregion

//绑定输入更新事件
//采用解构化处理
//#region
// const content = ref('')
// const updateContent = (event: Event) => {
//     content.value = (event.target as HTMLDivElement).innerHTML
//     console.log(content.value)
// }
//#endregion

// 监听重新渲染时的钩子:用来恢复光标位置
//#region

//在下一次dom更新时调用的钩子
// onUpdated(() => {
//     // 恢复光标位置
//     const selection = window.getSelection()
//     if (editor.value && selection) {
//         const range = document.createRange()
//         range.selectNodeContents(editor.value)
//         range.collapse(false)
//         selection.removeAllRanges()
//         selection.addRange(range)
//     }
// })
//#endregion

//tool-bar相关功能
//#region
//显示被选中的文本内容
const selectedContent = ref<string>('')

//加粗
const bolder = () => {
    //获取选中内容
    selectedContent.value = window.getSelection()?.toString() as string
}
//#endregion
</script>

<style lang="less" scoped>
@weight: 500px;
@height: 150px;
.yuzu-editor {
    width: @weight;
    #tool-bar {
        height: @height;
        .common-format();
        display: flex;
        flex-direction: column;
        .title {
            color: gray;
        }
        .buttons {
            margin: 10px 0;
            display: flex;
            * {
                margin: 0 5px;
            }
        }
        .selected-displayer {
        }
    }
    #editor {
        height: @height*4;
        .common-format();
        line-height: 1.5;
        overflow-y: auto;
    }
}
.common-format {
    padding: 10px;
    border: 1px solid black;
}
</style>
