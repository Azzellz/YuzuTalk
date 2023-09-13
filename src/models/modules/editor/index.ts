//!插件列表
import { ImageManager } from './plugins/imageManager'

//将需要实现的功能插件放到这里做约束
interface I_YuzuEditorPlugins {
    imageManager: ImageManager
}
//!编辑器主容器
//抽象onMounted传入的ref的value的值
export interface I_YuzuEditor {
    getToolbar(): HTMLDivElement
    getEditor(): HTMLDivElement
}
//插入元素的属性
interface I_Attribute {
    key: string
    value: string
}

//抽象编辑器核心
abstract class EditorCore {
    constructor(
        //这两个本质就是Span和Div
        public toolBar: HTMLSpanElement,
        public editor: HTMLDivElement
    ) {}
    appendChildToEditor<ElementType extends HTMLElement>(
        tagName: string,
        ...attributes: Array<I_Attribute>
    ): void {
        const p = document.createElement('p')
        const childTag = document.createElement(tagName) as ElementType
        attributes.forEach((attribute: I_Attribute) => {
            childTag.setAttribute(attribute.key, attribute.value)
        })
        p.appendChild(childTag)
        this.editor.appendChild(p)
    }
}
export class YuzuEditor extends EditorCore implements I_YuzuEditorPlugins {
    public imageManager: ImageManager
    //实现类需要提供ref引用的value传入来初始化
    constructor(yuzuEditor: I_YuzuEditor) {
        //这里要对两个容器进行解包
        const toolBarContainer: HTMLDivElement = yuzuEditor.getToolbar()
        const toolBar = toolBarContainer.querySelector('.ql-formats') as HTMLSpanElement
        const editorContainer: HTMLDivElement = yuzuEditor.getEditor()
        const editor = editorContainer.querySelector('.ql-editor') as HTMLDivElement
        //初始化core
        super(toolBar, editor)
        //初始化各插件
        //把当前实例传入各插件的构造函数,即可实现单例
        this.imageManager = new ImageManager(this)
    }
}
