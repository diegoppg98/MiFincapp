import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import RegistrarUsuario from './RegistrarUsuario.vue';
// import { IRegistrarUsuarioState } from '../state';
// import { RegistrarUsuarioModule } from '../module';

const localVue = createLocalVue();

describe('RegistrarUsuario.vue', () => {
  // let store: Store<IRegistrarUsuarioState>;

  /*beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        registrarUsuario: RegistrarUsuarioModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(RegistrarUsuario, {
      // store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    // RegistrarUsuario.prefetch({});

    //  expect(wrapper.find('h1').text()).toBe('RegistrarUsuario');
  });
});
