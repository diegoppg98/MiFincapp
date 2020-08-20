<template>
<div >
    <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
      style="z-index: 999999"
    >
      {{ textSnackbar }}
      <v-btn
        text
        @click="snackbar = false"
      >
        Cerrar
      </v-btn>
    </v-snackbar>

 <div v-show="auth">
  <v-card width="400" class="mx-auto mt-5">

<div class="text-center">
      <v-avatar size="100">
     <v-img  
        height="100%"
        :src="icon"
     ></v-img>     
   </v-avatar>
   </div>
   
      <v-card-title class="pb-0">
        <h1>Inicio Sesión</h1>
      </v-card-title>
      <v-card-text>
        <v-form
         ref="form"
         v-model="valid"
         :lazy-validation="lazy">
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
        <v-btn block class="mb-6" color="success" :disabled="!valid" :loading="isLoading" @click="onLoginSubmit">Iniciar Sesion</v-btn>
      </v-card-actions>
       <v-card-actions>
        <v-btn block color="info" @click="registrarUsuario">Registrarse</v-btn>
      </v-card-actions>
       <v-card-actions>
        <v-btn block color="error" @click.stop="dialogPass = true">¿Olvidaste tu contraseña?</v-btn>
      </v-card-actions>
    </v-card>
   </div>
  <div class="loading" v-show="!auth">
    <h2>CARGANDO...</h2>
    <div class="loader"></div> 
  </div>
 
<v-dialog
      v-model="dialogPass"
      max-width="400"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Pedir contraseña</v-card-title>
        <v-card-text>
   <v-form
      class="mx-4 my-4"
      dark
      ref="form"
      v-model="validPass"
      :lazy-validation="lazyPass"
    >
      <v-text-field
        v-model="correoPass"
        :rules="emailRules"
        label="Correo"
        required
      ></v-text-field>
           </v-form> 
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="!validPass"
            color="green darken-1"
            text
            @click="sendPass"
          >
            Pedir contraseña
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts">


import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import VImageInput from 'vuetify-image-input';
import {classMethods} from '../../classMethods';

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
      correoPass: '',      
      contraseña: '',
      showPass: false,
      auth: false,
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
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      dialog: false,
      lazyPass: false,
      validPass: true,
      dialogPass: false,
      icon: '',
    };
  },
  components: { 
  },
  computed: {
  },

  methods: {  
  ...mapActions('app', ['changeUser', 'changeNombreAlerta', 'changeNombreFinca', 'changeAvatarUsuario']),

  onLoginSubmit() {
  this.dialog = false;
       classMethods.getUsuarioMethods().login(this.correo,this.contraseña).then((user) =>{  
         // this.changeUser(true); 
          this.changeAvatarUsuario('');
          router.push({ name: 'inicio' }).catch(err => {}); 
      }, (error) => {
     // FunctionsDatabase.logout();
           this.colorSnackbar = "error";
          this.textSnackbar = error;
          this.snackbar = true;
      });
    },

    async registrarUsuario() {
      router.push('/registrar-usuario').catch(err => {});
    },
    sendPass() { 
      this.dialogPass = false;
      classMethods.getUsuarioMethods().forgetPassword(this.correoPass).then((user) =>{
        this.colorSnackbar = "success";
        this.textSnackbar = 'Correo enviado. Por favor revise su correo';
        this.snackbar = true;
      }, (error) => {
          this.colorSnackbar = "error";
          this.textSnackbar = 'Datos incorrectos. Por favor revise los datos introducidos e intentelo otra vez';
          this.snackbar = true;
      });
    },
    
   
  },
 created(){
  },

 beforeMount(){
 classMethods.getUsuarioMethods().appIcon().then((result) =>{
    this.icon = result;
 }); 
 
     classMethods.getUsuarioMethods().userAutenticated().then((user) =>{    
	if(user){
	  router.push('/inicio');
	}
	else this.auth = true;
    });
 },
      
};
</script>

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
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

