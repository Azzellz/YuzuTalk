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
            <p v-for="(p, index) in paragraphs" :key="p.id" :id="p.id" :index="index">
                <span
                    v-for="span in p.spans"
                    :key="span.id"
                    :id="span.id"
                    :ownerParagraphId="p.id"
                    v-html="span.content"
                ></span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import { reactive, ref } from 'vue'

//模块化内容
//#region
//初始化段落队列
class Paragraph {
    id: string
    // index: number //行数索引
    spans: Array<Span>
    constructor(firstSpanContent: string = '<br>') {
        this.id = nanoid()
        // this.index = paragraphs.length
        //每一个paragraph默认带一个具有换行标签的span
        this.spans = [new Span(firstSpanContent, this.id)]
    }
}
//Span标签内容的联合类型
type SpanContentType = 'text'
class Span {
    id: string
    type: SpanContentType
    content: string
    ownerParagraphId: string
    constructor(content: string, ownerParagraphId: string, type: SpanContentType = 'text') {
        this.id = nanoid()
        this.type = type
        this.content = content
        this.ownerParagraphId = ownerParagraphId
    }
}
//生成响应式段落list
const paragraphs = reactive<Array<Paragraph>>([new Paragraph()])
//绑定换行添加p段落
//获取模板引用
const editor = ref<HTMLDivElement | null>(null)
//键盘回车事件
const pushParagraph = (event: Event) => {
    if ((event as KeyboardEvent).key === 'Enter') {
        // paragraphs.push(new Paragraph())
        //让光标换行
        //TODO: 内容没有换行
        const selection = window.getSelection()
        const selectionRange = selection?.getRangeAt(0)
        //获取当前行的id
        const currentSpan = selectionRange?.commonAncestorContainer as any
        const currentParagraphId = currentSpan.parentElement.attributes['ownerParagraphId'].value
        //从Paragraphs中找到对应的paragraph
        const currentParagraph = paragraphs.find((p: Paragraph) => {
            return p.id === currentParagraphId
        })
        //换行切割长度
        const sliceLength = selectionRange?.startOffset! - 1
        const wholeText = currentSpan.wholeText as string
        const sliceText = wholeText.slice(0, sliceLength)
        //添加paragraph
        sliceText ? paragraphs.push(new Paragraph(sliceText)) : paragraphs.push(new Paragraph())
        // paragraphs.push(new Paragraph())
        console.log('Range对象', selectionRange)
        console.log(sliceLength, sliceText)

        if (editor.value && selection) {
            const range = document.createRange()
            range.selectNodeContents(editor.value)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
        }
    }
}
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
