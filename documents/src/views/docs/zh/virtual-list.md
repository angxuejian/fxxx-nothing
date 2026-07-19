# Virtual List 虚拟列表

一种仅渲染视口内可见项的虚拟列表组件，可显著提升大数据量场景下的渲染性能。

## 基础用法

::: demo

<script setup>
const items = Array.from({ length: 150 }, (_, index) => ({
  id: index,
  label: `Item ${index + 1}`,
}));
</script>

<template>
  <uVirtualList
    :itemHeight="40"
    :items="items"
    itemKey="id"
    style="height: 180px; width: 100%; border: 1px solid #e5e7eb;"
  >
    <template #default="{ item, index }">
      <div style="height: 40px; display: flex; align-items: center; padding: 0 12px; border-bottom: 1px solid #f0f0f0;">
        {{ item.label }} - #{{ index }}
      </div>
    </template>
  </uVirtualList>
</template>
:::

## Props

> [!WARNING]
> 当使用 `itemKey` 时，组件会动态追加 DOM 节点；不使用时会默认使用 `index` 作为唯一 key，这时只会触发 Vue 的 patch 更新。

| 属性名       | 说明                       | 类型    | 默认值 |
| ------------ | -------------------------- | ------- | ------ |
| itemHeight   | 每项的高度，单位为像素     | number  | -      |
| items        | 列表数据源                 | any[]   | -      |
| itemKey      | 渲染时用于标识每项的字段名 | string  | -      |
| disableWheel | 是否阻止鼠标滚轮滚动       | boolean | false  |
| overscan     | 视口上下额外多渲染的项数   | number  | 1      |

## 插槽

| 插槽名  | 说明                   | 插槽属性          |
| ------- | ---------------------- | ----------------- |
| default | 每个已渲染项的内容模板 | `{ item, index }` |

## 事件

| 事件名 | 说明                     | 回调参数                 |
| ------ | ------------------------ | ------------------------ |
| scroll | 当列表容器发生滚动时触发 | `(event: Event)`         |
| resize | 当视口尺寸发生变化时触发 | `(element: HTMLElement)` |

## Expose

| 方法名               | 说明               | 参数              |
| -------------------- | ------------------ | ----------------- |
| updateScrollTopByRow | 按指定行数滚动列表 | `(delta: number)` |
| updateViewportHeight | 重新计算视口高度   | -                 |
