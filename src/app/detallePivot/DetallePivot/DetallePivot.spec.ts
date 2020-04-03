import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetallePivot from './DetallePivot.vue';
//import { IDetallePivotState } from '../state';
//import { DetallePivotModule } from '../module';

const localVue = createLocalVue();

describe('DetallePivot.vue', () => {
  //let store: Store<IDetallePivotState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        detallePivot: DetallePivotModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(DetallePivot, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //DetallePivot.prefetch({});

   // expect(wrapper.find('h1').text()).toBe('DetallePivot');
  });
});
