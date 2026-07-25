# Markdown Rich Text 富文本编辑器

支持 Markdown 编辑与实时预览的富文本编辑器组件，提供编辑和预览两种模式，支持行号显示和虚拟滚动。

## 基础用法

::: demo

<template>
    <div>
        <uMarkdownRichText v-model="markdown" style="width: 100%; height: 280px;"></uMarkdownRichText>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const markdown = ref(`# Markdown 标题

这是一个**粗体**文本，这是一个*斜体*文本。

## 列表示例

- 项目 1
- 项目 2
- 项目 3

## 代码示例

\`\`\`javascript
const hello = "world";
\`\`\`
`);
</script>

:::

## Props

| 属性名  | 说明       | 类型                         | 默认值   |
| ------- | ---------- | ---------------------------- | -------- |
| v-model | 编辑器内容 | string                       | ''       |
| size    | 组件尺寸   | `small` / `medium` / `large` | `medium` |
