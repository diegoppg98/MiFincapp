import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Finca from './Finca.vue';
//import { IFincaState } from '../state';
//import { FincaModule } from '../module';

const localVue = createLocalVue();

describe('Finca.vue', () => {
  //let store: Store<IFincaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        finca: FincaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(Finca, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //Finca.prefetch({});

  //  expect(wrapper.find('h1').text()).toBe('Finca');
  });
});
