import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Ayuda from './Ayuda.vue';
//import { IAyudaState } from '../state';
//import { AyudaModule } from '../module';

const localVue = createLocalVue();

describe('Ayuda.vue', () => {
  //let store: Store<IAyudaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        ayuda: AyudaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(Ayuda, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //Ayuda.prefetch({});

   // expect(wrapper.find('h1').text()).toBe('Ayuda');
  });
});
