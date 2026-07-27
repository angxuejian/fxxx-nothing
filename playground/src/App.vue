<template>
  <div class="app">
    <uConfigProvide :htmlFontSize="16">
      <uMarkdownRichText v-model="textVal" class="markdown-rich-text"> </uMarkdownRichText>
    </uConfigProvide>
  </div>
</template>

<script lang="ts" setup>
import { uConfigProvide, uMarkdownRichText } from '@u-nothing/index';
import { onMounted, ref } from 'vue';
import '@theme/index.scss';
onMounted(() => {
  console.log('playground');
});

const textVal = ref(`
# u.nothing

Just writing casually

## Scripts

| 命令                    | 说明                                  |
| ----------------------- | ------------------------------------- |
| pnpm run type-check   | 使用 vue-tsc 进行类型检查           |


`);
</script>

<style lang="css">
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family:
    sans-serif,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei';

  background-color: #fff;
  color: #000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  padding: 20px;
}
.container {
  width: 100%;
}
.u-grid {
  border: 1px solid red;
  height: 200px;
}
.u-grid-item {
  background-color: #c0c0c0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #000;
}

.markdown-rich-text {
  height: 500px;
  width: 100%;
}
</style>
