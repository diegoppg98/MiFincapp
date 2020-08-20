import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaDispositivo from './AltaDispositivo.vue';
// import { IAltaDispositivoState } from '../state';
// import { AltaDispositivoModule } from '../module';

const localVue = createLocalVue();

describe('AltaDispositivo.vue', () => {
  // let store: Store<IAltaDispositivoState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        altaDispositivo: AltaDispositivoModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(AltaDispositivo, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    // AltaDispositivo.prefetch({});

    // expect(wrapper.find('h1').text()).toBe('AltaDispositivo');
  });
});
