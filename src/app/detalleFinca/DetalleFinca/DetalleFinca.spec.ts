import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleFinca from './DetalleFinca.vue';

const localVue = createLocalVue();

describe('DetalleFinca.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(DetalleFinca, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });

  });
});
