import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import HistoricoAlerta from './HistoricoAlerta.vue';
//import { IHistoricoAlertaState } from '../state';
//import { HistoricoAlertaModule } from '../module';

const localVue = createLocalVue();

describe('HistoricoAlerta.vue', () => {
  //let store: Store<IHistoricoAlertaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        historicoAlerta: HistoricoAlertaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(HistoricoAlerta, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //HistoricoAlerta.prefetch({});

    expect(wrapper.find('h1').text()).toBe('HistoricoAlerta');
  });
});
