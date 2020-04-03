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
         this.isLoading = false;
       }
    },
    async eliminarDispositivo() {
      this.dialog = false;
       var dispositivoNombre = this.nombre;
       var nombrePivot = this.getNombrePivot;
       var nombreTierra = this.getNombreFinca;
       FunctionsDatabase.deleteDevice(dispositivoNombre,nombreTierra,nombrePivot); 
      router.push('/detalle-pivot');
    },
  },
  computed: {
    ...mapGetters('app', [ 'getNombreFinca', 'getNombrePivot', 'getNombreDispositivo']),
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

beforeMount() {
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
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
     FunctionsDatabase.pivotInformation(this.getNombreFinca, this.getNombrePivot).then((result) =>{
        if(result === null) router.push('/finca');
        this.localizacion = result.localizacion[0];
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
   });
     FunctionsDatabase.deviceInformation(this.getNombreFinca, this.getNombrePivot, this.getNombreDispositivo).then((result) =>{
        if(result === null) router.push('/finca');
        this.nombre = result.nombre[0];
        this.tipo = result.tipo[0];
        this.localizacion = result.localizacion[0];
  
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
        this.descripcion = result.descripcion[0];
   });
},
};
</script>

<style >
</style>
