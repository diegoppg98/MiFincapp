import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaDispositivo from './AltaDispositivo.vue';

const localVue = createLocalVue();

describe('AltaDispositivo.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(AltaDispositivo, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
