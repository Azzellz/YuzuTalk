<template>
    <div :class="autoFitClass">
        <ImageUploader></ImageUploader>
    </div>
</template>

<script setup lang="ts">
import ImageUploader from '@/components/Image/Image-Uploader.vue'
import { useAutoFitClass } from '@/hooks/useAutoFitClass'
const { autoFitClass } = useAutoFitClass()
</script>

<style scoped></style>
