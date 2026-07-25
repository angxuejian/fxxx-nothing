<template>
  <div class="demo-container">
    <div class="demo-container__header">
      <codeIcon @click="clickHandler" />
    </div>

    <div class="demo-container__component">
      <div :class="['card', isFilipped ? 'flipped' : '']">
        <div class="front">
          <slot />
        </div>
        <div contenteditable="true" class="back">
          <pre class="theme-atom-one-dark"><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import codeIcon from './icon/code.vue';

interface Props {
  code: string;
}
const props = defineProps<Props>();
const isFilipped = ref(false);

const highlightedCode = computed(() => {
  const decodedCode = decodeURIComponent(props.code);
  return hljs.highlight(decodedCode, {
    language: 'html',
  }).value;
});

const clickHandler = () => {
  isFilipped.value = !isFilipped.value;
};
</script>

<style lang="scss" scoped>
.demo-container {
  border: 1px solid #d8dee4;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.demo-container__header {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    opacity: 0.8;
  }
}

.demo-container__component {
  height: 300px;
  box-sizing: border-box;
  perspective: 1000px; /* 关键：3D 视角 */
  background-color: #333;

  .card {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out;
    &.flipped {
      transform: rotateX(180deg); /* 翻转卡片 */
    }
  }

  .front,
  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden; /* 隐藏背面 */
  }

  .front {
    background: #fff;
    user-select: none;
  }
  .back {
    background: #fff;
    transform: rotateX(180deg); /* 背面旋转180度 */
    border: none;
    outline: none;
  }

  pre,
  code {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
