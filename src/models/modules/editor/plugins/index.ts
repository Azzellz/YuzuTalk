import { YuzuEditor } from "..";

//!编辑器的插件的抽象类
//插件需要满足的条件
export abstract class EditorPlugin {
    //!所有插件都必须要满足有一个yuzuEditor实例
    constructor(public yuzuEditor: YuzuEditor) {}
}
