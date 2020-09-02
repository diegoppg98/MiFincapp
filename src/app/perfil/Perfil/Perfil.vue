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
        
    <v-card
      width="170"
      shaped class="rounded-card mx-auto mt-5 mt-2 d-flex align-center"
      @click.native="pickFile()"
    >
      <img height="180" :src="imageUrl" width="100%" v-if="imageUrl" />

      <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked" />
    </v-card>

    <v-form class="mx-10 my-3" dark ref="form" v-model="valid" :lazy-validation="lazy">
      <v-text-field v-model="correo" label="Correo" disabled required></v-text-field>

      <v-text-field @change="dataChanged" v-model="nombre" label="Nombre (opcional)"></v-text-field>

      <v-text-field @change="dataChanged" v-model="direccion" label="Direcccion (opcional)"></v-text-field>    

     <v-btn
     
          color="#2e7d32"
          block
          style="width=100%"
          @click.stop="dialogPass = true"
          class="my-1 white--text"
        >Cambiar contraseña</v-btn>

        <v-btn color="#7d2f2e" class="white--text" block @click.stop="dialog = true">Eliminar cuenta</v-btn>

      <v-dialog v-model="dialog" max-width="450" style="z-index: 999">
        <v-card>
          <v-card-title class="headline">Confirmar eliminación</v-card-title>

          <v-card-text>Esta seguro de que desea eliminar la cuenta, este procesos será irreversible.</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="#2e7d32" text @click="dialog = false">Cancelar</v-btn>

            <v-btn color="#7d2f2e" text @click="eliminarUsuario">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogPass" max-width="400" style="z-index: 999">
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
                :error-messages="passMatchError"
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
            >Cambiar contraseña</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
    
     </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';
import { IPreLoad } from '@/server/isomorphic';
import { Usuario } from '../../Clases/Usuario';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import VImageInput from 'vuetify-image-input';
import { FactoryAPI } from '../../FactoryAPI';
//<v-icon>mdi-plus</v-icon>
export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },

  metaInfo: {
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
    imageData: '',
    // telefono: '',
    valid: true,
    picture: '',
    validPass: true,
    rulesFotos: [(value) => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!'],
    emailRules: [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'],
    passRules: [
      (v) => !!v || 'Contraseña no puede ser vacía',
      (v) => (v && v.length >= 8) || 'Contraseña debe tener al menos 8 caracteres',
    ],
    contraseña: '',
    contraseñaNew: '',
    contraseñaRepetida: '',
    showPass: false,
    showPassNew: false,
    showPassRepeat: false,
    colorSnackbar: '',
    snackbar: false,
    textSnackbar: '',
    timeoutSnackbar: 4000,
    lazy: false,
    lazyPass: false,
    dialog: false,
    dialogPass: false,
    dialogOptions: false,
    componentKey: 0,
    imageName: '',
    imageUrl: '',
    imageFile: '',
  }),

  methods: {
    ...mapActions('app', ['changeUser', 'changeReload']),
    pickFile() {
      this.$refs.image.click();
    },
    async dataChanged(){
      var userCorreo = this.correo;
      var userNombre = this.nombre;
      var userFoto = this.imageUrl;
      var userDireccion = this.direccion;

      var usuario = new Usuario('', this.correo, this.nombre, this.direccion, userFoto);
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .updateUser(usuario)
        .then((result) => {
       
        })
        .catch((error) => {
         
        });
    },

    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf('.') <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener('load', () => {
          //this.imageUrl = fr.result;
          var t = this;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
          var userFoto = this.imageFile;
          var usuario = new Usuario('', this.correo, this.nombre, this.direccion, userFoto);
          FactoryAPI.getFactoryAPI('Firebase')
           .getUsuario()
           .updateUserImage(usuario)
           .then((result) => {  
             t.imageUrl = result;
           })
           .catch((error) => {         
           });
        });
       
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
      var userFoto = this.imageUrl;
      var userDireccion = this.direccion;
      // var userTelefono = this.telefono;

      var usuario = new Usuario('', userCorreo, userNombre, userDireccion, userFoto);
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .updateUser(usuario)
        .then((result) => {
          this.colorSnackbar = 'success';
          this.textSnackbar = 'Perfil actualizado correctamente';
          this.snackbar = true;
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al actualizar la Usuario. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },
    changePass() {
      this.dialogPass = false;
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .changePassword(this.correo, this.contraseña, this.contraseñaNew)
        .then(
          (user) => {
            this.colorSnackbar = 'success';
            this.textSnackbar = user;
            this.snackbar = true;
          },
          (error) => {
            this.colorSnackbar = 'error';
            this.textSnackbar = error;
            this.snackbar = true;
          },
        );
    },

    async eliminarUsuario() {
      FactoryAPI.getFactoryAPI('Firebase')
        .getUsuario()
        .deleteUser()
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
  },
  computed: {
    ...mapGetters('app', ['getAvatarUsuario']),
    passMatchError() {
      return this.contraseñaNew === this.contraseñaRepetida ? '' : 'Contraseñas deben coincidir';
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

  mounted() {},

  beforeMount() {
 
//https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FmarkerDevice.png?alt=media&token=88ede691-a2a8-40ef-8a88-05cd62eef8bd
/*  const ref = firebase.storage().ref('Images');
                   var pictureRef = ref.child('markerDevice.png');
                   pictureRef.getDownloadURL().then(function(url) {
                    console.log(url); 
                   });*/
  //
/*  firebase.firestore().collection(ruta).add({medida: ["1","2"], id: id,chequeada: false, notificada: false})
        .then(function(docRef) {
         console.log("1");
        })
        .catch(function(error) {
         console.log("2");
        });*/
  
    this.changeUser(true);
    // this.changeReload(false);
    FactoryAPI.getFactoryAPI('Firebase')
      .getUsuario()
      .userInformation()
      .then((result: Usuario) => {
        this.correo = result.correo;
        this.nombre = result.nombre;
        this.direccion = result.direccion;
        // this.telefono = result.telefono[0];
        if (result.foto) this.imageUrl = result.foto;
        else {
          FactoryAPI.getFactoryAPI('Firebase')
            .getUsuario()
            .userProfileIcon()
            .then((result) => {
              this.imageUrl = result;
            });
        }
        // this.imageUrl = this.getAvatarUsuario;
      });
  },
};
</script>

<style lang="scss" module>
.rounded-card {
  border-radius: 40px;
}
</style>
