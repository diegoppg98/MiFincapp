import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import DetalleFinca from './DetalleFinca.vue';
// import { IDetalleFincaState } from '../state';
// import { DetalleFincaModule } from '../module';

const localVue = createLocalVue();

describe('DetalleFinca.vue', () => {
  // let store: Store<IDetalleFincaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        detalleFinca: DetalleFincaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(DetalleFinca, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    // DetalleFinca.prefetch({});

    // expect(wrapper.find('h1').text()).toBe('DetalleFinca');
  });
});
