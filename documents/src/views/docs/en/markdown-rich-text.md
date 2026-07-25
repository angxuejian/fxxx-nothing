# Markdown Rich Text: Rich Text Editor

A rich text editor component supporting Markdown editing with real-time preview. It provides editing and preview modes with line number display and virtual scrolling performance.

## Basic Usage

::: demo
<template>
<div>
<uMarkdownRichText v-model="markdown" style="width: 100%; height: 280px;"></uMarkdownRichText>
</div>
</template>

<script setup>
import { ref } from 'vue';
const markdown = ref(`# Markdown Title

This is **bold** text, and this is *italic* text.

## List Example

- Item 1
- Item 2
- Item 3

## Code Example

\`\`\`javascript
const hello = "world";
\`\`\`
`);
</script>

:::

## Props

| Prop Name | Description    | Type                         | Default  |
| --------- | -------------- | ---------------------------- | -------- |
| v-model   | Editor content | string                       | ''       |
| size      | Component size | `small` / `medium` / `large` | `medium` |
