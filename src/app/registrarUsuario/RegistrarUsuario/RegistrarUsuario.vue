<template>
  <div :class="$style.registrarUsuario" >
    <br />
  <vue-grid>
      <vue-button color="primary" @click="toBack">
        <-
      </vue-button>
  </vue-grid>
    <form @submit.prevent="onSubmit">
    <br />
     <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">RegistroUsuario</vue-headline>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>

    <br />
    <br />
     <vue-input
      id="correo"
      name="correo"
      autofocus
      placeholder="Correo"
      required
      validation="required|email"
      error-message="Correo no valido"
      v-model="form.correo"
    />

    <vue-input
      id="contraseña"
      name="contraseña"
      type="password"
      placeholder="Contraseña"
      required
      validation="required|min:6"
      error-message="La contraseña debe tener al menos seis caracteres"
      v-model="form.contraseña"
    />
    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="nombre"
          id="nombre"
          placeholder="Nombre"
          v-model="form.nombre"
        />
      </vue-grid-item> 
      <vue-grid-item>
        <vue-input
          name="foto"
          id="foto"
          placeholder="Foto"
          v-model="form.foto"
        />
      </vue-grid-item>
    </vue-grid-row>


    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="direccion"
          id="direccion"
          placeholder="Direccion"
          v-model="form.direccion"
        />
      </vue-grid-item>
      <vue-grid-item>
        <vue-input
          name="telefono"
          id="telefono"
          placeholder="Telefono"
          validation="integer|min:9"
          error-message="El telefono deben ser al menos nueve numeros"
          v-model="form.telefono"
        />
      </vue-grid-item>
    </vue-grid-row>


    <br />
    <vue-button color="primary" :disabled="isSubmitDisabled" :loading="isLoading"> Save </vue-button>
  </form>
    <br />
 </div>
</template>

<script lang="ts">
//import { registerModule } from '@/app/store';
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


import {router} from '../../router';

//import { RegistrarUsuarioModule } from '../module';

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
        contraseña: '',
        nombre: '',
        foto: '',
        direccion: '',
	telefono: '',
      },

      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      // tslint:disable-next-line
      console.log(JSON.parse(JSON.stringify(this.form)));    
       
       var userCorreo = this.form.correo;
       var userContraseña = this.form.contraseña;
       var userNombre = this.form.nombre;
       var userFoto = this.form.foto;
       var userDireccion = this.form.direccion;
       var userTelefono = this.form.telefono;

      FunctionsDatabase.createUser(userCorreo,userContraseña,userNombre,userFoto,userDireccion,userTelefono).then((user) => {
        addNotification({ title: 'Usuario creado correctamente', text: 'Usuario creado correctamente' });
        router.push('/');
      },(error) => { 
        addNotification({ title: 'Error al intertar registrarse', text: 'Comprueba que este usuario no tenga ya una cuenta' }); 
        console.log(error);});     

      this.isLoading = false;
    },
    async toBack() {
      router.push('/');
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.RegistrarUsuario' /* RegistrarUsuario */), href: '/registrar-usuario' },
      ];
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (this.form.correo === '' || this.form.contraseña === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;;
    },
  },
 /* beforeCreate() {
    registerModule('registrarUsuario', RegistrarUsuarioModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('registrarUsuario', RegistrarUsuarioModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchRegistrarUsuario', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
  //  return Promise.resolve();
  //},
};
</script>

<style lang="scss" module>
@import "~@/app/shared/design-system";

.registrarUsuario {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
</style>
