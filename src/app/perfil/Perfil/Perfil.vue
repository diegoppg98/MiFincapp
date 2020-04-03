<template>
  <div  >
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
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/example/dashboard'>
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
        label="Correo"
        disabled
        required
      ></v-text-field>

      <v-text-field
        v-model="nombre"
        label="Nombre (opcional)"
      ></v-text-field>

      <v-text-field
        v-model="foto"
        label="Foto (opcional)"
      ></v-text-field>

      <v-text-field
        v-model="direccion"
        label="Direcccion (opcional)"
      ></v-text-field>

      <v-text-field
        v-model="telefono"
        label="Telefono (opcional)"
      ></v-text-field>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="onSubmit"
      >
        Guardar
      </v-btn>

      <v-btn
        color="error"
        class="mr-4"
        @click.stop="dialog = true"
      >
        Eliminar cuenta
      </v-btn>
<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmacion de eliminacion</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar la cuenta, este procesos será irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="eliminarUsuario"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    </v-form> 
  </v-app>
 </div>
</template>

<script lang="ts">

import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
   
export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },

  metaInfo:   {
    title: 'Perfil',
  },
  components: {
  },
  
data: () => ({
      correo: '',
      nombre: '',
      foto: '',
      direccion: '',
      telefono: '',
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      lazy: false,
      dialog: false,
    }),
 
  methods: {
    ...mapActions('auth', ['createToken', 'revokeToken']),
    onSubmit() {
    
       var userCorreo = this.correo;
       var userContraseña = this.contraseña;
       var userNombre = this.nombre;
       var userFoto = this.foto;
       var userDireccion = this.direccion;
       var userTelefono = this.telefono;

       FunctionsDatabase.updateUser(userCorreo,userContraseña,userNombre,userFoto,userDireccion,userTelefono);
       this.colorSnackbar = "success";
       this.textSnackbar = 'Perfil actualizado correctamente';
       this.snackbar = true;


    },
    async eliminarUsuario() {
      FunctionsDatabase.deleteUser(); 
      await this.revokeToken();
      router.push('/');
    },
  },

  beforeMount () {
     FunctionsDatabase.userInformation().then((result) =>{
        this.correo = result.correo[0];
        this.nombre = result.nombre[0];
        this.foto = result.foto[0];
        this.direccion = result.direccion[0];
        this.telefono = result.telefono[0];
   });  
  },

};
</script>

<style lang="scss" module>
</style>
