<template>
  <v-app>
    <div>
      <v-app-bar :key="componentKey" v-if="getUser" :color="color" dense dark style="z-index: 9999">
        <v-app-bar-nav-icon @click="drawerMethod"></v-app-bar-nav-icon>
        <v-toolbar-title>MiFincapp</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-navigation-drawer
        :color="color"
        dark
        disable-resize-watcher
        absolute
        app
        temporary
        v-model="drawer"
        style="z-index: 9999"
      >
        <v-card shaped class="rounded-card mx-5 my-5">
          <v-img height="180" :src="picture"></v-img>
        </v-card>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" :to="item.link" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card :color="color" outlined class="px-2">
          <div @click="onLogout">
            <v-btn block class="mx-auto" @click="onLogout">Cerrar sesión</v-btn>
          </div>
        </v-card>
      </v-navigation-drawer>
      <v-content>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { loadLocaleAsync } from '@shared/plugins/i18n/i18n';
import '@shared/designSystem/global.scss';
import { Database } from '../../interfaceDatabase';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { FactoryAPI } from '../../FactoryAPI';
import { colors } from '../../colors';
import { Usuario } from '../../Clases/Usuario';

export default {
  name: 'App',
  components: {},
  //
  data(): any {
    return {
      color: '#2e7d32',
      componentKey: 0,
      drawer: false,
      isNavigating: false,
      isLoginPending: false,
      isAuth: false,
      avatar: '',
      picture: 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
      items: [
        { title: 'Inicio', link: '/inicio', icon: 'mdi-home' },
        { title: 'Perfil', link: '/perfil', icon: 'mdi-account-box' },
        { title: 'Fincas', link: '/finca', icon: 'mdi-sprout' },
        { title: 'Alertas', link: '/alerta', icon: 'mdi-alert' },
        { title: 'Notificaciones', link: '/notificacion', icon: 'mdi-bell-alert' },
      ],
    };
  },

  computed: {
    ...mapGetters('app', ['cookieConsentVersion', 'getAvatarUsuario', 'getUser']),
  },

  methods: {
    ...mapActions('app', ['changeLocale', 'changeUser']),
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
    onLogout() {
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .logout()
        .then(
          (result) => {
            this.changeUser(false);
            router.push('/');
          },
          (error) => {
            console.log(error);
          },
        );
    },
    drawerMethod() {
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .userInformation()
        .then((result: Usuario) => {
          if (result.foto) this.picture = result.foto;
          else {
            FactoryAPI.getFactoryAPI('Firebase')
              .getUsuario()
              .userProfileIcon()
              .then((result) => {
                this.picture = result;
              });
          }
        })
        .catch((reason) => {});
      this.drawer = true;
    },
  },

  mounted() {
    this.initProgressBar();
  },

  beforeMount() {
    FactoryAPI.getFactoryAPI('Firebase')
      .getUsuario()
      .userAutenticated()
      .then((user) => {
        if (user) this.changeUser(true);
        else this.changeUser(false);
      });

    FactoryAPI.getFactoryAPI('Firebase')
      .getUsuario()
      .userInformation()
      .then((result: Usuario) => {
        if (result.foto) this.picture = result.foto;
        else {
          FactoryAPI.getFactoryAPI('Firebase')
            .getUsuario()
            .userProfileIcon()
            .then((result) => {
              this.picture = result;
            });
        }
      })
      .catch((reason) => {});
  },
};
</script>

<style >
.rounded-card {
  border-radius: 24px;
}
</style>
