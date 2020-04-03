<template>
<div>
  <v-app>
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
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/home'>
        <v-icon dark left>mdi-arrow-left</v-icon>
   </v-btn>
   <v-form
      class="mx-10 my-12"
      dark
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
    >
     <v-text-field
        v-model="correo"
        :rules="emailRules"
        label="Correo"
        required
        clearable
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
        clearable
      ></v-text-field>

      <v-text-field
        :append-icon="showPassRepeat ? 'mdi-eye' : 'mdi-eye-off'"
        :error-messages='passMatchError'
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

      <v-text-field
        v-model="nombre"
        label="Nombre (opcional)"
        clearable
      ></v-text-field>

      <v-text-field
        v-model="foto"
        label="Foto (opcional)"
        clearable
      ></v-text-field>

      <v-text-field
        v-model="direccion"
        label="Direccion (opcional)"
        clearable
      ></v-text-field>

      <v-text-field
        v-model="telefono"
        label="Telefono (opcional)"
        clearable
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        :loading="isLoading"
        color="success"
        class="mr-4"
        @click="onSubmit"
      >
        Registrarse
      </v-btn>
    </v-form> 
  </v-app>
 </div > 
</template>

<script lang="ts">

import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {

  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'RegistrarUsuario',
  },
  components: {
  },
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
      showPassRepeat:false,
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      valid: true,
      passRules: [
        v => !!v || 'Contraseña no puede ser vacía',
        v => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
      ],
      passRepeatRules: [
        v => !!v || 'Contraseña no puede ser vacía',
        v => v===this.contraseña || 'Las contraseñas no coinciden',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      lazy: false,
      isLoading: false,
    };
  },
  methods: {

    onSubmit() {
       this.isLoading = true;  
       
       var userCorreo = this.correo;
       var userContraseña = this.contraseña;
       var userNombre = this.nombre;
       var userFoto = this.foto;
       var userDireccion = this.direccion;
       var userTelefono = this.telefono;

      FunctionsDatabase.createUser(userCorreo,userContraseña,userNombre,userFoto,userDireccion,userTelefono).then((user) => {
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Usuario creado correctamente';
          this.snackbar = true;
          router.push('/');
      },(error) => { 
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Error al intertar registrarse. Comprueba que este usuario no tenga ya una cuenta';
          this.snackbar = true;
          console.log(error);});     
      this.isLoading = false;
    },
  },
  computed: {
    passMatchError () { 
      return (this.contraseña === this.contraseñaRepetida) ? '' : 'Contraseñas deben coincidir'
    },
  },

};
</script>

<style>
</style>
