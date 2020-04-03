<template>
<<<<<<< HEAD
<div >
  <v-app >
  <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
    >
      {{ textSnackbar }}
      <v-btn
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

<v-row class="d-flex flex-column mb-6" justify="center" align="center">
 <v-avatar color="indigo" >
      <v-icon dark>mdi-account-circle</v-icon>
    </v-avatar>
<br/>
<v-btn @click="registrarUsuario" color="error">
      Registrarse
    </v-btn>
<br/>
    <v-btn
      color="primary"
      dark
      @click.stop="dialog = true"
    >
      Iniciar Sesion
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="330"
    >
<v-card>
 <v-card-title class="headline">Inicio sesion</v-card-title>
<v-card-text>
          Introduce tus datos
        </v-card-text>
<v-card-actions>

<v-form
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
    >
     <v-text-field
        v-model="correo"
        :rules="emailRules"
        label="Correo"
        required
      ></v-text-field>

      <v-text-field
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passRules"
        :type="showPass ? 'text' : 'password'"
        name="input-10-2"
        label="Contraseña"
        hint="Al menos 8 caracteres"
        v-model="contraseña"
        class="input-group--focused"
        @click:append="showPass = !showPass"
        required
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        :loading="isLoading"
        color="success"
        class="mr-4"
        @click="onLoginSubmit"
      >
        Iniciar sesion
      </v-btn>
    </v-form> 
</v-card-actions>
  </v-card>
    </v-dialog>
  </v-row>

 </v-app>
=======
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
>>>>>>> origin/master
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD

import { mapState, mapActions, mapGetters } from 'vuex';
import { IState } from '@/app/state';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======
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
>>>>>>> origin/master

export default {
  metaInfo: {
    title: 'MiFincApp',
    meta: [
      {
        name: 'description',
        content:
          'App for control irrigation',
      },
<<<<<<< HEAD
=======

>>>>>>> origin/master
    ],
  },
  data(): any {
    return {
<<<<<<< HEAD
      correo: '',
      contraseña: '',
      showPass: false,
      valid: true,
      passRules: [
        v => !!v || 'Contraseña no puede ser vacía',
        v => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      lazy: false,
      isLoading: false,
      showLoginModal: false,
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      dialog: false,
    };
  },
  components: { 
  },
  computed: {
=======
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
>>>>>>> origin/master
    ...mapGetters('auth', ['isAuthenticated']),
  },

  methods: {
    ...mapActions('auth', ['createToken', 'revokeToken']),
<<<<<<< HEAD
    async onLoginSubmit() {
      this.dialog = false;

      FunctionsDatabase.login(this.correo,this.contraseña).then( async (user) =>{
          try {
            await this.createToken(this.correo,this.contraseña);
            router.push({ name: 'dashboard' });
          } catch (e) {
              this.colorSnackbar = "error";
              this.textSnackbar = 'Error al intertar iniciar sesion. Por favor intentelo otra vez';
              this.snackbar = true;
              console.log(error);
          }
      }, (error) => {
          this.colorSnackbar = "error";
          this.textSnackbar = 'Datos incorrectos. Por favor revise los datos introducidos e intentelo otra vez';
          this.snackbar = true;
          console.log(error);
      });
=======
    async onLoginSubmit(formData: any) {
      try {
        await this.createToken(formData);

        router.push({ name: 'dashboard' });
      } catch (e) {
        addNotification({ title: 'Error during login', text: 'Please try again!' });
      }

      this.showLoginModal = false;
>>>>>>> origin/master
    },
    async registrarUsuario() {
      router.push('/registrar-usuario');
    },
  },
};
</script>
<<<<<<< HEAD
<style>
=======
<style lang="scss" module>
@import "~@/app/shared/design-system";

.home {
  margin-top: $nav-bar-height;
  min-height: 500px;
  display: flex;
  justify-content: top-center;
  align-items: top-center;
}

>>>>>>> origin/master
</style>

