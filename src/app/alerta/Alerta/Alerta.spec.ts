import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Alerta from './Alerta.vue';

const localVue = createLocalVue();

describe('Alerta.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(Alerta, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
