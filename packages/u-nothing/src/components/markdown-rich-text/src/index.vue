<script lang="ts" setup>
import { useOptions, useNamespace, useConfig, useCssVar } from '@u-nothing/hooks';
import type { CommonProps } from '@u-nothing/config';
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import uVirtualList from '@u-nothing/components/virtual-list';
import uButton from '@u-nothing/components/button';
import MarkdownIt from 'markdown-it';
import 'github-markdown-css/github-markdown.css';

interface Props extends CommonProps {
  test?: string;
}

defineOptions({
  name: useOptions('markdown-rich-text'),
});

const ns = useNamespace('markdown-rich-text');
const props = defineProps<Props>();
const { sizeClass } = useConfig(props);
const modelValue = defineModel('modelValue', {
  type: String,
  default: '',
});
const innerModel = ref<string>(modelValue.value ?? '');
const lineHeight = ref<number>(0);
const markdownRichTextRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const virtualListRef = ref<InstanceType<typeof uVirtualList> | null>(null);
const virtualListHeight = ref<number>(0);
const isPreview = ref<boolean>(false);
const md = new MarkdownIt();

let resizeObserver: ResizeObserver | null = null;

const previewHtml = computed(() => {
  return md.render(innerModel.value);
});
const items = computed(() => {
  const list = innerModel.value.split('\n').map((line, index) => ({
    id: index + 1,
    content: line,
  }));
  return list;
});

const handleTextareaScroll = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  const scrollTop = target.scrollTop;
  virtualListRef.value?.updateScrollTop(scrollTop);
};

const updateVirtualItemLineHeight = () => {
  if (!markdownRichTextRef.value) return;

  const style = getComputedStyle(markdownRichTextRef.value);
  const fontSize = Number.parseFloat(style.fontSize);
  const paddingY = Number.parseFloat(style.getPropertyValue(useCssVar('size-padding-y'))) || 0;

  lineHeight.value = Math.ceil(fontSize * 1.2 + paddingY * 2);
};

const updateVirtualListHeight = () => {
  const el = textareaRef.value;

  if (!el) return;

  if (virtualListHeight.value !== el.clientHeight) {
    virtualListHeight.value = el.clientHeight;
  }
};

const handlePreview = () => {
  isPreview.value = !isPreview.value;
};

watch(modelValue, (value: string | undefined) => {
  if (value !== undefined && value !== innerModel.value) {
    innerModel.value = value;
  }
});

watch(innerModel, (value: string) => {
  if (value !== modelValue.value) {
    modelValue.value = value;

    nextTick(() => {
      updateVirtualListHeight();
    });
  }
});

watch(
  sizeClass,
  () => {
    nextTick(() => {
      updateVirtualItemLineHeight();
    });
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  if (!textareaRef.value) return;
  resizeObserver = new ResizeObserver(() => {
    updateVirtualListHeight();
  });

  resizeObserver.observe(textareaRef.value);

  nextTick(() => {
    updateVirtualListHeight();
  });
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div :class="[ns.b(), sizeClass]" ref="markdownRichTextRef">
    <div :class="ns.e('header')">
      <uButton @click="handlePreview" size="small" type="primary" text>{{
        !isPreview ? 'Editing' : 'Preview'
      }}</uButton>
    </div>

    <div v-if="!isPreview" :class="ns.e('content')">
      <uVirtualList
        disableWheel
        :class="ns.e('serial-number')"
        :items="items"
        :itemHeight="lineHeight"
        ref="virtualListRef"
        :style="{ height: `${virtualListHeight}px` }"
      >
        <template #default="{ item }">
          <div
            :class="ns.e('serial-number-item')"
            :style="{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }"
          >
            {{ item.id }}
          </div>
        </template>
      </uVirtualList>
      <div :class="ns.e('rich-text')">
        <textarea
          @scroll="handleTextareaScroll"
          v-model="innerModel"
          :style="{ lineHeight: `${lineHeight}px` }"
          ref="textareaRef"
        ></textarea>
      </div>
    </div>
    <div v-else :class="[ns.e('preview'), ns.is('preview', isPreview)]">
      <div class="markdown-body" v-html="previewHtml"></div>
    </div>
  </div>
</template>
