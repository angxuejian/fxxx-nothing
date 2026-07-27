---
name: generate-component-test
description: 通过分析组件的源码，自动生成组件的单元测试，包含测试组件的属性（Props）、方法（Expose）、事件（Events）、插槽（Slots）等。
dependency: vitest >= 2.1.8
  @vue/test-utils >= 2.4.6
  vue >= 3.5.22
---

## 输入

必需:

- 组件源码代码

## 输出

- 生成的组件单元测试，组件测试文件的内容包括：
  - describe('{组件名称}')
    - it('{测试内容}')
    - it('{测试内容}')
    - it('{测试内容}')

- 生成的组件单元测试地址：`packages/u-nothing/src/components/{组件名称}/__tests__/{组件名称}.spec.ts`

## 组件单元测试模板

- `templates/component.spec.ts`

## 组件单元测试示例

- `examples/button.spec.ts`
