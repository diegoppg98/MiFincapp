<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
      style="z-index: 999999"
    >
      {{ textSnackbar }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
          <h1 class="mx-1 my-1 text-center">Registro</h1>
          <v-form class="mx-10 my-1" dark ref="form" v-model="valid" :lazy-validation="lazy">
            <v-text-field v-model="correo" :rules="emailRules" label="Correo" required clearable></v-text-field>
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
              clearable
            ></v-text-field>
            <v-text-field
              :append-icon="showPassRepeat ? 'mdi-eye' : 'mdi-eye-off'"
              :error-messages="passMatchError"
              :type="showPassRepeat ? 'text' : 'password'"
              name="input-10-2"
              label="Repite contraseña"
              hint="Al menos 8 caracteres"
              v-model="contraseñaRepetida"
              class="input-group--focused"
              @click:append="showPassRepeat = !showPassRepeat"
              required
              clearable
            ></v-text-field>

            <v-text-field v-model="nombre" label="Nombre (opcional)" clearable></v-text-field>

            <v-text-field v-model="direccion" label="Direccion (opcional)" clearable></v-text-field>

            <v-text-field v-model="telefono" label="Telefono (opcional)" clearable></v-text-field>

            <v-btn
              :disabled="!valid"
              :loading="isLoading"
              color="#2e7d32"
              class="mr-4 white--text"
              @click="dialog = true"
            >Registrarse</v-btn>
                       
          </v-form>
                
        </v-col>
      </v-row>
    </v-container>
    
     <v-dialog v-model="dialog" max-width="290" style="z-index: 999999">
            <v-card>
              <v-card-title class="headline">Confirmación registro</v-card-title>

              <v-card-text>Después de registrarse se enviará un correo para verificar la veracidad del correo.</v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#2e7d32" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="#7d2f2e" text @click="onSubmit">Aceptar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  </div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { Usuario } from '../../Clases/Usuario';
import { FactoryAPI } from '../../FactoryAPI';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo: {
    title: 'RegistrarUsuario',
  },
  components: {},
  data(): any {
    return {
      correo: '',
      contraseña: '',
      contraseñaRepetida: '',
      nombre: '',
      foto: '',
      direccion: '',
      telefono: '',
      showPass: false,
      showPassRepeat: false,
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 8000,
      dialog: false,
      valid: true,
      passRules: [
        (v) => !!v || 'Contraseña no puede ser vacía',
        (v) => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
      ],
      passRepeatRules: [
        (v) => !!v || 'Contraseña no puede ser vacía',
        (v) => v === this.contraseña || 'Las contraseñas no coinciden',
      ],
      emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+/.test(v) || 'E-mail must be valid'],
      lazy: false,
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      this.dialog = false;
      var userCorreo = this.correo;
      var userContraseña = this.contraseña;
      var userNombre = this.nombre;
      var userFoto = this.foto;
      var userDireccion = this.direccion;
      var userTelefono = this.telefono;
      var usuario = new Usuario('', userCorreo, userNombre, userDireccion, userFoto);

      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .createUser(usuario, userContraseña)
        .then(
          (user) => {
            this.colorSnackbar = 'success';
            this.textSnackbar = 'Usuario creado correctamente. Por favor acceda a su correo para verificar la cuenta';
            this.snackbar = true;
            router.push('/');
          },
          (error) => {
            this.colorSnackbar = 'error';
            this.textSnackbar = 'Error al intertar registrarse. Comprueba que este usuario no tenga ya una cuenta';
            this.snackbar = true;
            console.log(error);
          },
        );
      this.isLoading = false;
    },
  },
  computed: {
    passMatchError() {
      return this.contraseña === this.contraseñaRepetida ? '' : 'Contraseñas deben coincidir';
    },
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
  beforeMount() {},
};
</script>

<style>

</style>
