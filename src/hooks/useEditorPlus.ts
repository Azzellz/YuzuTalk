
import { ref, onMounted } from 'vue'
import { YuzuEditor, type I_YuzuEditor } from '@/models/modules/editor/index';

export function useEditorPlus() {
    const QuillEditorRef = ref<I_YuzuEditor | null>(null)
    onMounted(() => {
        const quillEditor = QuillEditorRef.value
        if (quillEditor) {
            new YuzuEditor(quillEditor)
        }
    })
    //!这里注意一定要返回Ref,vue才能获取到
    return { QuillEditorRef }
}
