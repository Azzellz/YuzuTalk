<template>
    <div>
        <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.outputSize"
            :outputType="option.outputType"
        ></vueCropper>
    </div>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { reactive } from 'vue';

const option = reactive({
    img:'',
    outputSize:1,
    outputType: 'jpeg'
})
</script>

<style scoped></style>
