<script lang="ts" setup>
import { useOptions, useNamespace } from '@u-nothing/hooks';
import type { CommonProps } from '@u-nothing/config';
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface Emits {
  (event: 'scroll', value: Event): void;
  (event: 'resize', value: HTMLElement): void;
}

interface Props extends CommonProps {
  itemHeight: number;
  items: any[];
  itemKey?: string;
  disableWheel?: boolean;
  overscan?: number;
}

defineOptions({
  name: useOptions('virtual-list'),
});

const ns = useNamespace('virtual-list');
const props = withDefaults(defineProps<Props>(), {
  overscan: 1,
});
const emit = defineEmits<Emits>();
const scrollTop = ref(0);
const virtualListRef = ref<HTMLElement | null>(null);
const viewportHeight = ref(0);
let observer: ResizeObserver | null = null;

const listHeight = computed(() => props.items.length * props.itemHeight);

const startIndex = computed(() => {
  // return Math.floor(scrollTop.value / props.itemHeight);
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan);
});

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight;
});

const visibleCount = computed(() => {
  // return Math.ceil(viewportHeight.value / props.itemHeight);
  return Math.ceil(viewportHeight.value / props.itemHeight) + props.overscan * 2;
});

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, startIndex.value + visibleCount.value);
});

const updateViewportHeight = () => {
  viewportHeight.value = virtualListRef.value?.clientHeight || 0;
};

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  scrollTop.value = target.scrollTop;
  emit('scroll', event);
};

const handleWheel = (event: WheelEvent) => {
  if (props.disableWheel) {
    event.preventDefault();
    return;
  }
};

const updateScrollTopByRow = (delta: number) => {
  if (!virtualListRef.value) return;

  virtualListRef.value.scrollTop += delta * props.itemHeight;
};

const updateScrollTop = (top: number) => {
  if (!virtualListRef.value) return;
  virtualListRef.value.scrollTop = top;
};

onMounted(() => {
  observer = new ResizeObserver(() => {
    updateViewportHeight();
    emit('resize', virtualListRef.value!);
  });

  observer.observe(virtualListRef.value!);
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});

defineExpose({
  updateScrollTopByRow,
  updateViewportHeight,
  updateScrollTop,
});
</script>

<template>
  <div ref="virtualListRef" :class="ns.b()" @scroll="handleScroll" @wheel="handleWheel">
    <div :class="ns.e('phantom')" :style="{ height: listHeight + 'px' }"></div>
    <div :class="ns.e('content')" :style="{ transform: `translateY(${offsetY}px)` }">
      <slot
        v-for="(item, index) in visibleItems"
        :key="props.itemKey ? item[props.itemKey] : index"
        :item="item"
        :index="startIndex + index"
      ></slot>
    </div>
  </div>
</template>
