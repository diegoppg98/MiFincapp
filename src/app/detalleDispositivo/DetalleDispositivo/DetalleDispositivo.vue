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

   
   <v-card
      class="mx-10 my-12 font-weight-black red--text text-center"
      raised
      color="#000000"
   >
   <h1>Dispositivo:  <span>{{ nombre }}</span></h1>  

   </v-card>
  <v-row>
<v-col :cols="posMap"> 
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
        label="Nombre"
        required
        clearable
      ></v-text-field>
    
    <v-text-field
        v-model="id"
        label="Identificador"
        required
        disabled
      ></v-text-field>

      <v-text-field
        v-model="tipo"
        label="Tipo"
        disabled
      ></v-text-field>
      
      <v-text-field
        v-show="dispositivoTemperatura"
        v-model="temperaturaActual"
        disabled
        label="Temperatura Actual"
      ></v-text-field>

     <v-layout justify-start v-if="!dialogMapa">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarMapa" color="grey">
        Mostrar Mapa
     </v-btn>
     </v-layout>
     
    <v-layout justify-start v-if="dialogMapa">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarMapa" color="grey">
        Ocultar Mapa
     </v-btn>
     </v-layout>
                
     
     <v-row justify="end">
      <v-btn
        :disabled="!valid"
        :loading="isLoading"
        color="success"
        class="mr-4"
        @click="onSubmit"
      >
        Guardar
      </v-btn>
      </v-row>
      
      <v-card>
     <v-btn
        v-if="!calculationDistance"
        color="info"
        class="mr-4"
        @click="Calculatedistance"
      >
        Calcular distancia entre puntos
      </v-btn>
      
     <v-btn
        v-if="calculationDistance"
        color="info"
        class="mr-4"
        @click="Calculatedistance"
      >
        Cancelar calculo de la distancia
      </v-btn>   
    <v-card-title>
      Medidas
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Buscar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
        <v-data-table
        :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :page.sync="page"
    hide-default-footer
    @page-count="pageCount = $event"
    @click:row="clicked"
    class="elevation-1"
    :search="search"
  >
  
  <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Tu búsqueda por "{{ search }}" no ha encontrado resultados.
      </v-alert>
  </v-data-table>
  <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Medidas por página"
        type="number"
        min="0"
        max="100"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
      <v-text-field
        v-model="numberItems"
        label="Número de Medidas"
        type="number"
      ></v-text-field>
    </div>
    </v-card>
    </v-form> 
    </v-col>
    <v-col :cols="posMap">
    <v-card      
      outlined
      v-show="dialogMapa"
   >
      <v-switch v-show="showSwitch" v-model="validUbicacion" class="ma-4" label="Elige ubicación del dispositivo" color="grey"></v-switch>
      <v-layout justify-end v-if="!dialogMapaOptions">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Mostrar Opciones
     </v-btn>
     </v-layout>
     
    <v-layout justify-end v-if="dialogMapaOptions">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Ocultar Opciones
     </v-btn>
     </v-layout>
     <div style="height: 350px;" ref="mapa" id="mapa"></div>
   </v-card>
      
    
    </v-col>
     </v-row>
<v-card-actions class="justify-start">
  <v-btn @click.stop="dialog = true" color="error">
    Eliminar dispositivo
  </v-btn>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar el dispositivo, este procesos será irreversible.
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
            @click="eliminarDispositivo"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-card-actions>
 </div> 
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {router} from '../../router';

import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain.js';
import {Spain_MapasrasterIGN} from '../../LeafletSpain.js';
import {Spain_IGNBase} from '../../LeafletSpain.js';
import {Spain_Catastro} from '../../LeafletSpain.js';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain.js';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import KalmanFilter from 'kalmanjs';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
import {Dispositivo} from '../../Clases/Dispositivo';
import {DispositivoGps} from '../../Clases/Dispositivo';
import {DispositivoTemperatura} from '../../Clases/Dispositivo';
import {Alerta} from '../../Clases/Alerta';
import {Notificacion} from '../../Clases/Notificacion';
import {classMethods} from '../../classMethods';

const yellowIcon = new L.Icon({
     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     shadowSize: [41, 41]
   }); 
const blueIcon = new L.Icon({
     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     shadowSize: [41, 41]
   });
   
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
      showSwitch:false,
      id: '',
      items: [],
      coordenadaFinca:0,
      coordenadaPivot:0,
      coordenadaMarker:0,
      coordenadasDispositivo:0,
      marker:'',
      tipoPivot:'',
      sortBy: 'tiempo',
        sortDesc: true,
      page: 1,
        pageCount: 0,
        itemsPerPage: 5,
        numberItems: 50,
        search: '',
      /*headers: [
          { text: 'Medidas', value: 'medida' },
          { text: 'Tiempos de llegada', value: 'tiempo' },
          { text: 'Notificadas', value: 'revisada' },
        ],*/
        headers: [
          { text: 'Tiempos de llegada', value: 'tiempo' },
        ],
        nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      select: null,
      temperaturaActual: '',
      dispositivoTemperatura: false,
      tiposDispositivos: [
        'GPS',
        'Temperatura',
      ],
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      valid: true,
      validUbicacion: true,
      positions:'',
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      dialog: false,
      dialogMapa: true,
      groupLayer:[],
      dialogMapaOptions: true,
      point1:'',
      medida1:'',
      calculationDistance: false,
    };
  },
watch: {
   async validUbicacion(val) {
     var dispositivoLocalizacion = [];
     var valorUbicacion=val;
     var layers = [];
     var t = this;
     this.map2.eachLayer(function(layer) {
       if (layer instanceof L.Marker) {
        layers.push(layer); 
       }                      
     });   

     if(this.localizacion.length !== 0){ 
          if(this.getPivot !== null){  
            var localizacion = this.getPivot.localizacion;
            L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
               onEachFeature: function (feature, layer) {
                 var p; 
                 if(t.localizacion[0].getLatLng().lat === feature.geometry.coordinates[0][1] && t.localizacion[0].getLatLng().lng === feature.geometry.coordinates[0][0])
                    var p = L.latLng(feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]); 
                 else
                    var p = L.latLng(feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]); 
                 layers[0].setLatLng(p);
                 t.localizacion = layers;
               },
            });
          }

     } 
    },    
   numberItems(val) {
     this.items = [];
     var items = this.items;
     classMethods.getMedidaMethods().listMeasurements(this.id,parseInt(val)).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {  
          var medida = childResult.medida;
          var tiempo = childResult.tiempo;
          var notificada = childResult.notificada;
          var label =medida;/////////////////////////////
          items.push( { medida: medida ,tiempo: tiempo,revisada: notificada, key: childResult.key });  
         })
         /*items.sort(function(a, b){
           if(a.tiempo > b.tiempo) { return -1; }
           if(a.tiempo < b.tiempo) { return 1; }
           return 0;
         })*/
        }  
     });
    },
    
  },
  methods: {
  ...mapActions('app', ['changeUser','changeDispositivo']), 
  
  Calculatedistance(){    
    if(!this.calculationDistance){
      this.map2.pm.addControls({
         drawMarker: true,
         removalMode: true,
       });
      this.timeoutSnackbar = 10000;
      this.colorSnackbar = "info";
      this.textSnackbar = 'Selecciona dos puntos para medir la distancia entre ellos, seleccionando una medida de la tabla o marcando la posición en el mapa';
      this.snackbar = true;
      this.calculationDistance = true;     
    }
    else{
     var map = this.map2;
     this.map2.eachLayer(function(layer) { 
          if (layer instanceof L.Marker) {
           if(layer.getIcon() == yellowIcon)
             map.removeLayer(layer);
        }                    
     })
   
      this.map2.pm.addControls({
         drawMarker: false,
         removalMode: false,
       });
      this.calculationDistance = false;
    }
  }, 
  
  clicked(value) { 

  //var kf = new KalmanFilter({R: 0.01, Q: 0.5}); R->desired noise, Q->expected noise
/*const kf = new KalmanFilter();
const kf2 = new KalmanFilter();
console.log(kf.filter(42.299895));
console.log(kf.filter(42.300013));
console.log(kf.filter(42.300202));
console.log(kf.filter(42.300576));
console.log(kf.filter(42.300557));
console.log(kf.filter(42.300552));
console.log(kf.filter(42.300546));
console.log(kf.filter(42.300545));
console.log(kf.filter(42.300574));
console.log(kf.filter(42.300994));
console.log(kf.filter(42.302221));

console.log(kf2.filter(-5.63800));
console.log(kf2.filter(-5.638007));
console.log(kf2.filter(-5.638043));
console.log(kf2.filter(-5.638025));
console.log(kf2.filter(-5.638115));
console.log(kf2.filter(-5.638127 ));
console.log(kf2.filter(-5.638007));
console.log(kf2.filter(-5.638073));
console.log(kf2.filter(-5.638123));
console.log(kf2.filter(-5.638175));
console.log(kf2.filter(-5.63835));
*/
 //42.299895,-5.63800  42.300013,-5.638007  42.300202,-5.638043  42.300576,-5.638025  42.300557,-5.638115  42.300552,-5.638127  42.300546,-5.638007  42.300545,-5.638073  42.300574,-5.638123  42.300994,-5.638175  42.302221,-5.63835
  
 
 
 if(this.tipo === 'GPS'){
    var p;
    var punto1;
    var punto2;
    var latlngCenter;                                    
    var puntoDevice = L.latLng(value.medida[0],value.medida[1]);
    if(this.tipoPivot === "lineal"){
      p = FunctionsUtils.closestPoint(this.tipoPivot, this.positions, puntoDevice);
      punto1=L.latLng(p[0].x, p[0].y);
      punto2=L.latLng(p[1].x, p[1].y);
      p=punto2;    
    }
    else{
      if(Math.floor(this.coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(this.coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
      }
      else {
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs()[0].lng);
      }
      p = FunctionsUtils.closestPoint(this.tipoPivot, this.positions, puntoDevice);
      punto1=latlngCenter;
      punto2=p;
      
    } 

    if(this.calculationDistance){
      if(this.point1 == ''){
          this.point1 = L.latLng(p.lat,p.lng);
          this.medida1 = value;
      }
      else{     
          var point2 = L.latLng(p.lat,p.lng);
          //console.log(FunctionsUtils.distanciaMedidas(this.items,this.medida1,value,this.point1,point2));
          var distanceActual = point2.distanceTo(this.point1);
          this.timeoutSnackbar = 4000;
          this.colorSnackbar = "info";
          this.textSnackbar = distanceActual.toFixed(3) + " metros";
          this.snackbar = true;
          this.point1 = '';
      }
    }
    var LatLngs = []; LatLngs.push(punto1); LatLngs.push(punto2);
    var LatLng = p;                         
                             
    this.map2.eachLayer(function(layer) { 
          if (layer instanceof L.Marker) {
           layer.setIcon(blueIcon);
           layer.setLatLng(LatLng);
        }                    
        })
      this.map2.eachLayer(function(layer) {
             if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
                layer.setLatLngs(LatLngs); 
             }                       
     })
    } 
  },
 /* tipoChanged(){
     if(this.tipo === 'GPS'){
       this.showSwitch = true;
       if(this.marker)
        this.map2.removeLayer(this.marker);
      this.marker = L.marker(this.coordenadaMarker).addTo(this.map2);       
     }
     else if(this.tipo === 'Temperatura'){
      this.showSwitch = false;      
      }

     },*/
  mostrarOpciones(){ 
  
/*  var imageUrl = 'https://www.yamit-f.com/wp-content/uploads/2018/01/central-pivot.jpg',
	imageBounds = [[42.297801,-5.638074],[42.298116,-5.634713]];

L.imageOverlay(imageUrl, imageBounds).bringToFront();
  L.imageOverlay(imageUrl, imageBounds).addTo(this.map2);
 L.imageOverlay(imageUrl, imageBounds).bringToFront();
//////////////////////////7///////////////
//[-5.638074,42.297801],[-5.634713,42.298116]  
var greenIcon = L.icon({
    iconUrl: '../../../miFincappIcon.png',
    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([42.297801,-5.638074], {icon: greenIcon}).addTo(this.map2);
   */  
  
  
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapaOptions){ lc[0].style.visibility = 'hidden'; this.dialogMapaOptions = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapaOptions = true; }
    },
     onSubmit() {

       this.isLoading = true;
       var dispositivoLocalizacion = [];
       
       this.localizacion.forEach(function(element,index) {
          dispositivoLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
       if(dispositivoLocalizacion.length === 0){
   	  this.colorSnackbar = "error";
   	  this.timeoutSnackbar = 4000;
          this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
         this.isLoading = false;
       } 
       
       else{
       var p = L.latLng(this.localizacion[0].getLatLng().lat, this.localizacion[0].getLatLng().lng);
       
       if(!FunctionsUtils.pointInLand(p,this.coordenadaFinca)){
          this.colorSnackbar = "error";
          this.timeoutSnackbar = 4000;
          this.textSnackbar = 'Localizacion marcada fuera de la finca. Por favor seleccione una localizacion dentro de la finca';
          this.snackbar = true;
          this.isLoading = false;
       }
       else{
       
       var t = this;
       L.geoJSON(L.geoJSON(JSON.parse(dispositivoLocalizacion[0])).toGeoJSON(), {
             onEachFeature: function (feature, layer) {
              t.coordenadasDispositivo = feature.geometry.coordinates;
             },
        });
        
        var dispositivoTipo = this.tipo;
       
        if(dispositivoTipo === 'GPS'){
        
         var latlngCenter = null;
         var latlngPoint = null;
         var positions = '';

if(Math.floor(this.coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(this.coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
              latlngPoint = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs
()[0].lng);
                           }
                           else { 
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
                           }
                                                                
  if(this.tipoPivot === 'lineal'){           
    positions = FunctionsUtils.pivotLineal(this.map2, this.coordenadaFinca, latlngPoint, latlngCenter);

  }
  else if(this.tipoPivot === 'circular'){           
    positions = FunctionsUtils.pivotCircular(this.map2, this.coordenadaFinca, latlngPoint, latlngCenter); 
  }
  
  }
       
         var nombreTierra = this.getFinca.key;
         var nombrePivot = this.getPivot.key;
         var dispositivoNombre = this.nombre;
         var dispositivoId = this.id;
         var dispositivoTemperatura= this.temperaturaActual;
         this.positions = positions;
         
         var dispositivo = null;
         
         if(dispositivoTipo === 'GPS'){
           dispositivo = new DispositivoGps(this.getDispositivo.key,dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,JSON.stringify(positions));
        }
        if(dispositivoTipo === 'Temperatura'){
          if(!this.getDispositivo.temperatura) dispositivoTemperatura = "";
           dispositivo = new DispositivoTemperatura(this.getDispositivo.key,dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,dispositivoTemperatura);
        } 

      if(dispositivo !== null){ 
          classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          this.changeDispositivo(dispositivo); 
   	  this.colorSnackbar = "success";
   	  this.timeoutSnackbar = 4000;
          this.textSnackbar = 'Dispositivo actualizado correctamente';
          this.snackbar = true;
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al actualizar el Dispositivo. Por favor inténtelo otra vez';
             this.snackbar = true;
          });
   	  
           if(dispositivoTipo === 'GPS'){
           var keyDevice = this.getDispositivo.key;
         classMethods.getAlertaMethods().listAlerts().then((resultAlerta) =>{
                       if(resultAlerta !== null){
                         resultAlerta.forEach(function(childResultAlerta){ 
                           var alertaNombre = childResultAlerta.nombre;
                           var alertaDispositivo = childResultAlerta.dispositivo;
                           var alertaTipo = childResultAlerta.tipo;
                           var alertaDatos = childResultAlerta.datos;
                           var opcionAlerta = childResultAlerta.opcion;
                            var nombreTierra = childResultAlerta.tierra;
                           var nombrePivot = childResultAlerta.pivot;
                           var alertaMute = childResultAlerta.silenciada;
                           var alertaUltimaNotificacion = childResultAlerta.tiempoUltimaAlerta;
                           var alertaTiempo = childResultAlerta.tiempo;
                           var alertaKey = childResultAlerta.key; 
                           if(!alertaMute){
                             if(alertaDispositivo === keyDevice){ 
                                let current_datetime = new Date();
                                var time = current_datetime.toISOString();
                                if(alertaUltimaNotificacion === '' || ((Date.parse(time)-Date.parse(alertaUltimaNotificacion))/60000)>=alertaTiempo){

                  L.geoJSON( L.geoJSON(JSON.parse(alertaDatos[0])).toGeoJSON(), {
                    onEachFeature: function (feature, layer) {
                    var layerAlerta = layer;
                     L.geoJSON( L.geoJSON(JSON.parse(dispositivoLocalizacion)).toGeoJSON(), {
                         onEachFeature: function (feature, layer) {
                           var coordenadasActualesDispositivo = feature.geometry.coordinates;
                           var punto=L.latLng(coordenadasActualesDispositivo[1],coordenadasActualesDispositivo[0]);
                           var inZone = FunctionsUtils.pointInLand(punto, layerAlerta);
                           if(opcionAlerta === "Entre en la zona"){
                             if(inZone){ 
                             var notificacion = new Notificacion("",dispositivoLocalizacion, time, alertaKey);                       
                            classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                            var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       }).catch((error) => {   	                 
                       });
                             }
                           }
                            else if(opcionAlerta === "Salga de la zona"){
                             if(!inZone){ 
                             var notificacion = new Notificacion("",dispositivoLocalizacion, time, alertaKey);
                             classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                             var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       }).catch((error) => {   	                 
                       });
                             }
                            }                                
                           },
                       });
                      },
                     });  
                   }                            
                   }
                  }
                 });
                }                       
              }); 
           } 
       }
       }
       }
    },
    async eliminarDispositivo() {
      this.dialog = false;
       var dispositivoNombre = this.nombre;
       var nombrePivot = this.getPivot;
       var nombreTierra = this.getFinca;
       classMethods.getDispositivoMethods().deleteDevice(this.getDispositivo).then((result) =>{
          router.push('/detalle-pivot');
          }).catch((error) => {
   	     this.colorSnackbar = "error";
   	     this.timeoutSnackbar = 4000;
             this.textSnackbar = error;
             this.snackbar = true;
          });       
    },
    mostrarMapa(){  
      if(this.dialogMapa)  this.dialogMapa = false;
      else  this.dialogMapa = true;     
    },
  },
  computed: {
    posMap () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return '12'
          case 'sm': return '12'
          case 'md': return '6'
          case 'lg': return '6'
          case 'xl': return '6'
          }
   },

    ...mapGetters('app', [ 'getFinca', 'getPivot', 'getDispositivo']),
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
   
    this.map2 = L.map(this.$refs['mapa'], {
    fullscreenControl: true,
   });
   var baselayers = {
	"Normal": mapboxTiles1,
	"Vista Real": Spain_PNOA_Ortoimagen,
	"Mapa España": Spain_MapasrasterIGN,
	"Parcelas": parcelas,
	"Recintos": recintos,
	//"Mapa España y Mundo": Spain_IGNBase,
	"Catastro": Spain_Catastro					
   };
   var overlayers = {
       "Unidades administrativas": Spain_UnidadAdministrativa
   };		
   L.control.layers(baselayers, overlayers,{collapsed:false}).addTo(this.map2);
   L.control.scale({options: {position: 'bottomleft',maxWidth: 100,metric: true,imperial: false,updateWhenIdle: false}}).addTo(this.map2);
   Spain_PNOA_Ortoimagen.addTo(this.map2);
 //  var lc = document.getElementsByClassName('leaflet-control-layers');
  // lc[0].style.visibility = 'hidden';
   this.map2.pm.setLang('es');
   this.map2.pm.addControls({
            drawMarker: false,
            drawCircleMarker: false,
            drawPolygon: false,
            drawRectangle: false,
            drawCircle: false,
            drawPolyline: false,
            removalMode: false,
            editMode: false,
            dragMode: false,
            cutPolygon: false,
   }); 
 
        if(this.getDispositivo === null) router.push('/finca');

        if(this.getDispositivo.tipo === "Temperatura"){
          this.showSwitch = false;
        }
        else if(this.getDispositivo.tipo === "GPS"){
          this.showSwitch = true;        
       } 
       
   
   this.map2.on('pm:create', e => {
     e.layer.setIcon(yellowIcon);
   if(this.calculationDistance){
     var p = L.latLng(e.layer.getLatLng().lat,e.layer.getLatLng().lng);
     if(this.point1 == ''){
          this.point1 = p;
      }
      else{
          var point2 = p;
          var distanceActual = point2.distanceTo(this.point1);
          this.colorSnackbar = "info";
          this.timeoutSnackbar = 4000;
          this.textSnackbar = distanceActual.toFixed(3) + " metros";
          this.snackbar = true;
          this.point1 = '';
      }
    }

     this.map2.pm.disableDraw('Marker');
   });

   this.map2.on('pm:remove', e => {
     if(e.layer.getIcon() != yellowIcon){
       e.layer.addTo(this.map2);  
     }
   });
            this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups
   
   L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
     }).addTo(this.map2);
    //  var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
  var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);
 

  var results = L.layerGroup().addTo(this.map2);

  searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      //results.addLayer(L.marker(data.results[i].latlng));
    }
  });
  this.dialogMapa = false;
  
  this.dialogMapa = true;
     //this.changeUser(true);  
  
     if(this.getFinca === null || this.getPivot === null || this.getDispositivo === null) router.push('/finca');
     else{

        var localizacion = this.getFinca.localizacion;
        var map = this.map2;
        var layers;
        var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
             layers = layer;
             t.coordenadaFinca = layer;
           },
        });
       
                this.groupLayer.push(layers);
        var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
        localizacion.forEach(function(element,index) {
          var myStyle = {
            "color": 'red',
            "weight": 5,
            "opacity": 0.65
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);
        })

        var localizacion = this.getPivot.localizacion;
        this.tipoPivot = this.getPivot.tipo;
        var map = this.map2;
        localizacion.forEach(function(element,index) {
          var myStyle = {
            "color": 'blue',
            "weight": 5,
            "opacity": 1
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane450",
             style: myStyle
          }).addTo(map);
        })
        
        var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
          
          t.coordenadaPivot = layer;
          t.coordenadaMarker = L.latLng(feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]); 
          },
        });

        this.nombre = this.getDispositivo.nombre;
        this.id = this.getDispositivo.id;
        this.tipo = this.getDispositivo.tipo;
        var localizacion = this.getDispositivo.localizacion; 


        if(this.getDispositivo.tipo === "Temperatura"){
          if(this.getDispositivo.temperatura){
             this.temperaturaActual = this.getDispositivo.temperatura;
             this.dispositivoTemperatura = true;
          }
        }      
        else if (this.getDispositivo.tipo === "GPS"){
            this.positions = JSON.parse(this.getDispositivo.posiblesLocalizaciones); 
          }

        var map = this.map2;
        var t = this;
        
        L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
                  t.coordenadasActualesDispositivo = feature.geometry.coordinates;
                  t.localizacion.push(layer);
           },
        });
         
        localizacion.forEach(function(element,index) {
           t.marker = L.geoJSON(JSON.parse(element)).addTo(map);           
        })  
                       
        var items = this.items;
        var position = this.positions;

        classMethods.getMedidaMethods().listMeasurements(this.id,this.numberItems).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {  
          var medida = childResult.medida;
          var tiempo = childResult.tiempo;
          var notificada = childResult.notificada;
          var label =medida;/////////////////////////////
          items.push( { medida: medida ,tiempo: tiempo,revisada: notificada, key: childResult.key });  
         })
         /*items.sort(function(a, b){
           if(a.tiempo > b.tiempo) { return -1; }
           if(a.tiempo < b.tiempo) { return 1; }
           return 0;
         })*/
    }
   });
 

   }
},

beforeMount() {
   window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }
},
};
</script>


<style >
</style>
