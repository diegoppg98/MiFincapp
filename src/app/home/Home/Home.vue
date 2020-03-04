<template>
  <div :class="$style.home">
    <vue-notification-stack />
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
           <br />
          <br />
          <br />
                   <br />
          <br />
          <br />
          <vue-headline level="1">Home</vue-headline>
          HOME PARA INICIAR SESION O REGISTRARSE
          <br />
          <br />
          <br />
        <vue-button color="primary" @click="showLoginModal = true">
        Iniciar Sesion
      </vue-button>

      <vue-button color="primary" @click="registrarUsuario">
        Registrarse
      </vue-button>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>

        <vue-modal :show="showLoginModal" @close="showLoginModal = false">
      <login-form @submit="onLoginSubmit" />
    </vue-modal>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions, mapGetters } from 'vuex';
//import Stage from '../components/Stage/Stage.vue';
//import HomeSection from '@/app/home/components/HomeSection/HomeSection.vue';
import { IState } from '@/app/state';
//import VueHeadline from '@components/VueHeadline/VueHeadline.vue';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';

import VueModal from '@components/VueModal/VueModal.vue';

import LoginForm from '@/app/shared/modules/auth/LoginForm/LoginForm.vue';

import {router} from '../../router';

import VueNotificationStack from '@/app/shared/components/VueNotificationStack/VueNotificationStack.vue';
import { addNotification } from '@/app/shared/components/VueNotificationStack/utils';

export default {
  metaInfo: {
    title: 'MiFincApp',
    meta: [
      {
        name: 'description',
        content:
          'App for control irrigation',
      },

    ],
  },
  data(): any {
    return {
      showLoginModal: false,
    };
  },
  components: {
    VueGrid,
    VueGridItem,
    VueButton,
    VueGridRow,
    VueHeadline,
    LoginForm,
    VueModal,
    VueNotificationStack,
    
  },
  computed: {
    /*...mapState({
      disableParticles: (state: IState) =>
        (state.app.config && state.app.config.features && state.app.config.features.disableParticles) || false,
    }),*/
    ...mapGetters('auth', ['isAuthenticated']),
  },

  methods: {
    ...mapActions('auth', ['createToken', 'revokeToken']),
    async onLoginSubmit(formData: any) {
      try {
        await this.createToken(formData);

        router.push({ name: 'dashboard' });
      } catch (e) {
        addNotification({ title: 'Error during login', text: 'Please try again!' });
      }

      this.showLoginModal = false;
    },
    async registrarUsuario() {
      router.push('/registrar-usuario');
    },
  },
};
</script>
<style lang="scss" module>
@import "~@/app/shared/design-system";

.home {
  margin-top: $nav-bar-height;
  min-height: 500px;
  display: flex;
  justify-content: top-center;
  align-items: top-center;
}

</style>

