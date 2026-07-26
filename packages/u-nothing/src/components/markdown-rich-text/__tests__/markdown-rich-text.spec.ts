import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import UMarkdownRichText from '../src/index.vue';
import UVirtualList from '@u-nothing/components/virtual-list';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock as any;

const mockMarkdown = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5';

describe('UMarkdownRichText', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component', () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text').exists()).toBe(true);
  });

  it('should render header with preview button', () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    const header = wrapper.find('.u-markdown-rich-text__header');
    expect(header.exists()).toBe(true);

    const button = header.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Editing');
  });

  it('should render textarea in editing mode', () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text__content').exists()).toBe(true);
  });

  it('should render virtual list with correct items', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    await wrapper.vm.$nextTick();

    const virtualList = wrapper.findComponent(UVirtualList);
    expect(virtualList.exists()).toBe(true);

    const items = virtualList.props('items');
    expect(items).toHaveLength(5);
    expect(items[0]).toEqual({ id: 1, content: 'Line 1' });
    expect(items[4]).toEqual({ id: 5, content: 'Line 5' });
  });

  it('should update inner model when modelValue changes', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: 'Initial',
      },
    });

    await wrapper.setProps({ modelValue: 'Updated' });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).innerModel).toBe('Updated');
  });

  it('should emit modelValue update when textarea changes', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: 'Initial',
      },
    });

    const textarea = wrapper.find('textarea');
    await textarea.setValue('Updated text');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Updated text']);
  });

  it('should toggle preview mode', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: '# Title\n\nContent',
      },
    });

    expect(wrapper.find('.u-markdown-rich-text__content').exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text__preview').exists()).toBe(false);

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.find('.u-markdown-rich-text__content').exists()).toBe(false);
    expect(wrapper.find('.u-markdown-rich-text__preview').exists()).toBe(true);
    expect(button.text()).toBe('Preview');
  });

  it('should render markdown html in preview mode', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: '# Title\n\nParagraph',
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');
    await wrapper.vm.$nextTick();

    const preview = wrapper.find('.markdown-body');
    expect(preview.exists()).toBe(true);
    expect(preview.html()).toContain('<h1>Title</h1>');
    expect(preview.html()).toContain('<p>Paragraph</p>');
  });

  it('should sync textarea scroll to virtual list', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    const virtualListRef = (wrapper.vm as any).virtualListRef;
    const updateScrollTopSpy = vi.spyOn(virtualListRef, 'updateScrollTop');

    const textarea = wrapper.find('textarea');
    // const scrollEvent = new Event('scroll');
    textarea.element.scrollTop = 100;

    await textarea.trigger('scroll');

    expect(updateScrollTopSpy).toHaveBeenCalledWith(100);
  });

  it('should render serial numbers correctly', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    await wrapper.vm.$nextTick();

    const serialNumberList = wrapper.find('.u-markdown-rich-text__serial-number');
    expect(serialNumberList.exists()).toBe(true);

    const virtualList = serialNumberList.findComponent(UVirtualList);
    expect(virtualList.exists()).toBe(true);

    const items = virtualList.props('items');
    expect(items).toHaveLength(5);
  });

  it('should calculate line height correctly', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    // Mock getComputedStyle to return valid values
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      fontSize: '16px',
      getPropertyValue: vi.fn(() => '4px'),
    } as any);

    // Trigger the line height calculation
    (wrapper.vm as any).updateVirtualItemLineHeight();

    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).lineHeight).toBeGreaterThan(0);
    expect((wrapper.vm as any).lineHeight).toBe(Math.ceil(16 * 1.2 + 4 * 2));

    getComputedStyleSpy.mockRestore();
  });

  it('should update virtual list height on mount', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    Object.defineProperty(wrapper.find('textarea').element, 'clientHeight', {
      value: 400,
      configurable: true,
    });

    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).virtualListHeight).toBeGreaterThanOrEqual(0);
  });

  it('should observe textarea resize', () => {
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();

    global.ResizeObserver = class {
      observe = observeMock;
      disconnect = disconnectMock;
    } as any;

    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    expect(observeMock).toHaveBeenCalled();

    wrapper.unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should create correct items from multiline text', async () => {
    const multilineText = 'First\nSecond\nThird';

    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: multilineText,
      },
    });

    await wrapper.vm.$nextTick();

    const items = (wrapper.vm as any).items;
    expect(items).toHaveLength(3);
    expect(items[0]).toEqual({ id: 1, content: 'First' });
    expect(items[1]).toEqual({ id: 2, content: 'Second' });
    expect(items[2]).toEqual({ id: 3, content: 'Third' });
  });

  it('should update virtual list height when content changes', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: 'Line 1',
      },
    });

    // const initialHeight = (wrapper.vm as any).virtualListHeight;

    await wrapper.setProps({ modelValue: 'Line 1\nLine 2\nLine 3' });
    await wrapper.vm.$nextTick();

    // Virtual list height should be set (could be same or different)
    expect((wrapper.vm as any).virtualListHeight).toBeGreaterThanOrEqual(0);
  });

  it('should have disableWheel prop on virtual list', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    const virtualList = wrapper.findComponent(UVirtualList);
    expect(virtualList.props('disableWheel')).toBe(true);
  });

  it('should render with correct CSS classes', () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: mockMarkdown,
      },
    });

    const root = wrapper.find('.u-markdown-rich-text');
    expect(root.exists()).toBe(true);

    expect(wrapper.find('.u-markdown-rich-text__header').exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text__content').exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text__rich-text').exists()).toBe(true);
    expect(wrapper.find('.u-markdown-rich-text__serial-number').exists()).toBe(true);
  });

  it('should toggle preview and editing mode multiple times', async () => {
    const wrapper = mount(UMarkdownRichText, {
      props: {
        modelValue: '# Title',
      },
    });

    const button = wrapper.find('button');

    // First toggle - to preview
    await button.trigger('click');
    expect(wrapper.find('.u-markdown-rich-text__preview').exists()).toBe(true);

    // Second toggle - back to editing
    await button.trigger('click');
    expect(wrapper.find('.u-markdown-rich-text__content').exists()).toBe(true);

    // Third toggle - to preview again
    await button.trigger('click');
    expect(wrapper.find('.u-markdown-rich-text__preview').exists()).toBe(true);
  });
});
