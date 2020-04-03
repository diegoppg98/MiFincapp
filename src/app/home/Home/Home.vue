<template>
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
  </div>
</template>

<script lang="ts">

import { mapState, mapActions, mapGetters } from 'vuex';
import { IState } from '@/app/state';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';

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
    ...mapGetters('auth', ['isAuthenticated']),
  },

  methods: {
    ...mapActions('auth', ['createToken', 'revokeToken']),
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
    },
    async registrarUsuario() {
      router.push('/registrar-usuario');
    },
  },
};
</script>
<style>
</style>

