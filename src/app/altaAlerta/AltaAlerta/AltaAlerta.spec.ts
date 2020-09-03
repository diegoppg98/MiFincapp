import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaAlerta from './AltaAlerta.vue';

const localVue = createLocalVue();

describe('AltaAlerta.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(AltaAlerta, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
