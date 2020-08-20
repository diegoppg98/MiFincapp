import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleAlerta from './DetalleAlerta.vue';
// import { IDetalleAlertaState } from '../state';
// import { DetalleAlertaModule } from '../module';

const localVue = createLocalVue();

describe('DetalleAlerta.vue', () => {
 // let store: Store<IDetalleAlertaState>;

 /* beforeEach(() => {
    store = new Vuex.Store({
      modules: {
  //      detalleAlerta: DetalleAlertaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(DetalleAlerta, {
    //  store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    DetalleAlerta.prefetch({});

    // expect(wrapper.find('h1').text()).toBe('DetalleAlerta');
  });
});
