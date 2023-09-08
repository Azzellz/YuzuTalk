<template>
    <pre>
        <code :class="codeClass">
            {{ code }}
        </code>
    </pre>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import { onMounted } from 'vue'
//定义Props
defineProps<{
    code: string
    codeClass: 'language-js' | 'language-css' | 'language-html'
}>()
onMounted(() => {
    Prism.highlightAll()
})
</script>

<style scoped></style>
