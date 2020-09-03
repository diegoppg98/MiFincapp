import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaFinca from './AltaFinca.vue';

const localVue = createLocalVue();

describe('AltaFinca.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(AltaFinca, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
