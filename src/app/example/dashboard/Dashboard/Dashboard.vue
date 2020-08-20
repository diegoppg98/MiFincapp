<template>
 <div>
     <v-card
      class="mx-10 my-12"
      outlined
   >
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
    </v-card>
    <v-card class="mx-10 my-12">
    <v-card-title>
      	Notificaciones
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
        item-key="keyNotification"
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    :page.sync="page"
    hide-default-footer
    @page-count="pageCount = $event"
    class="elevation-1"
    :search="search"
  >
  <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Tu búsqueda por "{{ search }}" no ha encontrado resultados.
      </v-alert>
      
    
      <template v-slot:item.detalleAlerta="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="clickAlerta(item)"
      >
        mdi-alert
      </v-icon>
       </template>
      <template v-slot:item.actions="{ item }">      
      <v-icon
        small
        color="pink"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
  <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
      <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="0"
        max="100"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field>
    </div>
    
    
    <v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar la notificacion, este procesos será irreversible.
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
            @click="eliminarNotificacion"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-card>
  </div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import {router} from '../../../router';
import {Utils} from '../../../utils';
let FunctionsUtils: Utils = new Utils();
import {Spain_PNOA_Ortoimagen} from '../../../LeafletSpain';
import {Spain_MapasrasterIGN} from '../../../LeafletSpain';
import {Spain_IGNBase} from '../../../LeafletSpain';
import {Spain_Catastro} from '../../../LeafletSpain';
import {Spain_UnidadAdministrativa} from '../../../LeafletSpain';
import {parcelas} from '../../../LeafletSpain';
import {recintos} from '../../../LeafletSpain';
import '../../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../../node_modules/vuetify/dist/vuetify.css';
import {Notificacion} from '../../../Clases/Notificacion';
import {Alerta} from '../../../Clases/Alerta';
import {Pivot} from '../../../Clases/Pivot';
import {Dispositivo} from '../../../Clases/Dispositivo';
import {DispositivoGps} from '../../../Clases/Dispositivo';
import {DispositivoTemperatura} from '../../../Clases/Dispositivo';
import {classMethods} from '../../../classMethods';
export default {
  metaInfo: {
    title: 'Dashboard',
  },
  data: () => ({
      item: 1,
      items: [],
      dialog: false,
      itemActual:'',
      page: 1,
      sortBy: 'tiempo',
        sortDesc: true,
        pageCount: 0,
        itemsPerPage: 5,
        search: '',
      headers: [
          { text: 'Alerta', value: 'nombreAlerta' },
          { text: 'Tiempo', value: 'tiempo' },
          { text: 'Eliminar', value: 'actions', sortable: false },
          { text: 'Detalle alerta', value: 'detalleAlerta', sortable: false },
          { text: '', value: 'data-table-expand' },
        ],
      map2: '',
      dialogMapa: true,
      
  }),
  components: {
  },
  methods: {
    ...mapActions('app', ['changeAlerta', 'changeFinca', 'changeUser']),
    mostrarOpciones(){ 
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapa){ lc[0].style.visibility = 'hidden'; this.dialogMapa = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapa = true; }
    },
    deleteItem(nombreClicked){ 
      this.itemActual = nombreClicked.notification.key;
      this.dialog = true;
    },
    
    clickAlerta(nombreClicked){
      this.changeAlerta(nombreClicked.alerta); 
      router.push('/detalle-alerta').catch(err => {});
    },
    eliminarNotificacion() {
      this.dialog = false;    
      classMethods.getNotificacionMethods().deleteNotification(this.itemActual).then((result) =>{
          for (var k=0;k<this.items.length;k++){
            if(this.itemActual === this.items[k].notification.key)
             this.items.splice(k, 1);
          }
        }).catch((error) => {
          /* this.colorSnackbar = "error";
           this.textSnackbar = 'Error al eliminar la notificacion. Por favor inténtelo otra vez';
           this.snackbar = true;*/
        });  
     
    },
    checkAlerts(){
      classMethods.getFincaMethods().listLands().then((resultLands) =>{
      if(resultLands !== null){
      resultLands.forEach(function(childResultLands) {  
          var fincaKey = childResultLands.key;
          classMethods.getPivotMethods().listPivots(fincaKey).then((resultPivots) =>{
            if(resultPivots !== null){
             resultPivots.forEach(function(childResultPivots) {       
               var pivot = childResultPivots.nombre;
               var pivotKey = childResultPivots.key;
  
               classMethods.getDispositivoMethods().listDevices(pivotKey).then((resultDevices) =>{
                 if(resultDevices !== null){
                    resultDevices.forEach(function(childResultDevices) {       
                       var keyDispositivo = childResultDevices.key; 
                       var idDispositivo = childResultDevices.id;
                       var dispositivoLocalizacion = childResultDevices.localizacion;
                       var tipo = childResultDevices.tipo;
                       if(tipo === 'GPS'){
                         
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
                               if(alertaDispositivo === keyDispositivo){
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
                       else if(tipo === 'Temperatura'){
                         var temperatureDevice = childResultDevices.temperatura;
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
                             if(alertaDispositivo === keyDispositivo){ 
                               let current_datetime = new Date();
                               var time = current_datetime.toISOString();
                               if(alertaUltimaNotificacion === '' || ((Date.parse(time)-Date.parse(alertaUltimaNotificacion))/60000)>=alertaTiempo){
                                 
                                 if(opcionAlerta === "Dentro del rango"){
                    if(temperatureDevice >= alertaDatos[0] && temperatureDevice <= alertaDatos[1]){
                    var notificacion = new Notificacion("",temperatureDevice, time, alertaKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                       var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       }).catch((error) => {
   	                
                       });
                    }
                  }
                  else if(opcionAlerta === "Fuera del rango"){
                    if(temperatureDevice < alertaDatos[0] || temperatureDevice > alertaDatos[1]){
                    var notificacion = new Notificacion("",temperatureDevice, time, alertaKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                       var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       
                       }).catch((error) => {
   	                 
                       });
                    }
                  } 
                             
                               }                            
                             }
                           }
                         });
                       }                       
                      });                        
                    }
                    
                  })
                 }
               });                
             })
           }
          });
       });
      }
     }); 
    },
    
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
               
              var dispositivo = new DispositivoTemperatura(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,temperatureDevice);
              
         classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          });
                     
//COMPROBAR ALERTAS                  
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
                             if(alertaDispositivo === deviceKey){ 
                               let current_datetime = new Date();
                               var time = current_datetime.toISOString();
                               if(alertaUltimaNotificacion === '' || ((Date.parse(time)-Date.parse(alertaUltimaNotificacion))/60000)>=alertaTiempo){
                                 
                                 if(opcionAlerta === "Dentro del rango"){
                    if(temperatureDevice >= alertaDatos[0] && temperatureDevice <= alertaDatos[1]){
                    var notificacion = new Notificacion("",temperatureDevice, time, alertaKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                       var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       }).catch((error) => {
   	                
                       });
                    }
                  }
                  else if(opcionAlerta === "Fuera del rango"){
                    if(temperatureDevice < alertaDatos[0] || temperatureDevice > alertaDatos[1]){
                    var notificacion = new Notificacion("",temperatureDevice, time, alertaKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                       var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       
                       }).catch((error) => {
   	                 
                       });
                    }
                  } 
                             
                               }
                             
                             }
                           }
                         });
                       }
                       
                       }); 
                     }); 
               }); 
        }
     }); 
    },
    async checkMeasurementsGps(idDevice: string){

          var map = this.map2;
          var updated = await classMethods.getMedidaMethods().checkDeviceMeasurement(idDevice).then((result) =>{                              
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
                       
                       var positions = JSON.parse(resultDispositivo.posiblesLocalizaciones); 
                      
                       var localizacionActualDispositivo = resultDispositivo.localizacion;
                       var coordenadasActualesDispositivo;
                       L.geoJSON( L.geoJSON(JSON.parse(localizacionActualDispositivo[0])).toGeoJSON(), {
                         onEachFeature: function (feature, layer) {
                           coordenadasActualesDispositivo = feature.geometry.coordinates;
                         },
                       });
                       
                       
                       classMethods.getPivotMethods().pivotInformation(pivotDispositivo).then((result) =>{
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
                           else {
              latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[0].lat, coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(coordenadaPivot.getLatLngs()[1].lat, coordenadaPivot.getLatLngs()[1].lng);
                           }
                           
                           var p;
                           var punto1;
                           var punto2;
                           
                           classMethods.getFincaMethods().landInformation(fincaDispositivo).then((result) =>{
                             if(result !== null){ 
                             var localizacionFinca = result.localizacion;
                             var coordenadaFinca;
                             L.geoJSON( L.geoJSON(JSON.parse(localizacionFinca[0])).toGeoJSON(), {
                               onEachFeature: function (feature, layer) {
                                 coordenadaFinca = layer;
                               },
                             });        


                             var puntoDevice = L.latLng(locationDevice[0], locationDevice[1]);
                             if(tipoPivot === "lineal"){
                           p = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
                           punto1=L.latLng(p[0].x, p[0].y);
                           punto2=L.latLng(p[1].x, p[1].y);
                           p=punto2;
                             }
                             else{
                           p = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
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
                             if(alertaDispositivo === deviceKey){ 
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
                 pivotLocalizacion.forEach(function(element,index) {
                    var myStyle = {
                       "color": 'blue',
                       "weight": 5,
                       "opacity": 1
                    };
                    L.geoJSON(JSON.parse(element), {
                     style: myStyle
                    }).addTo(map);              
                 }) 
var pivot = new Pivot(pivotDispositivo,nombrePivot, tipoPivot, pivotLocalizacion, fincaDispositivo);
classMethods.getPivotMethods().updatePivot(pivot).then((result) =>{
          }).catch((error) => { 	     
          });
//UPDATE TODOS LOS DISPOSITIVOS DEL PIVOT
classMethods.getDispositivoMethods().listDevices(pivotDispositivo).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var nombreDispositivo = childResult.nombre;
          var tipoDispositivo = childResult.tipo;
          if(tipoDispositivo === 'GPS'){
            var idDispositivo = childResult.id;
            var fincaDispositivo = childResult.finca;
            var pivotDispositivo = childResult.pivot;//JSON.parse(
            var dispositivoPositions = childResult.posiblesLocalizaciones;
console.log(dispositivoPositions);
            var deviceKey = childResult.key;
            dispositivoLocalizacion.forEach(function(element,index) { 
                L.geoJSON(JSON.parse(element)).addTo(map);
            }) 
            var dispositivo = new DispositivoGps(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,dispositivoPositions);
              
         classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          }); 
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
                 return true;  
               } 
               return false;               
      }); 
      return updated;
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
  ...mapGetters('app', ['getAvatarUsuario']),
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
   }).setView([0, 0], 1);


//https://github.com/hallahan/LeafletPlayback
//https://libraries.io/github/noerw/leaflet-playback
//https://www.npmjs.com/package/leaflet-play
//https://github.com/linghuam/Leaflet.TrackPlayBack


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
 //  lc[0].style.visibility = 'hidden';
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
   
   L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
     }).addTo(this.map2);
   //   var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
  var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);
  var results = L.layerGroup().addTo(this.map2);
  searchControl.on('results', function (data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });

   
  },
  beforeMount () {
  this.changeUser(true); 
  window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }

  this.checkAlerts();
     var t = this; 
     var items = this.items;
     classMethods.getNotificacionMethods().listNotification().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var medida = childResult.medida; 
          var tiempo = childResult.tiempo; 
          var keyAlert = childResult.alerta; 
          var keyNotification = childResult.key;

          classMethods.getAlertaMethods().alertInformation(keyAlert).then((result) =>{
            if(result !== null){ 
               var nombre = result.nombre;         
               items.push( { nombreAlerta: nombre ,medida: medida ,tiempo: tiempo , icon: 'mdi-bell', notification: childResult, alerta: result});
            }
          });
       }); 
     }
   });    
     
     classMethods.getFincaMethods().listLands().then((result) =>{
      if(result !== null){
       var map = this.map2;
       var onPolyClick = this.changeFinca;
       var groupLayers = [];
       var layers = []; 
       result.forEach(function(childResult) {       
          var finca = childResult.nombre;
          var fincaKey = childResult.key;          
          var localizacion = childResult.localizacion;  
                      
          L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
            onEachFeature: function (feature, layer) {
               groupLayers.push(layer);       
             },
          });
          layers.push(childResult);
          localizacion.forEach(function(element,index) {
            var myStyle = {
              "color": 'red',
              "weight": 5,
              "opacity": 0.65
            };
            L.geoJSON(JSON.parse(element), {
               style: myStyle
            }).addTo(map);            
          }) 
          classMethods.getPivotMethods().listPivots(fincaKey).then((result) =>{
            if(result !== null){            
            result.forEach(function(childResult) {  
               var pivot = childResult.nombre;
               var pivotKey = childResult.key;
               var localizacionPivot = childResult.localizacion;   
                                               
               var updated = false;
               classMethods.getDispositivoMethods().listDevices(pivotKey).then((result) =>{               
                   if(result !== null){ 
                     var devices = result.length;                     
                     var SumDevices = 0;
                     result.forEach(async function(childResult) {
                        SumDevices = SumDevices + 1;
                       var keyDispositivo = childResult.key; 
                       var idDispositivo = childResult.id;
                       var localizacionDevice = childResult.localizacion;
                       var tipo = childResult.tipo;
    
                       if(tipo === 'GPS'){
                          updated = await t.checkMeasurementsGps(idDispositivo);
                          //updated = await FunctionsUtils.checkMeasurementsGps(idDispositivo);
                          //console.log(updated);
                       }
                       else if(tipo === 'Temperatura'){
                         t.checkMeasurementsTemperatura(idDispositivo);                          
                       }
                       if(!updated){                      
                         localizacionDevice.forEach(function(element,index) { 
                             L.geoJSON(JSON.parse(element)).addTo(map);
                         }) 
                               
                         if(SumDevices == devices){
                         localizacionPivot.forEach(function(element,index) {
                           var myStyle = {
                             "color": 'blue',
                             "weight": 5,
                             "opacity": 1
                           };
                          L.geoJSON(JSON.parse(element), {
                           style: myStyle
                          }).addTo(map);              
                         }) 
                         }
                       }                       
                     })         
                     if(devices == 0){ 
                         localizacionPivot.forEach(function(element,index) {
                           var myStyle = {
                             "color": 'blue',
                             "weight": 5,
                             "opacity": 1
                           };
                          L.geoJSON(JSON.parse(element), {
                           style: myStyle
                          }).addTo(map);              
                         }) 
                     } 
                   }
                 });               
            })
           }
         });

       }); 

        map.eachLayer(function(layer) {
         if (layer instanceof L.Polygon) {
           layer.on('click', function (e) {  
             for( var i = 0; i < groupLayers.length; i++){
            
               if(FunctionsUtils.comparePolygon(groupLayers[i].getLatLngs()[0],layer.getLatLngs()[0])){
                  map.fitBounds(layer.getBounds());
                 // onPolyClick(layers[i]);
                 // router.push('/detalle-finca');        
               }
             }     
           });
           layer.on('dblclick', function (e) {  
             for( var i = 0; i < groupLayers.length; i++){
             console.log(layer.getLatLngs()[0]);
               if(FunctionsUtils.comparePolygon(groupLayers[i].getLatLngs()[0],layer.getLatLngs()[0])){
                  onPolyClick(layers[i]);
                  router.push('/detalle-finca').catch(err => {});       
               }
             }     
           });
         }                  
       })
       
       if(groupLayers.length > 0){
         var group = new L.featureGroup(groupLayers);
         map.fitBounds(group.getBounds());
       }             
      }
     }); 
  }
};
</script>

<style lang="scss" module>
</style>
