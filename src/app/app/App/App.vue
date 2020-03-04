<template>
  <div id="app" :class="$style.app">
    <vue-notification-stack />

    <vue-navigation-progress :is-navigating="isNavigating" />

    <vue-nav-bar>
      
    </vue-nav-bar>

    <router-view :class="$style.content" />

    <vue-sidebar v-if="isAuthenticated">
      
      <vue-sidebar-group title="Navegacion">
        <vue-sidebar-group-item :to="{ name: 'dashboard' }">
          <vue-icon-code />
          Inicio
        </vue-sidebar-group-item>

        <vue-sidebar-group-item :to="{ name: 'perfil' }">
          <vue-icon-hashtag />
          Perfil
        </vue-sidebar-group-item>

        <vue-sidebar-group-item :to="{ name: 'finca' }">
          <vue-icon-hashtag />
          Fincas
        </vue-sidebar-group-item>

        <vue-sidebar-group-item :to="{ name: 'alerta' }">
          <vue-icon-hashtag />
          Alertas
        </vue-sidebar-group-item>

        <vue-sidebar-group-item :to="{ name: 'ayuda' }">
          <vue-icon-hashtag />
          Ayuda
        </vue-sidebar-group-item>
      </vue-sidebar-group>


       <vue-button color="primary" @click="onLogout">
        Cerrar Sesion
      </vue-button>
    </vue-sidebar>


  </div>
</template>

<script lang="ts">
//:to="{ name: 'login' }">

import { mapActions, mapGetters } from 'vuex';
import { loadLocaleAsync } from '@shared/plugins/i18n/i18n';
import '@shared/designSystem/global.scss';
import VueNavBar from '@components/VueNavBar/VueNavBar.vue';
import VueGrid from '@components/VueGrid/VueGrid.vue';
import VueGridItem from '@components/VueGridItem/VueGridItem.vue';
import VueFooter from '@components/VueFooter/VueFooter.vue';
import VueNotificationStack from '@components/VueNotificationStack/VueNotificationStack.vue';
import VueCookieConsent from '@components/VueCookieConsent/VueCookieConsent.vue';
import VueNavigationProgress from '@components/VueNavigationProgress/VueNavigationProgress.vue';
import VueSidebar from '@components/VueSidebar/VueSidebar.vue';
import VueSidebarGroup from '@components/VueSidebar/VueSidebarGroup/VueSidebarGroup.vue';
import VueSidebarGroupItem from '@components/VueSidebar/VueSidebarGroupItem/VueSidebarGroupItem.vue';
import VueIconCode from '@components/icons/VueIconCode/VueIconCode.vue';
import VueIconBook from '@components/icons/VueIconBook/VueIconBook.vue';
import VueIconHashtag from '@components/icons/VueIconHashtag/VueIconHashtag.vue';
import VueIconGithub from '@components/icons/VueIconGithub/VueIconGithub.vue';
import VueIconTwitterSquare from '@components/icons/VueIconTwitterSquare/VueIconTwitterSquare.vue';
import VueSelect from '@components/VueSelect/VueSelect.vue';
import VueIconPuzzlePiece from '@components/icons/VueIconPuzzlePiece/VueIconPuzzlePiece.vue';
import VueButton from '@components/VueButton/VueButton.vue';
import VueModal from '@components/VueModal/VueModal.vue';
import LoginForm from '@shared/modules/auth/LoginForm/LoginForm.vue';
import { addNotification } from '@components/VueNotificationStack/utils';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();


import firebase from 'firebase';


export default {
  name: 'App',
  components: {
    LoginForm,
    VueModal,
    VueButton,
    VueIconPuzzlePiece,
    VueSelect,
    VueIconTwitterSquare,
    VueIconGithub,
    VueIconHashtag,
    VueIconBook,
    VueIconCode,
    VueSidebarGroupItem,
    VueSidebarGroup,
    VueSidebar,
    VueNavigationProgress,
    VueCookieConsent,
    VueNavBar,
    VueGrid,
    VueGridItem,
    VueFooter,
    VueNotificationStack,
  },
  data(): any {
    return {
      isNavigating: false,
      languages: [
        { label: 'English', value: 'en' },
        { label: 'Deutsch', value: 'de' },
        { label: 'Português', value: 'pt' },
        { label: '中文', value: 'zh-cn' },
      ],
      showLoginModal: false,
      isLoginPending: false,
    };
  },
  computed: {
    ...mapGetters('app', ['cookieConsentVersion', 'getLocale']),
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('app', ['changeLocale', 'setCookieConsentVersion']),
    ...mapActions('auth', ['createToken', 'revokeToken']),
    localeSwitch(locale: string) {
      loadLocaleAsync(locale).catch((error: Error) => console.log(error)); // tslint:disable-line

      this.changeLocale(locale);
    },
    initProgressBar() {
      this.$router.beforeEach((to: any, from: any, next: any) => {
        this.isNavigating = true;
        next();
      });
      this.$router.afterEach(() => {
        this.isNavigating = false;
      });
    },
    async onLoginSubmit(formData: any) {
      
      this.isLoginPending = true;

      try {
        await this.createToken(formData);

        this.$router.push({ name: 'dashboard' });
      } catch (e) {
        addNotification({ title: 'Error al iniciar', text: 'Por favor intentelo otra vez' });
      }

      this.isLoginPending = false;
      this.showLoginModal = false;
    },
    async onLogout() {
   



      FunctionsDatabase.logout();
  
      this.isLoginPending = true;

      await this.revokeToken();

      this.$router.push('/');

      this.isLoginPending = false;
      this.showLoginModal = false;
    },

  },
  mounted() {
   // FunctionsDatabase.init();
    //firebase.auth().signInWithEmailAndPassword('prueba@gmail.com','123456');
   // console.log(firebase.auth().currentUser);
    this.initProgressBar();
  },
};
</script>

<style lang="scss" module>
@import '~@/app/shared/design-system';
@import '~@/app/shared/designSystem/reset';
@import '~@/app/shared/designSystem/typo';

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}

.logo {
  position: relative;
  top: $space-4;
  width: $space-24;
  height: $space-24;
}
</style>
