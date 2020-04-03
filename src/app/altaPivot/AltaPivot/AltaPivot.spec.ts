import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaPivot from './AltaPivot.vue';
//import { IAltaPivotState } from '../state';
//import { AltaPivotModule } from '../module';

const localVue = createLocalVue();

describe('AltaPivot.vue', () => {
  //let store: Store<IAltaPivotState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        altaPivot: AltaPivotModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(AltaPivot, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //AltaPivot.prefetch({});

<<<<<<< HEAD
   // expect(wrapper.find('h1').text()).toBe('AltaPivot');
=======
    expect(wrapper.find('h1').text()).toBe('AltaPivot');
>>>>>>> origin/master
  });
});
