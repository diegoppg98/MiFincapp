import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaPivot from './AltaPivot.vue';

const localVue = createLocalVue();

describe('AltaPivot.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(AltaPivot, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
