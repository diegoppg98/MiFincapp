import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleAlerta from './DetalleAlerta.vue';

const localVue = createLocalVue();

describe('DetalleAlerta.vue', () => {

  test('renders component', () => {
    const wrapper = mount<any>(DetalleAlerta, {
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    DetalleAlerta.prefetch({});

  });
});
