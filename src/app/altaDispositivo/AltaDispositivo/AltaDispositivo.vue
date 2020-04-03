<template>
<<<<<<< HEAD
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
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/detalle-pivot'>
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
        v-model="nombre"
        :rules="nameRules"
        :error="isNameRepeated"
        label="Nombre"
        required
        clearable
      ></v-text-field>

     <v-textarea
         v-model="descripcion"
         clearable
     >
      <template v-slot:label>
        <div>
          Descripcion <small>(opcional)</small>
        </div>
      </template>
     </v-textarea>

      <v-select
        v-model="tipo"
        :items="tiposDispositivos"
        :rules="[v => !!v || 'Tipo de dispositivo es requerido']"
        label="Tipo"
        required
        style="z-index: 999"
      ></v-select>

     <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
      <v-btn
        :disabled="!valid"
        :loading="isLoading"
        color="success"
        class="mr-4"
        @click="onSubmit"
      >
        Guardar
      </v-btn>
    </v-form> 
  </v-app>

 </div> 
=======
  <div :class="$style.altaDispositivo" >
    <br />
  <vue-grid>
      <vue-button color="primary" @click="toBack">
        <-
      </vue-button>
  </vue-grid>
  <div :class="$style.map" ref="mapa" id="mapa"></div>
<form @submit.prevent="onSubmit" :class="$style.form">
    <br />
     <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">AltaDispositivo</vue-headline>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>

    <br />
    <br />
     <vue-input
      id="nombre"
      name="nombre"
      type="text"
      autofocus
      placeholder="Nombre"
      required
      validation="required"
      error-message="Campo obligatorio"
      v-model="form.nombre"
    />
    <vue-select
      placeholder="Elige el tipo de dispositivo"
      name="tipo"
      id="tipo"
      v-model="form.tipo"
      :options="tiposDispositivos"
      validation="required"
      required
    />
    <br />
    <br />
    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="descripcion"
          id="descripcion"
          placeholder="Descripcion"
          v-model="form.descripcion"
        />
      </vue-grid-item> 
    </vue-grid-row>


    <br />
    <vue-button color="primary" :disabled="isSubmitDisabled" :loading="isLoading"> Save </vue-button>
  </form>
    <br />

 </div>
>>>>>>> origin/master
</template>

<script lang="ts">
//import { registerModule } from '@/app/store';
import { IPreLoad } from '@/server/isomorphic';
<<<<<<< HEAD
import { mapGetters } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';
import VueInput from '@/app/shared/components/VueInput/VueInput.vue';
import VueSelect from '@/app/shared/components/VueSelect/VueSelect.vue';
//import { AltaDispositivoModule } from '../module';

import { addNotification, INotification } from '@components/VueNotificationStack/utils';


>>>>>>> origin/master
import {router} from '../../router';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'AltaDispositivo',
  },
  components: {
<<<<<<< HEAD
  },
  data(): any {
    return {
      nombre: '',
      tipo: null,
      descripcion: '',
      select: null,
      tiposDispositivos: [
        'GPS',
        'Temperatura',
      ],
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      valid: true,
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      lazy: false,
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
        nombre: '',
        tipo: '',
        descripcion: '',
      },
      tiposDispositivos: [
        { label: 'GPS', value: 'GPS' },
        { label: 'Temperatura', value: 'Temperatura' },
      ],
>>>>>>> origin/master
      map2: '',
      localizacion: [],
      isNameRepeated: false,
      isLoading: false,
    };
  },
<<<<<<< HEAD
watch: {
   async nombre(val) {
       var result = await this.nameRepeated;
       this.isNameRepeated = result; 
 
       if(this.isNameRepeated){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Nombre de dispositivo ya utilizado. Por favor, pruebe con otro nombre';
          this.snackbar = true;
       }
    }
  },
=======
>>>>>>> origin/master
  methods: {
     onSubmit() {
       this.isLoading = true;

       var dispositivoLocalizacion = [];
        var layers = [];
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
           layers.push(layer); 
        }                      
        })
       this.localizacion = layers;
       this.localizacion.forEach(function(element,index) {
          dispositivoLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
       if(dispositivoLocalizacion.length === 0){
<<<<<<< HEAD
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
          this.isLoading = false;
       }
       else{   
         var nombreTierra = this.getNombreFinca;
         var nombrePivot = this.getNombrePivot;
         var dispositivoNombre = this.nombre;
         var dispositivoTipo = this.tipo;
         var dispositivoDescripcion = this.descripcion;

          FunctionsDatabase.createDevice(dispositivoNombre,dispositivoTipo,dispositivoDescripcion,dispositivoLocalizacion,nombreTierra,nombrePivot);
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Dsipositivo creado correctamente';
          this.snackbar = true;
        // router.push('/detalle-pivot');
         this.nombre = '';
         this.isLoading = false;
       }
    },
  },
  computed: {
    ...mapGetters('app', [ 'getNombreFinca', 'getNombrePivot']),
   
    nameRepeated(){
      var nombre = this.nombre;
      var nombreTierra = this.getNombreFinca;
      var nombrePivot = this.getNombrePivot;
=======
          addNotification({ title: 'Localizacion no marcada', text: 'Por favor seleccione en el mapa la localizacion' });
          this.isLoading = false;
       }
       else{   
         var nombreTierra = localStorage.nameFinca;
         var nombrePivot = localStorage.namePivot;
         var dispositivoNombre = this.form.nombre;
         var dispositivoTipo = this.form.tipo;
         var dispositivoDescripcion = this.form.descripcion;

          FunctionsDatabase.createDevice(dispositivoNombre,dispositivoTipo,dispositivoDescripcion,dispositivoLocalizacion,nombreTierra,nombrePivot);
         addNotification({ title: 'Dispositivo creado correctamente', text: 'Dispositivo creado correctamente' });
        // router.push('/detalle-pivot');
         this.isLoading = false;
       }
    },
    async toBack() {
      router.push('/detalle-pivot');
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.AltaDispositivo' /* AltaDispositivo */), href: '/alta-dispositivo' },
      ];
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (this.form.nombre === '' || this.form.tipo === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    nameRepeated(){
      var nombre = this.form.nombre;
      
      var nombreTierra = localStorage.nameFinca;
      var nombrePivot = localStorage.namePivot;
>>>>>>> origin/master
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.deviceExist(nombreTierra, nombrePivot, nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
<<<<<<< HEAD
=======
            console.log(error.message);
            addNotification({ title: 'Nombre de dispositivo ya utilizado', text: 'Por favor, pruebe con otro nombre' });
>>>>>>> origin/master
            return true;
        })
      }
      return resultado;  
    },
<<<<<<< HEAD
   
=======
    
    async hasNameRepeated(){
       var result = await this.nameRepeated;
       this.isNameRepeated = result;
    },
    isSubmitDisabled() {
      this.hasNameRepeated;
      return this.hasErrors || this.hasEmptyFields|| this.isNameRepeated;
    },
>>>>>>> origin/master
  },
 mounted() {
   const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';

   const mapboxTiles1 = L.tileLayer(
     `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
   {
     attribution:
       '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
   }
   );

   this.map2 = L.map(this.$refs['mapa'])
     .addLayer(mapboxTiles1);

   this.map2.pm.setLang('es');

   this.map2.pm.addControls({
     drawMarker: true,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: false,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     editeModel: false,
     dragMode: true,
     cutPolygon: false,
   });
 },
 beforeMount(){
<<<<<<< HEAD
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
=======
     FunctionsDatabase.landInformation(localStorage.nameFinca).then((result) =>{
>>>>>>> origin/master
        if(result === null) router.push('/finca');
        this.localizacion = result.localizacion[0];
        var map = this.map2;
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
              map.setView([feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]], 13);
           },
        });
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
   });
<<<<<<< HEAD
     FunctionsDatabase.pivotInformation(this.getNombreFinca, this.getNombrePivot).then((result) =>{
=======
     FunctionsDatabase.pivotInformation(localStorage.nameFinca, localStorage.namePivot).then((result) =>{
>>>>>>> origin/master
        if(result === null) router.push('/finca');
        this.localizacion = result.localizacion[0];
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
   });
 },
<<<<<<< HEAD
};
</script>

<style >
=======
 /* beforeCreate() {
    registerModule('altaDispositivo', AltaDispositivoModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('altaDispositivo', AltaDispositivoModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchAltaDispositivo', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
 //   return Promise.resolve();
  //},
};
</script>

<style lang="scss" module>
@import "~@/app/shared/design-system";

.altaDispositivo {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
.form {
   margin-right:60%;
 }
.map{
    width: 50%; 
    height: 380px; 
    position: absolute;
    left: 580px;
    top: 200px;
}
>>>>>>> origin/master
</style>
