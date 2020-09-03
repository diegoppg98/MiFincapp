import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetallePivot from './DetallePivot.vue';

const localVue = createLocalVue();

describe('DetallePivot.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(DetallePivot, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });

  });
});
