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
   <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/alerta'>
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

      <v-select
        v-model="finca"
        :items="listaFincas"
        :rules="[v => !!v || 'Finca es requerida']"
        label="Finca"
        required
        style="z-index: 999"
        @change="fincaChanged"
      ></v-select>

      <v-select
        v-model="pivot"
        :items="listaPivots"
        :rules="[v => !!v || 'Pivot es requerido']"
        label="Pivot"
        required
        style="z-index: 999"
        :disabled="!finca"
        @change="pivotChanged"
      ></v-select>

      <v-select
        v-model="dispositivo"
        :items="listaDispositivos"
        :rules="[v => !!v || 'Dispositivo es requerido']"
        label="Dispositivo"
        required
        style="z-index: 999"
        :disabled="!pivot"
        @change="dispositivoChanged"
      ></v-select>

   <v-card
      class="mx-10 my-12"
      outlined
      v-show="dispositivoTemperatura"
   >
      <v-text-field
          label="Temperatura"
          suffix="°C"
          v-model="DatoTemperatura"
          required
          type="number"
        ></v-text-field>

      <v-select
        v-model="temperatura"
        :items="opcionesTemperatura"
        :rules="[v => !!v || 'opcion es requerida']"
        label="Temperatura opcion"
        style="z-index: 999"
      ></v-select>
   </v-card>

   <v-card
      class="mx-10 my-12"
      outlined
      v-show="dispositivoGps"
   >
      <v-select
        v-model="gps"
        :items="opcionesGps"
        :rules="[v => !!v || 'opcion es requerida']"
        label="Gps opcion"
        style="z-index: 999"
      ></v-select>
      <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
   </v-card>

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
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
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
    title: 'AltaAlerta',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',
      finca: null,
      pivot: null,
      dispositivo: null,
      temperatura: 'Mayor',
      DatoTemperatura: '28',
      gps: 'Entre en la zona',
      descripcion: '',
      tipo: '',
      select: null,
      listaFincas: [
      ],
      listaPivots: [
      ],
      listaDispositivos: [
      ],
      opcionesTemperatura: [
      'Igual',
      'Mayor',
      'Menor',
      ],
      opcionesGps: [
      'Salga de la zona',
      'Entre en la zona',
      ],
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      valid: true,
      dispositivoTemperatura: false,
      dispositivoGps: false,
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      lazy: false,
      isNameRepeated: false,
      isLoading: false,
      map2: '',
      localizacion: [],
    };
  },
  watch: {
   async nombre(val) {
       var result = await this.nameRepeated;
       this.isNameRepeated = result; 
 
       if(this.isNameRepeated){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Nombre de alerta ya utilizado. Por favor, pruebe con otro nombre';
          this.snackbar = true;
       }
    }
  },
  methods: {
     fincaChanged(){
      var pivots = this.listaPivots;
      FunctionsDatabase.listPivots(this.finca).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {       
            var pivot = childResult.nombre[0];
            pivots.push(pivot);
         }); 
       }
      }); 
     },
     pivotChanged(){
      var dispositivos = this.listaDispositivos;
      FunctionsDatabase.listDevices(this.finca, this.pivot).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {       
            var dispositivo = childResult.nombre[0];
            dispositivos.push(dispositivo);
         }); 
       }
     }); 
     },
     dispositivoChanged(){
       FunctionsDatabase.deviceInformation(this.finca, this.pivot, this.dispositivo).then((result) =>{
          this.tipo = result.tipo[0];

          if(this.tipo === 'GPS'){    
             FunctionsDatabase.landInformation(this.finca).then((result) =>{
              if(result === null) router.push('/alerta');
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
 
             FunctionsDatabase.pivotInformation(this.finca, this.pivot).then((result) =>{
                if(result === null) router.push('/alerta');
                this.localizacion = result.localizacion[0];
                var map = this.map2;
                this.localizacion.forEach(function(element,index) {
                L.geoJSON(JSON.parse(element)).addTo(map);
             })  
             });
             FunctionsDatabase.deviceInformation(this.finca, this.pivot, this.dispositivo).then((result) =>{
               if(result === null) router.push('/alerta');
               this.localizacion = result.localizacion[0];
               var map = this.map2;
               this.localizacion.forEach(function(element,index) {
               L.geoJSON(JSON.parse(element)).addTo(map);
               })  
            });

           this.dispositivoTemperatura = false;
           this.dispositivoGps = true;
        }
        else if(this.tipo === 'Temperatura'){
          this.dispositivoGps = false;
          this.dispositivoTemperatura = true;
       }
      });
   },
     onSubmit() {
       this.isLoading = true;   

       if(this.tipo === 'GPS'){
       var tierraLocalizacion = [];
        var layers = []; 
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Rectangle) {     
           layers.push(layer); 
        }                    
        })
       this.localizacion = layers;   
       this.localizacion.forEach(function(element,index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
 
       if(tierraLocalizacion.length === 0){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
          this.isLoading = false;
       }
       else{
         var nombreTierra = this.finca;
         var nombrePivot = this.pivot;
         var NombreDispositivo = this.dispositivo;
         var alertaNombre = this.nombre;
         var alertaOpcion = this.gps;
         var alertaDescripcion = this.descripcion;
         var alertaTipo = this.tipo;  
         FunctionsDatabase.createAlert(alertaNombre, alertaTipo, alertaDescripcion, tierraLocalizacion, alertaOpcion, nombreTierra, nombrePivot, NombreDispositivo);
   	 this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta creada correctamente';
         this.snackbar = true;
         this.isLoading = false;
         this.nombre = '';
       }
       }

       else if(this.tipo === 'Temperatura'){
         var nombreTierra = this.finca;
         var nombrePivot = this.pivot;
         var NombreDispositivo = this.dispositivo;
         var alertaNombre = this.nombre;
         var alertaDatos = []; 
         var alertaOpcion = this.temperatura;
         var alertaDescripcion = this.descripcion;
         var alertaTipo = this.tipo;
         alertaDatos.push(this.DatoTemperatura);
         FunctionsDatabase.createAlert(alertaNombre, alertaTipo, alertaDescripcion, alertaDatos, alertaOpcion, nombreTierra, nombrePivot, NombreDispositivo);
   	 this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta creada correctamente';
         this.snackbar = true;
         this.isLoading = false;
         this.nombre = ''; 
       }

    },

  },
  computed: {
    nameRepeated(){
      var nombre = this.nombre;
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.alertExist(nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
            return true;
        })
      }
      return resultado;  
    },
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
     drawRectangle: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     editeModel: false,
     dragMode: true,
     cutPolygon: false,
   });
 },

  beforeMount () {
     var tierras = this.listaFincas;
     FunctionsDatabase.listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {   
          var finca = childResult.nombre[0];
          tierras.push(finca);
       }); 
     }
   }); 
  }

};
</script>

<style>
</style>
