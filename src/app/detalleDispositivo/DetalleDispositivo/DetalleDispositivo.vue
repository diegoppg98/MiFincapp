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
        disabled
        label="Nombre"
        required
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
        style="z-index: 2000"
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
<v-card-actions class="justify-center">
  <v-btn @click.stop="dialog = true" color="error">
    Eliminar dispositivo
  </v-btn>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmacion de eliminacion</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar el dispositivo, este procesos será irreversible.
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
            @click="eliminarDispositivo"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-card-actions>
  </v-app>

 </div> 
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======
 <div :class="$style.detalleDispositivo" id="dispositivo">
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
          <vue-headline level="1">DetalleDispositivo</vue-headline>
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
      :disabled="nameDisabled"
    />

    <vue-select
      placeholder="Elige el tipo de dispositivo"
      name="tipo"
      id="tipo"
      v-model="form.tipo"
      :options="tiposDispositivos"
      validation="required"
      required
      :disabled="addressDisabled"
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
  <vue-grid :class="$style.detalleDispositivoBoton">
      <vue-button color="primary" @click="eliminarDispositivo"> Eliminar Dispositivo </vue-button>
  </vue-grid>

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

//import { DetalleDispositivoModule } from '../module';
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
    title: 'DetalleDispositivo',
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
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      dialog: false,
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
      map2: '',
      localizacion: [],
      isLoading: false,
>>>>>>> origin/master
    };
  },
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
      FunctionsDatabase.updateDevice(dispositivoNombre,dispositivoTipo,dispositivoDescripcion,dispositivoLocalizacion,nombreTierra,nombrePivot);
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Dispositivo actualizado correctamente';
          this.snackbar = true;
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

         FunctionsDatabase.updateDevice(dispositivoNombre,dispositivoTipo,dispositivoDescripcion,dispositivoLocalizacion,nombreTierra,nombrePivot);
         addNotification({ title: 'Dispositivo actualizado correctamente', text: 'Dispositivo actualizado correctamente' });
>>>>>>> origin/master
         this.isLoading = false;
       }
    },
    async eliminarDispositivo() {
<<<<<<< HEAD
      this.dialog = false;
       var dispositivoNombre = this.nombre;
       var nombrePivot = this.getNombrePivot;
       var nombreTierra = this.getNombreFinca;
       FunctionsDatabase.deleteDevice(dispositivoNombre,nombreTierra,nombrePivot); 
=======
       var dispositivoNombre = this.form.nombre;
       var nombrePivot = localStorage.namePivot;
       var nombreTierra = localStorage.nameFinca;
       FunctionsDatabase.deleteDevice(dispositivoNombre,nombreTierra,nombrePivot); 
        addNotification({ title: 'Dsipositivo eliminado correctamente', text: 'Dsipositivo eliminado correctamente' });
      router.push('/detalle-pivot');
    },
    async toBack() {
>>>>>>> origin/master
      router.push('/detalle-pivot');
    },
  },
  computed: {
<<<<<<< HEAD
    ...mapGetters('app', [ 'getNombreFinca', 'getNombrePivot', 'getNombreDispositivo']),
=======
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.DetalleDispositivo' /* DetalleDispositivo */), href: '/detalle-dispositivo' },
      ];
    },
    nameDisabled() {
      return 1;
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (this.form.nombre === '' || this.form.localizacion === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
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
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: false,
     drawCircle: false,
     drawPolyline: true,
     deleteLayer: true,
     editeModel: false,
     dragMode: true,
     cutPolygon: false,
   });
},
<<<<<<< HEAD

beforeMount() {
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
=======
 /* beforeCreate() {
    registerModule('detalleDispositivo', DetalleDispositivoModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('detalleDispositivo', DetalleDispositivoModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchDetalleDispositivo', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
    //return Promise.resolve();
  //},
beforeMount() {
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
<<<<<<< HEAD
     FunctionsDatabase.deviceInformation(this.getNombreFinca, this.getNombrePivot, this.getNombreDispositivo).then((result) =>{
        if(result === null) router.push('/finca');
        this.nombre = result.nombre[0];
        this.tipo = result.tipo[0];
=======
     FunctionsDatabase.deviceInformation(localStorage.nameFinca, localStorage.namePivot, localStorage.nameDispositivo).then((result) =>{
        if(result === null) router.push('/finca');
        this.form.nombre = result.nombre[0];
        this.form.tipo = result.tipo[0];
>>>>>>> origin/master
        this.localizacion = result.localizacion[0];
  
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
<<<<<<< HEAD
        this.descripcion = result.descripcion[0];
   });
=======
        this.form.descripcion = result.descripcion[0];
   });
     /*FunctionsDatabase.listDevices(localStorage.nameFinca, localStorage.namePivot).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          console.log(childResult);console.log(localStorage.nameFinca);
          var dispositivo = childResult.nombre[0];
      //  var element ='<input type="button" value="'+ finca + '" onclick="mostrarFinca()">';
      //  document.getElementById("finca").innerHTML +=element;
           var body = document.getElementById("dispositivo");
           var button = document.createElement("button");
           button.innerHTML = dispositivo;
           body.appendChild(button);
           button.addEventListener ("click", function() {
               localStorage.nameDispositivo = dispositivo;               
               router.push('/detalle-dispositivo');
           })
       })
     }
   });*/
>>>>>>> origin/master
},
};
</script>

<<<<<<< HEAD
<style >
=======
<style lang="scss" module>
@import "~@/app/shared/design-system";

.detalleDispositivo {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
.detalleDispositivoBoton {
   display: inline;
   margin-left:25%;
   position:absolute; 
   left:10px;
   top: 500px;
}
.form {
   margin-right:60%;
 }
.map{
    width: 50%; 
    height: 380px; 
    position: absolute;
    left: 580px;
    top: 180px;
}
>>>>>>> origin/master
</style>
