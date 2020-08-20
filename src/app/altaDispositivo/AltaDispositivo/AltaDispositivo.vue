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
        :rules="nameRules"
        :error="isIdUsed"
        label="Identificador"
        required
        clearable
      ></v-text-field>

      <v-select
        v-model="tipo"
        :items="tiposDispositivos"
        :rules="[v => !!v || 'Tipo de dispositivo es requerido']"
        label="Tipo"
        required
        style="z-index: 999"
        @change="tipoChanged"
      ></v-select>
     <v-switch v-show="showSwitch" v-model="validUbicacion" class="ma-4" label="Elige ubicación del dispositivo" color="grey"></v-switch>
     
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
    </v-form>
       </v-col>
    <v-col :cols="posMap">
    <v-layout justify-end v-if="!dialogMapa">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Mostrar Opciones
     </v-btn>
     </v-layout>
     
    <v-layout justify-end v-if="dialogMapa">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Ocultar Opciones
     </v-btn>
     </v-layout>
    <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
    </v-col>
     </v-row>
 </div> 
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';

import { mapActions, mapGetters } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain.js';
import {Spain_MapasrasterIGN} from '../../LeafletSpain.js';
import {Spain_IGNBase} from '../../LeafletSpain.js';
import {Spain_Catastro} from '../../LeafletSpain.js';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain.js';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils(); 
import {Notificacion} from '../../Clases/Notificacion';
import {Pivot} from '../../Clases/Pivot';
import {Dispositivo} from '../../Clases/Dispositivo';
import {DispositivoGps} from '../../Clases/Dispositivo';
import {DispositivoTemperatura} from '../../Clases/Dispositivo';
import {classMethods} from '../../classMethods';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'AltaDispositivo',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',
      id: '',
      valid: true,
      tipo: null,
      select: null,
      showSwitch:false,
      tiposDispositivos: [
        'GPS',
        'Temperatura',
      ],
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      coordenadaFinca:0,
      coordenadaMarker:0,
      coordenadaPivot:0,
      coordenadasDispositivo:0,
      tipoPivot:'',
      positions:'',
      marker:'',
      validUbicacion: true,
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      groupLayer:[],
      dialogMapa: true,
      isIdUsed: false,
    };
  },
  
watch: {
    async id(val) {
       var result = await this.idUsed;
       this.isIdUsed = result; 
 
       if(this.isIdUsed){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Identificador de dispositivo ya esta dado de alta. Por favor, pruebe con otro';
          this.snackbar = true;
       }
    },

   async validUbicacion(val) {
     var map = this.map;
     var dispositivoLocalizacion = [];
     var valorUbicacion=val;
     var layers = [];
     this.map2.eachLayer(function(layer) {
       if (layer instanceof L.Marker) {
        layers.push(layer); 
       }                      
     });  
     if(layers.length !== 0){ 
          if(this.getPivot !== null){  
            this.localizacion = this.getPivot.localizacion;
            L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
               onEachFeature: function (feature, layer) {
                 var p; 
                 if(valorUbicacion === false)
                    var p = L.latLng(feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]); 
                 else
                    var p = L.latLng(feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]); 
                 layers[0].setLatLng(p);
               },
            });
          }
     } 
    }
  },
  methods: {
  ...mapActions('app', ['changeUser']),
  tipoChanged(){
     if(this.tipo === 'GPS'){
       this.showSwitch = true;
       if(this.marker)
        this.map2.removeLayer(this.marker);
       this.marker = L.marker(this.coordenadaMarker).addTo(this.map2); 
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
      
     }
     else if(this.tipo === 'Temperatura'){
      this.showSwitch = false;
      if(this.marker)
        this.map2.removeLayer(this.marker);
      this.map2.pm.addControls({
        drawMarker: true,
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
      
      }

     },
     
  mostrarOpciones(){           
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapa){ lc[0].style.visibility = 'hidden'; this.dialogMapa = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapa = true; }

    },
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
       var p = L.latLng(this.localizacion[0].getLatLng().lat, this.localizacion[0].getLatLng().lng);
       
       if(!FunctionsUtils.pointInLand(p,this.coordenadaFinca)){
          this.colorSnackbar = "error";
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

if(Math.floor(this.coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(this.coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
              latlngPoint = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs
()[0].lng);
                           }
                           
                           else {
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
                           }
                           /*else if(Math.floor(this.coordenadaPivot.getLatLngs()[1].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(this.coordenadaPivot.getLatLngs()[1].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(this.coordenadasDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(this.coordenadaPivot.getLatLngs()[0].lat, this.coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(this.coordenadaPivot.getLatLngs()[1].lat, this.coordenadaPivot.getLatLngs()[1].lng);
                           }*/
                                                
         if(this.tipoPivot === 'lineal'){           
            this.positions = FunctionsUtils.pivotLineal(this.map2, this.coordenadaFinca, latlngPoint, latlngCenter);
         }
         else if(this.tipoPivot === 'circular'){           
            this.positions = FunctionsUtils.pivotCircular(this.map2, this.coordenadaFinca, latlngPoint, latlngCenter);                
         }   
         
         }    
         var nombreTierra = this.getFinca.key;
         var nombrePivot = this.getPivot.key;
         var dispositivoNombre = this.nombre;
         var dispositivoId = this.id;        
         var positions = this.positions; 
         var dispositivo = null;
         
         if(dispositivoTipo === 'GPS'){
           dispositivo = new DispositivoGps("",dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,JSON.stringify(positions));
        }
        if(dispositivoTipo === 'Temperatura'){
           dispositivo = new DispositivoTemperatura("",dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,"");
        } 

        this.isLoading = false;
        if(dispositivo !== null){
        classMethods.getDispositivoMethods().createDevice(dispositivo).then((result) =>{
         if(dispositivoTipo === 'GPS')
            this.checkMeasurementsGps(dispositivoId);
         if(dispositivoTipo === 'Temperatura')
            this.checkMeasurementsTemperatura(dispositivoId);
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Dispositivo creado correctamente';
          this.snackbar = true;
          
         router.push('/detalle-pivot');
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear el dispositivo. Por favor inténtelo otra vez';
             this.snackbar = true;
          });     
       }
       }
       }
    },
    checkMeasurementsGps(idDevice: string){
               var nomPivot = this.getPivot.key;
               var nomFinca = this.getFinca.key;

               var map = this.map2;
               var tipoPivot = this.tipoPivot;
               var positions = this.positions; 
                
          classMethods.getMedidaMethods().checkDeviceMeasurement(idDevice).then((result) =>{            
                
               //if items not empty, update position of pivot and device, and check if any alert is fulfilled                   
               if(result !== null && result.length !== 0){
               var locationDevice = result[0].medida;
               var deviceId = result[0].id;
              
                  classMethods.getDispositivoMethods().checkDeviceId(deviceId).then((result) =>{
                     var userKey = result.user;
                     var deviceKey = result.device; 
                                                             
                     classMethods.getDispositivoMethods().deviceInformation(deviceKey).then((resultDispositivo) =>{
                     if(resultDispositivo !== null){ 
                       var latlngCenter = null;
                       var latlngPoint = null;      
                       var nombreDispositivo = resultDispositivo.nombre;
                       var tipoDispositivo = resultDispositivo.tipo;
                       var idDispositivo = resultDispositivo.id;
                       var fincaDispositivo = resultDispositivo.finca;
                       var pivotDispositivo = resultDispositivo.pivot;
                       var localizacionActualDispositivo = resultDispositivo.localizacion;
                       var coordenadasActualesDispositivo;
                       L.geoJSON( L.geoJSON(JSON.parse(localizacionActualDispositivo[0])).toGeoJSON(), {
                         onEachFeature: function (feature, layer) {
                           coordenadasActualesDispositivo = feature.geometry.coordinates;
                         },
                       });
                       
                       
                       classMethods.getPivotMethods().pivotInformation(nomPivot).then((result) =>{
                          if(result !== null){                       
                            var localizacionPivot = result.localizacion;
                            var tipoPivot = result.tipo;
                            var nombrePivot = result.nombre; 
                            var coordenadaPivot;
                            L.geoJSON( L.geoJSON(JSON.parse(localizacionPivot[0])).toGeoJSON(), {
                              onEachFeature: function (feature, layer) {
                                coordenadaPivot = layer;
                              },
                           });
                           
                           if(Math.floor(coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[1].lat, coordenadaPivot.getLatLngs()[1].lng);
              latlngPoint = L.latLng(coordenadaPivot.getLatLngs()[0].lat, coordenadaPivot.getLatLngs
()[0].lng);
                           }
                           else if(Math.floor(coordenadaPivot.getLatLngs()[1].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(coordenadaPivot.getLatLngs()[1].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[0].lat, coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(coordenadaPivot.getLatLngs()[1].lat, coordenadaPivot.getLatLngs()[1].lng);
                           }
                           
                           var p;
                           var punto1;
                           var punto2;
                           
                           classMethods.getFincaMethods().landInformation(nomFinca).then((result) =>{
                             if(result !== null){ 
                             var localizacionFinca = result.localizacion;
                             var coordenadaFinca;
                             L.geoJSON( L.geoJSON(JSON.parse(localizacionFinca[0])).toGeoJSON(), {
                               onEachFeature: function (feature, layer) {
                                 coordenadaFinca = layer;
                               },
                             });        

                             var puntoSimulado = L.latLng(locationDevice[0], locationDevice[1]);
                             if(tipoPivot === "lineal"){
                               p = FunctionsUtils.closestPoint(tipoPivot, positions, puntoSimulado);
                               punto1=L.latLng(p[0].x, p[0].y);
                               punto2=L.latLng(p[1].x, p[1].y);
                               p=punto2;
                             }
                             else{
                               p = FunctionsUtils.closestPoint(tipoPivot, positions, puntoSimulado);
                               punto1=latlngCenter;
                               punto2=p;
                             } 
                             
                             var m1 = L.marker(p);
                             
                             var dispositivoLocalizacion = [];
                             var layers = [];
                             layers.push(m1); 
                             layers.forEach(function(element,index) {
                               dispositivoLocalizacion.push(JSON.stringify(element.toGeoJSON()));
                             })
                             var layersPivot = [];
                             var pivotLocalizacion = [];
                             
                             
                             var LatLngs = []; LatLngs.push(punto1); LatLngs.push(punto2);
                             var polyline = L.polyline(LatLngs);
                             layersPivot.push(polyline); 
                            
                            layersPivot.forEach(function(element,index) {
                              pivotLocalizacion.push(JSON.stringify(element.toGeoJSON()));
                            })  
 var pivot = new Pivot(pivotDispositivo,nombrePivot, tipoPivot, pivotLocalizacion, nomFinca);
classMethods.getPivotMethods().updatePivot(pivot).then((result) =>{ 
          }).catch((error) => { 	     
          });

//UPDATE TODOS LOS DISPOSITIVOS DEL PIVOT
classMethods.getDispositivoMethods().listDevices(nomPivot).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var nombreDispositivo = childResult.nombre;
          var tipoDispositivo = childResult.tipo;
          if(tipoDispositivo === 'GPS'){
            var idDispositivo = childResult.id;
            var fincaDispositivo = childResult.finca;
            var pivotDispositivo = childResult.pivot;//JSON.parse(
            var dispositivoPositions = childResult.posiblesLocalizaciones;
            var deviceKey = childResult.key;
            var dispositivo = new DispositivoGps(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,dispositivoPositions); 
            classMethods.getDispositivoMethods().updateDevice(dispositivo);
          }
       })
    }
   }); 
                            
                            }
                          })              
                          }
                       });                  
                     } 
                   });
                 }); 
               }                
      });    
  },
 
 
 //CHECKEAR NOTIFICACIONES COMO VISTAS 
  checkMeasurementsTemperatura(idDevice: string){
     classMethods.getMedidaMethods().checkDeviceMeasurement(idDevice).then((result) =>{  
       if(result !== null && result.length !== 0){
               var temperatureDevice = result[0].medida;
               var deviceId = result[0].id;
               
               classMethods.getDispositivoMethods().checkDeviceId(deviceId).then((result) =>{
                     var userKey = result.user;
                     var deviceKey = result.device;
                     classMethods.getDispositivoMethods().deviceInformation(deviceKey).then((resultDispositivo) =>{
                       var nombreDispositivo = resultDispositivo.nombre;
                       var tipoDispositivo = resultDispositivo.tipo;
                       var idDispositivo = resultDispositivo.id;
                       var fincaDispositivo = resultDispositivo.finca;
                       var pivotDispositivo = resultDispositivo.pivot;
                       var dispositivoLocalizacion = resultDispositivo.localizacion;                          
                      
                      var dispositivo = new DispositivoTemperatura(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,temperatureDevice); classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          });
                     
//NO HACE FALTA COMPROBAR ALERTAS PORQUE AL CREAR DISPOSITIVO TODAVIA NO TIENE ALERTAS ASOCIADAS                     
           
                     }); 
               }); 
       }
    }); 
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
   idUsed(){
      var id = this.id;
      var resultado = false;
      if (id === ''){
        resultado = false;
      }
      else{
        resultado = classMethods.getDispositivoMethods().deviceExist(id).then(function (result) {
            return false;
        })
        .catch(function (error) {
            return true;
        })
      }
      return resultado;  
    },
    ...mapGetters('app', [ 'getFinca', 'getPivot']),
   
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
//   var lc = document.getElementsByClassName('leaflet-control-layers');
 //  lc[0].style.visibility = 'hidden';
   
   L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
     }).addTo(this.map2);
  //var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
  var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);
 
  var results = L.layerGroup().addTo(this.map2);

  searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      //results.addLayer(L.marker(data.results[i].latlng));
    }
  });

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
         this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups
   
   this.map2.on('pm:create', e => {
     this.marker = e.layer;
     this.map2.pm.addControls({
       drawMarker: false,
       removalMode: true,
     });
     this.map2.pm.disableDraw('Marker');
   });
   this.map2.on('pm:remove', e => {
     this.map2.pm.addControls({
       drawMarker: true,
       removalMode: false,
     });
   });
    
  if(this.getFinca === null || this.getPivot === null) router.push('/finca');
  else{
        this.localizacion = this.getFinca.localizacion;
        var map = this.map2;
        var layers;
        var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
             t.coordenadaFinca = layer;
              layers = layer;
           },
        });
        
        this.groupLayer.push(layers);
        var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
        this.localizacion.forEach(function(element,index) {
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

        this.localizacion = this.getPivot.localizacion;
        this.tipoPivot = this.getPivot.tipo;
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
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
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
          t.coordenadaPivot = layer;
          t.coordenadaMarker = L.latLng(feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]); 
          },
        });
   }
 },
 beforeMount(){
 //this.changeUser(true);  
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
