<template>
  <div class="app">
    <uConfigProvide :htmlFontSize="16">
      <uVirtualList
        ref="virtualListRef"
        class="virtual-list"
        :itemHeight="50"
        :items="items"
        itemKey="id"
      >
        <template #default="{ item, index }">
          <div style="height: 50px" class="virtual-list-item">{{ item.name }} - {{ index }}</div>
        </template>
      </uVirtualList>
    </uConfigProvide>

    <div @click="add">add</div>
  </div>
</template>

<script lang="ts" setup>
import { uConfigProvide, uVirtualList } from '@u-nothing/index';
import { onMounted, ref } from 'vue';
import '@theme/index.scss';
onMounted(() => {
  console.log('playground');
});

const items = Array.from({ length: 150 }, (_, index) => {
  return { name: `Item ${index + 1}`, id: index };
});
const virtualListRef = ref<InstanceType<typeof uVirtualList> | null>(null);
const add = () => {
  virtualListRef.value?.updateScrollTopByRow(1);
};
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

.virtual-list {
  height: 500px;
  width: 300px;
  background-color: #f9f9f9;
}
.virtual-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
