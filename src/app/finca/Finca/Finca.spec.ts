import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Finca from './Finca.vue';

const localVue = createLocalVue();

describe('Finca.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(Finca, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
