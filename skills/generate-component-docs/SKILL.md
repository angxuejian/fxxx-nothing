---
name: generate-component-docs
description: 通过分析组件的源码，自动生成组件的文档，包括组件的属性（Props）、方法（Expose）、事件（Events）、插槽（Slots）等信息。
---

## 输入

必需:

- 组件源码代码

## 输出

- 生成的组件文档，组件文档的内容包括：
  - 组件名称
  - 组件简介
  - 基础用法示例
  - 组件属性（Props），如果存在
  - 组件插槽（Slots），如果存在
  - 组件事件（Events），如果存在
  - 组件方法（Expose） ，如果存在
- 生成的组件文档要包含中文和英文两份文档，文档地址：
  - 中文文档地址：`documents/src/views/docs/zh/{组件名称}.md`
  - 英文文档地址：`documents/src/views/docs/en/{组件名称}.md`

## 组件文档模板

- 中文模板地址：`templates/zh.md`
- 英文模板地址：`templates/en.md`

## 组件文档示例

- 中文组件文档示例：`examples/button-zh.md`
- 英文组件文件示例：`examples/button-en.md`
