import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UButton from '../../../packages/u-nothing/src/components/button';
import { useCssVar } from '../../../packages/u-nothing/src/hooks';

describe('UButton', () => {
  it('should render component', () => {
    const wrapper = mount(UButton);
    expect(wrapper.exists()).toBe(true);
  });

  it('should respect disabled and loading props', () => {
    const wrapper = mount(UButton, {
      props: {
        disabled: true,
        loading: true,
      },
    });

    expect(wrapper.classes('is-disabled')).toBe(true);
    expect(wrapper.classes('is-loading')).toBe(true);
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-test="button-loading"]').exists()).toBe(true);
  });

  it('should render default slot content', () => {
    const wrapper = mount(UButton, {
      slots: {
        default: 'Click me',
      },
    });

    expect(wrapper.text()).toContain('Click me');
  });

  it('should apply plain and color props', () => {
    const wrapper = mount(UButton, {
      props: {
        plain: true,
        color: '#ff0000',
      },
      slots: {
        default: 'Plain button',
      },
    });

    expect(wrapper.classes('is-plain')).toBe(true);
    expect(wrapper.classes('is-primary')).toBe(false);
    expect(wrapper.attributes('style')).toContain(`${useCssVar('color')}: #ff0000`);
    expect(wrapper.text()).toContain('Plain button');
  });

  it('should emit click event', async () => {
    const wrapper = mount(UButton);
    const button = wrapper.get('[data-test="button"]');

    await button.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')![0]).toEqual([expect.any(MouseEvent)]);
  });

  it('should emit click event multiple times', async () => {
    const wrapper = mount(UButton);
    const button = wrapper.get('[data-test="button"]');

    await button.trigger('click');
    await button.trigger('click');

    const events = wrapper.emitted('click')!;
    expect(events.length).toBe(2);
    expect(events[0]).toEqual([expect.any(MouseEvent)]);
    expect(events[1]).toEqual([expect.any(MouseEvent)]);
  });
});
