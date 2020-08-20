<template>
  <div>
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
        Close
      </v-btn>
    </v-snackbar>
    
<v-card width="220" height="200" class="mx-auto mt-5 d-flex align-center" @click.native="pickFile()">
  <img :src="imageUrl" width="100%" height="100%" v-if="imageUrl"/>
 
   <input
	type="file"
	style="display: none"
	ref="image"
	accept="image/*"
	@change="onFilePicked"
   >
 </v-card>

   <v-form
      class="mx-10 my-1"
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
        v-model="direccion"
        label="Direcccion (opcional)"
      ></v-text-field>

     <v-row justify="end">
      <v-btn
        :disabled="!valid"
        color="success"
        class="d-block my-2"
        @click="onSubmit"
      >
        Guardar 
      </v-btn>
       </v-row>

      <v-layout justify-center>
       <v-btn
        color="info"
        class="d-block my-2"
        @click.stop="dialogPass = true"
      >
        Cambiar contraseña
      </v-btn>
      </v-layout>

     <v-layout justify-start>
      <v-btn
        color="error"
        class="d-block my-2"
        @click.stop="dialog = true"
      >
        Eliminar cuenta
      </v-btn>
      </v-layout>


<v-dialog
      v-model="dialog"
      max-width="450"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>

        <v-card-text>
          Esta seguro de que desea eliminar la cuenta, este procesos será irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="success"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="error"
            text
            @click="eliminarUsuario"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<v-dialog
      v-model="dialogPass"
      max-width="400"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Cambio de contraseña</v-card-title>
        <v-card-text>
   <v-form
      class="mx-4 my-4"
      dark
      ref="form"
      v-model="validPass"
      :lazy-validation="lazyPass"
    >
              <v-text-field
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passRules"
                :type="showPass ? 'text' : 'password'"
                name="input-10-2"
                label="Introduzca contraseña actual"
                hint="Al menos 8 caracteres"
                v-model="contraseña"
                class="input-group--focused"
                @click:append="showPass = !showPass"
                required
                clearable
              ></v-text-field>
              <v-text-field
                :append-icon="showPassNew ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passRules"
                :type="showPassNew ? 'text' : 'password'"
                name="input-10-2"
                label="Introduzca nueva contraseña"
                hint="Al menos 8 caracteres"
                v-model="contraseñaNew"
                class="input-group--focused"
                @click:append="showPassNew = !showPassNew"
                required
                clearable
              ></v-text-field>
              <v-text-field
                :append-icon="showPassRepeat ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages='passMatchError'
                :type="showPassRepeat ? 'text' : 'password'"
                name="input-10-2"
                label="Repita nueva contraseña"
                hint="Al menos 8 caracteres"
                v-model="contraseñaRepetida"
                class="input-group--focused"
                @click:append="showPassRepeat = !showPassRepeat"
                required
                clearable
              ></v-text-field>
           </v-form> 
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="!validPass"
            color="green darken-1"
            text
            @click="changePass"
          >
            Cambiar contraseña
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-form> 
 </div>
</template>

<script lang="ts">

import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {Usuario} from '../../Clases/Usuario';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import VImageInput from 'vuetify-image-input';
import {classMethods} from '../../classMethods';

export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },

  metaInfo:   {
    title: 'Perfil',
  },
  components: {
  [VImageInput.name]: VImageInput,
  },
  
data: () => ({
      correo: '',
      nombre: '',
      foto: '',
      direccion: '',
      imageData:'',
     // telefono: '',
      valid: true,
      picture: '',
      validPass: true,
      rulesFotos: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passRules: [
        v => !!v || 'Contraseña no puede ser vacía',
        v => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
      ],
      contraseña: '',
      contraseñaNew: '',
      contraseñaRepetida: '',
      showPass: false,
      showPassNew:false,
      showPassRepeat:false,
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      lazy: false,
      lazyPass: false,
      dialog: false,
      dialogPass: false,
      componentKey: 0,
      imageName: '',
		imageUrl: '',
		imageFile: '',
    }),

  methods: {
    ...mapActions('app', ['changeUser', 'changeReload']),
    pickFile () {
       this.$refs.image.click ()
    },
		
    onFilePicked (e) {
	const files = e.target.files;
	if(files[0] !== undefined) {
		this.imageName = files[0].name;
		if(this.imageName.lastIndexOf('.') <= 0) {
			return;
		}
		const fr = new FileReader ();
		fr.readAsDataURL(files[0]);
		fr.addEventListener('load', () => {
			this.imageUrl = fr.result;
			this.imageFile = files[0]; // this is an image file that can be sent to server...
		})
		} else {
			this.imageName = '';
			this.imageFile = '';
			this.imageUrl = '';
		}
    },

    async onSubmit() {
       var userCorreo = this.correo;
       var userContraseña = this.contraseña;
       var userNombre = this.nombre;
       var userFoto = this.imageFile;
       var userDireccion = this.direccion;
      // var userTelefono = this.telefono;

       var usuario = new Usuario("",userCorreo, userNombre, userDireccion, userFoto);
       classMethods.getUsuarioMethods().updateUser(usuario).then((result) =>{
   	  this.colorSnackbar = "success";
       this.textSnackbar = 'Perfil actualizado correctamente';
       this.snackbar = true;
          this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al actualizar la Usuario. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  
    },
    changePass() {
      this.dialogPass = false;
      classMethods.getUsuarioMethods().changePassword(this.correo,this.contraseña, this.contraseñaNew).then((user) =>{
               this.colorSnackbar = "success";
               this.textSnackbar = user;
               this.snackbar = true;
      }, (error) => {
               this.colorSnackbar = "error";
               this.textSnackbar = error;
               this.snackbar = true; 
      });
    },

    async eliminarUsuario() {
      classMethods.getUsuarioMethods().deleteUser().then((result) => {
          this.changeUser(false);
          router.push('/');
      },(error) => { 
          console.log(error);
      });  
    },
  },
  computed: {
    ...mapGetters('app', ['getAvatarUsuario']),
    passMatchError () { 
      return (this.contraseñaNew === this.contraseñaRepetida) ? '' : 'Contraseñas deben coincidir'
    },
  },

mounted(){

},

  beforeMount () {
  
  this.changeUser(true); 
 // this.changeReload(false); 
     classMethods.getUsuarioMethods().userInformation().then((result) =>{
        this.correo = result.correo;
        this.nombre = result.nombre;
        this.direccion = result.direccion;
       // this.telefono = result.telefono[0];
       if(result.foto) 
            this.imageUrl = result.foto;
        else{ 
            classMethods.getUsuarioMethods().userProfileIcon().then((result) =>{
               this.picture = result;
            });
        }
       // this.imageUrl = this.getAvatarUsuario;
   });  
  },

};
</script>

<style lang="scss" module>
</style>
