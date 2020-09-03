import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleDispositivo from './DetalleDispositivo.vue';

const localVue = createLocalVue();

describe('DetalleDispositivo.vue', () => {

  test('renders component', () => {
    const wrapper = mount<any>(DetalleDispositivo, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });

  });
});
