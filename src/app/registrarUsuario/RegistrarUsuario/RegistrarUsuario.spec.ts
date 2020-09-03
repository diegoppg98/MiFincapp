import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import RegistrarUsuario from './RegistrarUsuario.vue';

const localVue = createLocalVue();

describe('RegistrarUsuario.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(RegistrarUsuario, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
