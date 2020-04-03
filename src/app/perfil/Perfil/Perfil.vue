<template>
<<<<<<< HEAD
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
=======
  <div :class="$style.perfil" >
    <form @submit.prevent="onSubmit">
    <br />
    <br />
    <br />
    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="correo"
          id="correo"
          type="email"
          required
          placeholder="correo"
          validation="required|email"
          :disabled="mailDisabled"
          v-model="form.correo"
        />
      </vue-grid-item>
    </vue-grid-row>

    <vue-input
      name="nombre"
      id="nombre"
      placeholder="nombre"
      v-model="form.nombre"
    />

    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="foto"
          id="foto"
          placeholder="foto"
          v-model="form.foto"
        />
      </vue-grid-item>

    </vue-grid-row>

    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="direccion"
          id="direccion"
          placeholder="direccion"
          v-model="form.direccion"
        />
      </vue-grid-item>
       <vue-grid-item>
        <vue-input
          name="telefono"
          id="telefono"
          placeholder="Telefono"
          validation="integer|min:9"
          v-model="form.telefono"
        />
      </vue-grid-item>
    </vue-grid-row>
    <br />
    <vue-button color="primary" :disabled="isSubmitDisabled" :loading="isLoading"> Save </vue-button>      
  </form>
 <vue-button color="primary" @click="eliminarUsuario" :class="$style.perfilBoton"> Eliminar Usuario </vue-button>       
>>>>>>> origin/master
 </div>
</template>

<script lang="ts">
<<<<<<< HEAD

import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
=======
//import { registerModule } from '@/app/store';
import { mapActions, mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';
import VueInput from '@/app/shared/components/VueInput/VueInput.vue';
import VueSelect from '@/app/shared/components/VueSelect/VueSelect.vue';
import { addNotification, INotification } from '@components/VueNotificationStack/utils';
//import { PerfilModule } from '../module';


>>>>>>> origin/master
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
import {router} from '../../router';
<<<<<<< HEAD
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======
>>>>>>> origin/master
   
export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },

  metaInfo:   {
    title: 'Perfil',
  },
  components: {
<<<<<<< HEAD
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
=======
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
    VueInput,
    VueSelect,
  },
  
  data(): any {
    return {
      form: {
        correo: '',
        nombre: '',
        foto: '',
        direccion: '',
        telefono: '',
      },

      isLoading: false,
    };
  },
>>>>>>> origin/master
 
  methods: {
    ...mapActions('auth', ['createToken', 'revokeToken']),
    onSubmit() {
<<<<<<< HEAD
    
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


=======
       var userCorreo = this.form.correo;
       var userContraseña = this.form.contraseña;
       var userNombre = this.form.nombre;
       var userFoto = this.form.foto;
       var userDireccion = this.form.direccion;
       var userTelefono = this.form.telefono;

       FunctionsDatabase.updateUser(userCorreo,userContraseña,userNombre,userFoto,userDireccion,userTelefono);
          setTimeout(() => {
            addNotification({
              title: 'Informacion actualizada correctamente',
              text: 'Informacion actualizada correctamente',
            } as INotification);
          }, 1000);


//https://stackoverflow.com/questions/49546341/retrieving-data-from-realtime-firebase-and-display-in-form-of-table-on-web-page
//http://mariechatfield.com/tutorials/firebase/step5.html
>>>>>>> origin/master
    },
    async eliminarUsuario() {
      FunctionsDatabase.deleteUser(); 
      await this.revokeToken();
      router.push('/');
    },
  },
<<<<<<< HEAD

  beforeMount () {
     FunctionsDatabase.userInformation().then((result) =>{
        this.correo = result.correo[0];
        this.nombre = result.nombre[0];
        this.foto = result.foto[0];
        this.direccion = result.direccion[0];
        this.telefono = result.telefono[0];
   });  
  },

=======
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.Perfil' /* Perfil */), href: '/perfil' },
      ];
    },
    mailDisabled() {
      return 1;
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

     Object.keys(this.form).forEach((key: string) => {
        if (this.form.correo === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
    },

  },

  beforeMount () {
     FunctionsDatabase.userInformation().then((result) =>{
        console.log(result);
        this.form.correo = result.correo[0];
        this.form.nombre = result.nombre[0];
        this.form.foto = result.foto[0];
        this.form.direccion = result.direccion[0];
        this.form.telefono = result.telefono[0];
   });  
     
  /*
     FunctionsDatabase.userMail().then((result) =>{
        console.log(result);
        this.form.correo = result;
   });
     FunctionsDatabase.userName().then((result) =>{
        console.log(result);
        this.form.nombre = result;
   });
     FunctionsDatabase.userPicture().then((result) =>{
        console.log(result);
        this.form.foto = result;
   });
     FunctionsDatabase.userAddress().then((result) =>{
        console.log(result);
        this.form.direccion = result;
   });
     FunctionsDatabase.userPhone().then((result) =>{
        console.log(result);
        this.form.telefono = result;
   });*/


  },
  beforeCreate() {
   // registerModule('perfil', PerfilModule);
  },
  prefetch: (options: IPreLoad) => {
   // registerModule('perfil', PerfilModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchPerfil', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
    //return Promise.resolve();
  },
>>>>>>> origin/master
};
</script>

<style lang="scss" module>
<<<<<<< HEAD
</style>
=======
@import "~@/app/shared/design-system";

.perfil {
  margin-top: $nav-bar-height;
  margin-left:5%;
  min-height: 500px;
  
}
 .perfilBoton{
   display: inline;
   margin-left:15%;
   position:absolute; 
   left:140px;
   top:452px
 }

</style>


>>>>>>> origin/master
