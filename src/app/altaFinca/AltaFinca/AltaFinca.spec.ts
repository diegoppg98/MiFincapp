import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaFinca from './AltaFinca.vue';
//import { IAltaFincaState } from '../state';
//import { AltaFincaModule } from '../module';

const localVue = createLocalVue();

describe('AltaFinca.vue', () => {
  //let store: Store<IAltaFincaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        altaFinca: AltaFincaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(AltaFinca, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //AltaFinca.prefetch({});

   // expect(wrapper.find('h1').text()).toBe('AltaFinca');
  });
});
