import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleDispositivo from './DetalleDispositivo.vue';
// import { IDetalleDispositivoState } from '../state';
// import { DetalleDispositivoModule } from '../module';

const localVue = createLocalVue();

describe('DetalleDispositivo.vue', () => {
  // let store: Store<IDetalleDispositivoState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        detalleDispositivo: DetalleDispositivoModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(DetalleDispositivo, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    // DetalleDispositivo.prefetch({});

    // expect(wrapper.find('h1').text()).toBe('DetalleDispositivo');
  });
});
