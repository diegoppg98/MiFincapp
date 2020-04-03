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

import { mapActions, mapGetters } from 'vuex';
import { loadLocaleAsync } from '@shared/plugins/i18n/i18n';
import '@shared/designSystem/global.scss';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
  

export default {
  name: 'App',
  components: {
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
    this.initProgressBar();
  },

};
</script>

<style >
</style>
