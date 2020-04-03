import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import AltaAlerta from './AltaAlerta.vue';
//import { IAltaAlertaState } from '../state';
//import { AltaAlertaModule } from '../module';

const localVue = createLocalVue();

describe('AltaAlerta.vue', () => {
  //let store: Store<IAltaAlertaState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        altaAlerta: AltaAlertaModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(AltaAlerta, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //AltaAlerta.prefetch({});

<<<<<<< HEAD
    //expect(wrapper.find('h1').text()).toBe('AltaAlerta');
=======
    expect(wrapper.find('h1').text()).toBe('AltaAlerta');
>>>>>>> origin/master
  });
});
