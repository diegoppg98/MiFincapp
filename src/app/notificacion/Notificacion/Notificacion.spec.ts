import { createLocalVue, mount } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { i18n } from '@/app/shared/plugins/i18n/i18n';
import Notificacion from './Notificacion.vue';
//import { INotificacionState } from '../state';
//import { NotificacionModule } from '../module';

const localVue = createLocalVue();

describe('Notificacion.vue', () => {
  /*let store: Store<INotificacionState>;

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        notificacion: NotificacionModule,
      },
    } as any);
  });*/

  test('renders component', () => {
    const wrapper = mount<any>(Notificacion, {
      //store,
      localVue,
      i18n,
      stubs: ['router-link'],
    });

    //Notificacion.prefetch({});

    //expect(wrapper.find('h1').text()).toBe('Notificacion');
  });
});
