# Virtual List: A Virtualized List Component

A virtualized list component that only renders the visible items within the viewport, improving performance for large datasets.

## Basic Usage

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
> When using `itemKey`, the component will dynamically append DOM nodes. When `itemKey` is not provided, it defaults to using `index` as the unique key, which only triggers Vue's patch updates.

| Prop Name    | Description                                                 | Type    | Default |
| ------------ | ----------------------------------------------------------- | ------- | ------- |
| itemHeight   | Height of each item in pixels                               | number  | -       |
| items        | Data source for the list                                    | any[]   | -       |
| itemKey      | Key field used for each item when rendering                 | string  | -       |
| disableWheel | Whether to prevent wheel scrolling                          | boolean | false   |
| overscan     | Number of extra items rendered above and below the viewport | number  | 1       |

## Slots

| Slot Name | Description                             | Slot Props        |
| --------- | --------------------------------------- | ----------------- |
| default   | Content template for each rendered item | `{ item, index }` |

## Events

| Event Name | Description                               | Callback Parameters      |
| ---------- | ----------------------------------------- | ------------------------ |
| scroll     | Triggered when the list container scrolls | `(event: Event)`         |
| resize     | Triggered when the viewport size changes  | `(element: HTMLElement)` |

## Expose

| Method Name          | Description                                     | Parameters        |
| -------------------- | ----------------------------------------------- | ----------------- |
| updateScrollTopByRow | Scroll the list by a specified number of rows   | `(delta: number)` |
| updateViewportHeight | Recalculate the viewport height                 | -                 |
| updateScrollTop      | Scroll the list by a specified number of height | `(top: number)`   |
