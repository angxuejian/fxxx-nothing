import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import UVirtualList from '../src/index.vue';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as any;

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  label: `item-${i}`,
}));

describe('UVirtualList', () => {
  it('should render component', () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should render phantom height correctly', () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
      },
    });

    expect(wrapper.find('.u-virtual-list__phantom').attributes('style')).toContain(
      'height: 2000px',
    );
  });

  it('should render only visible items', async () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
        overscan: 1,
      },
      slots: {
        default: ({ item }: any) => h('div', { class: 'item' }, item.label),
      },
    });

    const list = wrapper.get('.u-virtual-list');

    Object.defineProperty(list.element, 'clientHeight', {
      value: 100,
      configurable: true,
    });

    (wrapper.vm as any).updateViewportHeight();

    await wrapper.vm.$nextTick();

    const rendered = wrapper.findAll('.item');

    // ceil(100 / 20) + 1 * 2 = 7
    expect(rendered).toHaveLength(7);

    expect(wrapper.text()).toContain('item-0');
    expect(wrapper.text()).toContain('item-6');
    expect(wrapper.text()).not.toContain('item-7');
  });

  it('should emit scroll event', async () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
      },
    });

    const list = wrapper.get('.u-virtual-list');

    list.element.scrollTop = 100;

    await list.trigger('scroll');

    expect(wrapper.emitted('scroll')).toBeTruthy();
    expect(wrapper.emitted('scroll')![0]).toEqual([expect.any(Event)]);
  });

  it('should emit resize event', () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
      },
    });

    expect(wrapper.vm).toHaveProperty('updateViewportHeight');
  });

  it('should prevent wheel when disableWheel is true', async () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
        disableWheel: true,
      },
    });

    const preventDefault = vi.fn();

    await wrapper.get('.u-virtual-list').trigger('wheel', {
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
  });

  it('should update scrollTop by row', () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
      },
    });

    const list = wrapper.get('.u-virtual-list');

    list.element.scrollTop = 0;

    (wrapper.vm as any).updateScrollTopByRow(3);

    expect(list.element.scrollTop).toBe(60);
  });

  it('should apply overscan correctly', async () => {
    const wrapper = mount(UVirtualList, {
      props: {
        itemHeight: 20,
        items,
        overscan: 2,
      },
      slots: {
        default: ({ item }: any) => h('div', { class: 'item' }, item.label),
      },
    });

    const list = wrapper.get('.u-virtual-list');

    Object.defineProperty(list.element, 'clientHeight', {
      value: 100,
      configurable: true,
    });

    (wrapper.vm as any).updateViewportHeight();

    list.element.scrollTop = 100;

    await list.trigger('scroll');
    await wrapper.vm.$nextTick();

    const rendered = wrapper.findAll('.item');

    // ceil(100 / 20) + 2 * 2 = 9
    expect(rendered).toHaveLength(9);

    // scrollTop=100 -> 第5项，overscan=2，所以从 item-3 开始
    expect(wrapper.text()).toContain('item-3');
    expect(wrapper.text()).toContain('item-11');
    expect(wrapper.text()).not.toContain('item-12');
  });
});
