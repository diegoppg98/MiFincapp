import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Perfil from './Perfil.vue';
//import { IPerfilState } from '../state';
//import { PerfilModule } from '../module';

const localVue = createLocalVue();

describe('Perfil.vue', () => {
  //let store: Store<IPerfilState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        perfil: PerfilModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(Perfil, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //Perfil.prefetch({});

    expect(wrapper.find('h1').text()).toBe('Perfil');
  });
});
