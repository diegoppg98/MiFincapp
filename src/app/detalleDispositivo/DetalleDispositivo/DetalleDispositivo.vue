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

<v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
        
    <h1 style="color:#2e7d32;" class="mx-1 my-1 text-center">
            Dispositivo:
            <span>{{ nombre }}</span>
          </h1>

<v-container>
            <v-col>
              <v-row>
                <v-layout>
                  <v-btn
                    color="#2e7d32"
                    left
                    class="white--text"
                    @click.stop="dialogOptions = true"
                  >Opciones</v-btn>
                </v-layout>

                <v-layout>
                  <v-btn small rounded @click="mostrarMapa" color="#2e7d32" right>
                    <v-icon color="white">mdi-map-legend</v-icon>
                  </v-btn>
                </v-layout>

 
                <v-dialog v-model="dialogOptions" style="z-index: 9999">
                <v-card outlined>
                <v-container >
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
                  <v-btn
                    color="#2e7d32"
                    block
                    style="width=100%"
                    @click.stop="dialogDatos = true"
                    class="my-4 white--text"
                  >Cambiar Datos</v-btn>

                  <v-btn
                    class="white--text"
                    color="#7d2f2e"
                    block
                    @click.stop="dialog = true"
                  >Eliminar dispositivo</v-btn>
                  </v-col>
      </v-row>
    </v-container>
    </v-card>
                </v-dialog>
              </v-row>
            </v-col>
          </v-container>
          
          <v-card outlined ref="mapaShow" id="mapaShow">
            <div class="d-block" style="height: 350px;" ref="mapa" id="mapa">
              <v-layout v-if="!dialogMapaOptions">
                <v-btn
                  small
                  rounded
                  id="optionButton"
                  class="mx-3 my-5"
                  @click="mostrarOpciones"
                  color="grey"
                >Mostrar Opciones</v-btn>
              </v-layout>
              <v-layout v-if="dialogMapaOptions">
                <v-btn
                  small
                  rounded
                  id="optionButton"
                  class="mx-3 my-5"
                  @click="mostrarOpciones"
                  color="grey"
                >Ocultar Opciones</v-btn>
              </v-layout>
            </div>
          </v-card>
          
      
      <v-card>
      
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
 
    
<v-card-actions>

<v-dialog v-model="dialogDatos" style="z-index: 999" fullscreen hide-overlay transition="dialog-bottom-transition">
            
                <v-card>
                <v-toolbar dark color="#2e7d32">
          <v-btn icon dark @click="dialogDatos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="onSubmit">Guardar</v-btn>
          </v-toolbar-items>
        </v-toolbar>
                  <v-form
      class="my-1"
      dark
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
    >
    <v-text-field
    class="my-1 mx-3 mt-5"
        v-model="nombre"
        :rules="nameRules"
        label="Nombre"
        required
        clearable
      ></v-text-field>
    
    <v-text-field
    class="my-1 mx-3"
        v-model="id"
        label="Identificador"
        required
        disabled
      ></v-text-field>

      <v-text-field
      class="my-1 mx-3"
        v-model="tipo"
        label="Tipo"
        disabled
      ></v-text-field>
      
      <v-text-field
      class="my-1 mx-3"
        v-show="dispositivoSuelo"
        v-model="sueloActual"
        disabled
        label="Suelo Actual"
      ></v-text-field>               
     

      
      
    </v-form> 
                </v-card>
            
          </v-dialog>

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
            color="#2e7d32"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="#7d2f2e"
            text
            @click="eliminarDispositivo"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-card-actions>

     
     </v-col>
      </v-row>
    </v-container>
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
import {DispositivoSuelo} from '../../Clases/Dispositivo';
import {Alerta} from '../../Clases/Alerta';
import {Pivot} from '../../Clases/Pivot';
import {Notificacion} from '../../Clases/Notificacion';
import {FactoryAPI} from '../../FactoryAPI';

/*
CALCULO DISTANCIA
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

*/

//<v-switch v-show="showSwitch" v-model="validUbicacion" class="ma-4" label="Elige ubicación del dispositivo" color="grey"></v-switch>

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
      dialogOptions: false,
      dialogDatos: false,
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
        numberItems: 30,
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
      sueloActual: '',
      dispositivoSuelo: false,
      tiposDispositivos: [
        'GPS',
        'Suelo',
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
      localizacionFinca: [],
      localizacionPivot: [],
      localizacionDispositivo: [],
      isLoading: false,
      dialog: false,
      groupLayer:[],
      dialogMapaOptions: false,
      point1:'',
      medida1:'',
      calculationDistance: false,
      coordPos:'',
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
     /*FactoryAPI.getFactoryAPI("Firebase").getMedida().listMeasurements(this.id,parseInt(val)).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {  
          var medida = childResult.medida;
          var time = childResult.tiempo;
            var msec = Date.parse(time);
            var date = new Date(msec);
            var tiempo = date.toLocaleString();
          var notificada = childResult.notificada;
          var label =medida;/////////////////////////////
          items.push( { medida: medida ,tiempo: tiempo,revisada: notificada, key: childResult.key });  
         })
         /*items.sort(function(a, b){
           if(a.tiempo > b.tiempo) { return -1; }
           if(a.tiempo < b.tiempo) { return 1; }
           return 0;
         })*/
        /*}  
     });*/
    },
    
  },
  methods: {
  ...mapActions('app', ['changeUser','changeDispositivo']), 
  
  mostrarMapa() {
      if (!this.map2) {
        document.getElementById('mapaShow').style.display = 'block';
        const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';

   const mapboxTiles1 = L.tileLayer(
     `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
   );
   
    this.map2 = L.map(this.$refs['mapa'], {
    fullscreenControl: true,
    attributionControl: false,
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
   this.map2.on('fullscreenchange', function () {
          if (map.isFullscreen()) {
            //console.log('entered fullscreen');
          } else {
            document.getElementById('mapaShow').style.display = 'none';
          }
        });
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

        if(this.getDispositivo.tipo === "Suelo"){
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
   
   L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="https://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
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
  
  var lc = document.getElementsByClassName('leaflet-control-layers');
        lc[0].style.visibility = 'hidden';
        
  this.map2.toggleFullscreen();
   var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
  
  var map = this.map2;
  var iconType = this.iconTypes;
  this.localizacionFinca.forEach(function(element,index) {
          var myStyle = {
            "color": 'red',
            "weight": 5,
            "opacity": 0.65
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);
        });
     this.localizacionPivot.forEach(function(element,index) {
          var myStyle = {
            "color": 'blue',
            "weight": 5,
            "opacity": 1
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane450",
             style: myStyle
          }).addTo(map);
        });
        var t = this;

        /* L.geoJSON( L.geoJSON(JSON.parse(t.localizacionPivot[0])).toGeoJSON(), {
                 onEachFeature: function (feature, layer) {
                    var punto1 = L.latLng(feature.geometry.coordinates[1][1],feature.geometry.coordinates[1][0]);
                    var punto2 = L.latLng(feature.geometry.coordinates[0][1],feature.geometry.coordinates[0][0]);
           
                    if(Math.floor(punto1.lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(t.coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(punto1.lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(t.coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
             L.marker(punto2, {
                             icon: icon,
                          }).addTo(map);
             
                           }
                           else {
  L.marker(punto1, {
                             icon: icon,
                          }).addTo(map);
                           }
    
                 },
              });*/
              
        var icon = iconType(this.tipo);
  var iconDevice = L.icon({
    iconUrl: icon,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });
           var t = this;
         this.localizacionDispositivo.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element), {
                   pointToLayer: function (feature, latlng) {
                          return L.marker(latlng, {
                             icon: iconDevice,
                          });
                     }
                }).addTo(map); 
                if(t.tipo == 'GPS')
                  t.calculoPosicion(t.coordPos,t.tipoPivot,t.positions,t.coordenadaPivot,t.coordenadasActualesDispositivo,t.tipo,true);
                else{      
                  FactoryAPI.getFactoryAPI('Firebase').getDispositivo().listDevices(t.getPivot.key).then((result) => {
                    if (result !== null) {
                      result.forEach(function (childResult) {
                        var TipoDispositivo = childResult.tipo;                     
                        if(TipoDispositivo == 'GPS'){
                          var coordenadasDispositivo = '';
                          L.geoJSON( L.geoJSON(JSON.parse(childResult.localizacion[0])).toGeoJSON(), {
                            onEachFeature: function (feature, layer) {
                              coordenadasDispositivo = feature.geometry.coordinates;
                            },
                          });
                          var positions = JSON.parse(childResult.posiblesLocalizaciones); 
                          t.calculoPosicion(t.coordPos,t.tipoPivot,positions,t.coordenadaPivot,coordenadasDispositivo,TipoDispositivo,false);
                        }
                      });
                    }
                  });
                }
        }) 
  
  
        } else {
        document.getElementById('mapaShow').style.display = 'block';
        this.map2.toggleFullscreen();
      }
    },
  
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
  iconTypes(tipoDispositivo){
      switch (tipoDispositivo) {
            case 'GPS':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=b48f592e-2e75-40ab-b5ba-4ee6e1ba70d2';
            case 'Suelo':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Ftemperatura.png?alt=media&token=81cc83fa-b579-42d0-8638-fc4d173b0c6c';
            default:
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=4305b91d-a064-4805-bfcb-ef45084aae52';
        }
    },
  clicked(value) { 
 
 if(this.tipo === 'GPS'){
 
 if (!this.map2) {
        document.getElementById('mapaShow').style.display = 'block';
        const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';

   const mapboxTiles1 = L.tileLayer(
     `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
   );
   
    this.map2 = L.map(this.$refs['mapa'], {
    fullscreenControl: true,
    attributionControl: false,
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
   this.map2.on('fullscreenchange', function () {
          if (map.isFullscreen()) {
            //console.log('entered fullscreen');
          } else {
            document.getElementById('mapaShow').style.display = 'none';
          }
        });
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

        if(this.getDispositivo.tipo === "Suelo"){
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
   
   L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="https://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
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
  
  var lc = document.getElementsByClassName('leaflet-control-layers');
        lc[0].style.visibility = 'hidden';
        
  this.map2.toggleFullscreen();
   var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
  
  var map = this.map2;
  var iconType = this.iconTypes;
  var t = this;
  this.localizacionFinca.forEach(function(element,index) {
          var myStyle = {
            "color": 'red',
            "weight": 5,
            "opacity": 0.65
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);
        });
     this.localizacionPivot.forEach(function(element,index) {
          var myStyle = {
            "color": 'blue',
            "weight": 5,
            "opacity": 1
          };
          L.geoJSON(JSON.parse(element), {
             pane: "pane450",
             style: myStyle
          }).addTo(map);
        });
        
        
        var icon = iconType(this.tipo);
  var iconDevice = L.icon({
    iconUrl: icon,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });
         this.localizacionDispositivo.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element), {
                   pointToLayer: function (feature, latlng) {
                          return L.marker(latlng, {
                             icon: iconDevice,
                          });
                     }
                }).addTo(map);     
        })      
  
        } else {
        document.getElementById('mapaShow').style.display = 'block';
        this.map2.toggleFullscreen();
      }

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

   /* if(this.calculationDistance){
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
    }*/
    var LatLngs = []; LatLngs.push(punto1); LatLngs.push(punto2);
    var LatLng = p;                         
                             
    this.map2.eachLayer(function(layer) { 
          if (layer instanceof L.Marker) {
           //layer.setIcon(blueIcon);
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
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if (this.dialogMapaOptions) {
        lc[0].style.visibility = 'hidden';
        this.dialogMapaOptions = false;
      } else {
        lc[0].style.visibility = 'visible';
        this.dialogMapaOptions = true;
      }
    },
   
   //TAMBIEN PIVOT DE TEMPERATURA
    calculoPosicion(coordPos,tipoPivot,positions,coordenadaPivot,coordenadasActualesDispositivo,tipo,device){   
      if(!coordPos.length == 0){ 
        var pos;
        var punto1;
        var punto2;
        var latlngCenter;   
        var map=this.map2;                                 
        var puntoDevice = L.latLng(coordPos[0],coordPos[1]);
        if(tipoPivot === "lineal"){
          pos = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
          punto1=L.latLng(pos[0].x, pos[0].y);
          punto2=L.latLng(pos[1].x, pos[1].y);
          pos=punto2;    
        }
        else{
          if(Math.floor(coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(coordenadasActualesDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[1].lat, coordenadaPivot.getLatLngs()[1].lng);
          }
          else {
              latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[0].lat, coordenadaPivot.getLatLngs()[0].lng);
          }
          pos = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
          punto1=latlngCenter;
          punto2=pos;
        } 
        var LatLngs = []; LatLngs.push(punto1); LatLngs.push(punto2);
        var LatLng = pos;                        
                          
        if(device){           
          this.map2.eachLayer(function(layer) { 
             if (layer instanceof L.Marker) {
              layer.setLatLng(LatLng);
             }                    
          })
        }
        
        this.map2.eachLayer(function(layer) {
           if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
            layer.setLatLngs(LatLngs); 
           }                       
        })   
      }
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


if (this.map2) {
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
  else
    positions = this.positions;
  }

         var nombreTierra = this.getFinca.key;
         var nombrePivot = this.getPivot.key;
         var dispositivoNombre = this.nombre;
         var dispositivoId = this.id;
         var dispositivoSuelo= this.sueloActual;
         
         this.positions = positions;
         
         var dispositivo = null;
         
         if(dispositivoTipo === 'GPS'){
           dispositivo = new DispositivoGps(this.getDispositivo.key,dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,JSON.stringify(positions),[]);
        }
        if(dispositivoTipo === 'Suelo'){
          if(!this.getDispositivo.suelo) dispositivoSuelo = "";
           dispositivo = new DispositivoSuelo(this.getDispositivo.key,dispositivoNombre, dispositivoId, dispositivoTipo, dispositivoLocalizacion, nombreTierra, nombrePivot,dispositivoSuelo,[]);
        } 

      if(dispositivo !== null){ 
          FactoryAPI.getFactoryAPI("Firebase").getDispositivo().updateDevice(dispositivo).then((result) =>{
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
         FactoryAPI.getFactoryAPI("Firebase").getAlerta().listAlerts().then((resultAlerta) =>{
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
                            FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
                            var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           });
                       }).catch((error) => {   	                 
                       });
                             }
                           }
                            else if(opcionAlerta === "Salga de la zona"){
                             if(!inZone){ 
                             var notificacion = new Notificacion("",dispositivoLocalizacion, time, alertaKey);
                             FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
                             var alerta = new Alerta(alertaKey,alertaNombre, alertaTipo, alertaDatos, opcionAlerta, alertaTiempo, time, alertaMute, nombreTierra, nombrePivot, alertaDispositivo);
                         FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(alerta).then((result) =>{
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
       FactoryAPI.getFactoryAPI("Firebase").getDispositivo().deleteDevice(this.getDispositivo).then((result) =>{
          router.push('/detalle-pivot');
          }).catch((error) => {
   	     this.colorSnackbar = "error";
   	     this.timeoutSnackbar = 4000;
             this.textSnackbar = error;
             this.snackbar = true;
          });       
    },
    
    
     checkMeasurementsGps(idDevice: string){

          var map = this.map2;
          FactoryAPI.getFactoryAPI("Firebase").getMedida().checkDeviceMeasurement(idDevice).then((result) =>{                              
               //if items not empty, update position of pivot and device, and check if any alert is fulfilled                   
               if(result !== null && result.length !== 0){
               var locationDevice = result[0].medida;
               var deviceId = result[0].id;
                  FactoryAPI.getFactoryAPI("Firebase").getDispositivo().checkDeviceId(deviceId).then((result) =>{
                     var userKey = result.user;
                     var deviceKey = result.device;
                                                             
                     FactoryAPI.getFactoryAPI("Firebase").getDispositivo().deviceInformation(deviceKey).then((resultDispositivo) =>{
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
                       
                       
                       FactoryAPI.getFactoryAPI("Firebase").getPivot().pivotInformation(pivotDispositivo).then((result) =>{
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
                           
                           
                             if(result !== null){ 

     


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
var pivot = new Pivot(pivotDispositivo,nombrePivot, tipoPivot, pivotLocalizacion, fincaDispositivo,[]);
FactoryAPI.getFactoryAPI("Firebase").getPivot().updatePivot(pivot).then((result) =>{
          }).catch((error) => { 	     
          });
//UPDATE TODOS LOS DISPOSITIVOS DEL PIVOT
FactoryAPI.getFactoryAPI("Firebase").getDispositivo().listDevices(pivotDispositivo).then((result) =>{
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
            var dispositivo = new DispositivoGps(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, dispositivoLocalizacion, fincaDispositivo, pivotDispositivo,dispositivoPositions,[]);
              
         FactoryAPI.getFactoryAPI("Firebase").getDispositivo().updateDevice(dispositivo).then((result) =>{
          }).catch((error) => { 	     
          }); 
          }
       })
    }
   });
                            
                              
                          }
                          }
                       });                  
                     } 
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

    ...mapGetters('app', [ 'getFinca', 'getPivot', 'getDispositivo']),
  },
mounted() {
   

     //this.changeUser(true);  
  
     if(this.getFinca === null || this.getPivot === null || this.getDispositivo === null) router.push('/finca');
     else{

        this.localizacionFinca = this.getFinca.localizacion;
        var layers;
        var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacionFinca[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
             layers = layer;
             t.coordenadaFinca = layer;
           },
        });
       
                this.groupLayer.push(layers);
        

        this.localizacionPivot = this.getPivot.localizacion;
        this.tipoPivot = this.getPivot.tipo;
        this.coordPos = this.getPivot.posActual;
        
        var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacionPivot[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
          t.coordenadaPivot = layer;
          t.coordenadaMarker = L.latLng(feature.geometry.coordinates[1][1], feature.geometry.coordinates[1][0]); 
          },
        });

        this.nombre = this.getDispositivo.nombre;
        this.id = this.getDispositivo.id;
        this.tipo = this.getDispositivo.tipo;
        this.localizacionDispositivo = this.getDispositivo.localizacion; 

        if(this.getDispositivo.tipo === "Suelo"){
          if(this.getDispositivo.suelo){
             this.sueloActual = this.getDispositivo.suelo;
             this.dispositivoSuelo = true;
          }
        }      
        else if (this.getDispositivo.tipo === "GPS"){          
            this.positions = JSON.parse(this.getDispositivo.posiblesLocalizaciones); 
          }

        var t = this;
        
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacionDispositivo[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
                  t.coordenadasActualesDispositivo = feature.geometry.coordinates;
                  t.localizacion.push(layer);
           },
        });
         
        /*localizacion.forEach(function(element,index) {
           t.marker = L.geoJSON(JSON.parse(element)).addTo(map);           
        })  */
         
        var items = this.items;
        var position = this.positions;
        
        FactoryAPI.getFactoryAPI("Firebase").getMedida().listMeasurements(this.id,this.numberItems).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {  
          var medida = childResult.medida;
          var time = childResult.tiempo;
            var msec = Date.parse(time);
            var date = new Date(msec);
            var tiempo = date.toLocaleString();
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
#optionButton {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0px;
  right: 0px;
  background-color: white;
  border-radius: 5px;
  border-color: gray;
  border-style: solid;
  border-width: 1px 1px 1px 1px;
  opacity: 0.4;
  text-align: center;
  z-index: 500;
}
#mapaShow {
  display: none;
}
</style>
