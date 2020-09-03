import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Perfil from './Perfil.vue';
const localVue = createLocalVue();

describe('Perfil.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(Perfil, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });

  });
});
