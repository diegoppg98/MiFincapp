import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Notificacion from './Notificacion.vue';

const localVue = createLocalVue();

describe('Notificacion.vue', () => {
  test('renders component', () => {
    const wrapper = mount<any>(Notificacion, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });
  });
});
