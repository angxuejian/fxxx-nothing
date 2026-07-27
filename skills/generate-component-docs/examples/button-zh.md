# Button 按钮元素

就是 `button` 元素

## 基础用法

::: demo

<div>
    <uButton default>按钮</uButton>
    <p />
    <uButton size='small' text>按钮</uButton>
    <p />
    <uButton size='medium'>按钮</uButton>
    <p />
    <uButton size='large' plain>按钮</uButton>
</div>
:::

## Props

| 属性名   | 说明                                      | 类型                         | 默认值   |
| -------- | ----------------------------------------- | ---------------------------- | -------- |
| loading  | 是否为加载中状态                          | boolean                      | false    |
| color    | 按钮颜色（如 primary、success、error 等） | string                       | ''       |
| disabled | 是否为禁用状态                            | boolean                      | false    |
| text     | 是否为文本按钮                            | boolean                      | false    |
| plain    | 是否为朴素按钮                            | boolean                      | fasle    |
| size     | 组件尺寸                                  | `small` / `medium` / `large` | `medium` |
| theme    | 样式主题                                  | `browser` / `ustyle`         | `ustyle` |

## 插槽

| 插槽名  | 说明 | 插槽属性 |
| ------- | ---- | -------- |
| default | 内容 | -        |
