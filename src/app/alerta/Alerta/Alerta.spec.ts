import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Alerta from './Alerta.vue';
// import { IAlertaState } from '../state';
// import { AlertaModule } from '../module';

const localVue = createLocalVue();

describe('Alerta.vue', () => {
  // let store: Store<IAlertaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        alerta: AlertaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(Alerta, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    // Alerta.prefetch({});

    // expect(wrapper.find('h1').text()).toBe('Alerta');
  });
});
