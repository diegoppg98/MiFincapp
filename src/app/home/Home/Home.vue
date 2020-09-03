<template>
  <div
    id="divHome"
    class="grid-block"
    style="background-image: url('https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FPivot.jpeg?alt=media&token=4215cb1b-6ce4-4be9-833a-2d10f706512d'); width: 100%; height: 100vh; "
  >
    <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
      style="z-index: 999999"
    >
      {{ textSnackbar }}
      <v-btn text @click="snackbar = false">Cerrar</v-btn>
    </v-snackbar>
    <div v-show="auth">
      <v-container>
        <v-row align="center" justify="center">
          <v-col :cols="posMap">
            <v-card>
              <div class="text-center pt-10">
                <v-avatar size="100">
                  <v-img
                    height="100%"
                    src="https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FMiFincappIcon.png?alt=media&token=c284a7d6-50bd-4046-8796-5ce7b45c2e3d"
                  ></v-img>
                </v-avatar>
              </div>
              <v-card-text>
                <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                  <v-text-field
                    v-model="correo"
                    :rules="emailRules"
                    label="Correo"
                    required
                    prepend-icon="mdi-account-circle"
                  />
                  <v-text-field
                    :rules="passRules"
                    :type="showPass ? 'text' : 'password'"
                    label="Contraseña"
                    hint="Al menos 8 caracteres"
                    prepend-icon="mdi-lock"
                    v-model="contraseña"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPass = !showPass"
                    required
                  />
                </v-form>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  block
                  class="white--text"
                  color="#2e7d32"
                  :disabled="!valid"
                  :loading="isLoading"
                  @click="onLoginSubmit"
                >Iniciar Sesion</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn
                  class="white--text"
                  block
                  color="#2e7d32"
                  @click="registrarUsuario"
                >Registrarse</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn
                  class="white--text"
                  block
                  color="#7d2f2e"
                  @click.stop="dialogPass = true"
                >¿Olvidaste tu contraseña?</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="padre">
      <div class="loading" v-show="!auth">
        <v-container>
          <v-row align="center" justify="center">
            <v-col :cols="posMap">
              <loading
                :active.sync="active"
                :is-full-page="fullPage"
                color="#2e7d32"
                background-color="#2e7d32"
                :height="height"
                :width="width"
              ></loading>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
    <v-dialog v-model="dialogPass" max-width="400" style="z-index: 999">
      <v-card>
        <v-card-title class="headline">Pedir contraseña</v-card-title>
        <v-card-text>
          <v-form class="mx-4 my-4" dark ref="form" v-model="validPass" :lazy-validation="lazyPass">
            <v-text-field v-model="correoPass" :rules="emailRules" label="Correo" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!validPass"
            color="green darken-1"
            text
            @click="sendPass"
          >Pedir contraseña</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import VImageInput from 'vuetify-image-input';
import { FactoryAPI } from '../../FactoryAPI';

import Loading from 'vue-loading-overlay';

export default {
  metaInfo: {
    title: 'MiFincApp',
    meta: [
      {
        name: 'description',
        content: 'App for control irrigation',
      },
    ],
  },
  data(): any {
    return {
      correo: '',
      active: true,
      fullPage: true,
      width: 128,
      height: 128,
      correoPass: '',
      contraseña: '',
      showPass: false,
      auth: false,
      valid: true,
      passRules: [
        (v) => !!v || 'Contraseña no puede ser vacía',
        (v) => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
      ],
      emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+/.test(v) || 'E-mail must be valid'],
      lazy: false,
      isLoading: false,
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      dialog: false,
      lazyPass: false,
      validPass: true,
      dialogPass: false,
    };
  },
  components: {
    Loading,
  },
  computed: {
    posMap() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12';
        case 'sm':
          return '12';
        case 'md':
          return '6';
        case 'lg':
          return '6';
        case 'xl':
          return '6';
      }
    },
  },

  methods: {
    ...mapActions('app', ['changeUser', 'changeNombreAlerta', 'changeNombreFinca', 'changeAvatarUsuario']),

    onLoginSubmit() {
      this.dialog = false;
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .login(this.correo, this.contraseña)
        .then(
          (user) => {
            this.changeAvatarUsuario('');
            router.push({ name: 'inicio' }).catch((err) => {});
          },
          (error) => {
            this.colorSnackbar = 'error';
            this.textSnackbar = error;
            this.snackbar = true;
          },
        );
    },

    async registrarUsuario() {
      router.push('/registrar-usuario').catch((err) => {});
    },
    sendPass() {
      this.dialogPass = false;
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .forgetPassword(this.correoPass)
        .then(
          (user) => {
            this.colorSnackbar = 'success';
            this.textSnackbar = 'Correo enviado. Por favor revise su correo';
            this.snackbar = true;
          },
          (error) => {
            this.colorSnackbar = 'error';
            this.textSnackbar = 'Datos incorrectos. Por favor revise los datos introducidos e intentelo otra vez';
            this.snackbar = true;
          },
        );
    },
  },
  created() {},

  mounted() {},
  beforeMount() {
    FactoryAPI.getFactoryAPI('Firebase')
      .getUsuario()
      .userAutenticated()
      .then((user) => {
        if (user) {
          router.push('/inicio');
        } else this.auth = true;
      });
  },
};
</script>


.vld-shown {
  overflow: hidden;
}

.vld-overlay {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  align-items: center;
  display: none;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
}

.vld-overlay.is-active {
  display: flex;
}

.vld-overlay.is-full-page {
  z-index: 9999;
  position: fixed;
}

.vld-overlay .vld-background {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  background: #fff;
  opacity: 0.5;
}

.vld-overlay .vld-icon, .vld-parent {
  position: relative;
}


<style>
.loading {
  text-align: center;
}

.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  display: inline-block;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

html,
body {
  height: 100%;
}

#divHome {
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>

