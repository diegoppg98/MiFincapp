<<<<<<< HEAD
<template>    
<v-app>
 <div>
      <v-app-bar
        v-if="isAuthenticated"
        color="deep-purple accent-4"
        dense
        dark
        style="z-index: 9999"
      >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>MiFinca</v-toolbar-title>

      <v-spacer></v-spacer>     
      </v-app-bar>

      <v-navigation-drawer
        class="deep-purple accent-4"
        dark
        absolute
        app
        temporary
        v-model="drawer"
        style="z-index: 9999"
      >
     <v-avatar >
      <v-icon dark>mdi-account</v-icon>
    </v-avatar>
        <v-list >    
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.link"
            link
          >  
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          </v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2" @click="onLogout">
            <v-btn block>Cerrar sesión</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    <router-view />
    </div> 
  </v-app>
  
</template>





<script lang="ts">
=======
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
>>>>>>> origin/master

import { mapActions, mapGetters } from 'vuex';
import { loadLocaleAsync } from '@shared/plugins/i18n/i18n';
import '@shared/designSystem/global.scss';
<<<<<<< HEAD
=======
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

>>>>>>> origin/master
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
<<<<<<< HEAD
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
  
=======


import firebase from 'firebase';

>>>>>>> origin/master

export default {
  name: 'App',
  components: {
<<<<<<< HEAD
  },


  data(): any {
    return {
      drawer: false,
      isNavigating: false,
      showLoginModal: false,
      isLoginPending: false,
      isAuth: false,
      items: [
          { title: 'Inicio' , link: '/example/dashboard', icon: 'mdi-home'},
          { title: 'Perfil' , link: '/perfil', icon: 'mdi-account-box'},
          { title: 'Fincas' , link: '/finca', icon: 'mdi-sprout'},
          { title: 'Alertas' , link: '/alerta', icon: 'mdi-alert'},
          { title: 'Ayuda' , link: '/ayuda', icon: 'mdi-help-box'},
        ],
    };
  },

  computed: {
    isMenuDisabled() {
    FunctionsDatabase.userAutenticated().then((result) =>{
       this.isAuth = result;
       console.log(this.isAuth);
    });
      console.log(this.isAuth);
      return this.isAuth;
    },
    ...mapGetters('app', ['cookieConsentVersion', 'getLocale', 'getNombreFinca']),
    ...mapGetters('auth', ['isAuthenticated']),
  },
  methods: {
    ...mapActions('app', ['changeLocale', 'changeNombreFinca', 'setCookieConsentVersion']),
    ...mapActions('auth', ['createToken', 'revokeToken']),
    localeSwitch(locale: string) {
      loadLocaleAsync(locale).catch((error: Error) => console.log(error)); // tslint:disable-line
      this.changeNombreFinca("prueba");
=======
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

>>>>>>> origin/master
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
<<<<<<< HEAD

    async onLogout() {   
      FunctionsDatabase.logout();
      this.isLoginPending = true;
      await this.revokeToken();
      this.$router.push('/');
=======
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

>>>>>>> origin/master
      this.isLoginPending = false;
      this.showLoginModal = false;
    },

  },
<<<<<<< HEAD

  mounted() {
    this.initProgressBar();
  },

};
</script>

<style >
=======
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
>>>>>>> origin/master
</style>
