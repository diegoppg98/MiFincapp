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
      
    <v-card flat color="transparent">
    <v-subheader>Minutos mínimos entre avisos</v-subheader>
    <v-card-text>
      <v-row>
        <v-col class="pr-4">
          <v-slider
            v-model="slider"
            class="align-center"
            :max="maxTiempo"
            :min="minTiempo"
            hide-details
          >
            <template v-slot:append>
              <v-text-field
                v-model="slider"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                readonly
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
    </v-card-text>
    </v-card>

<v-row justify="end">
   <v-btn
      :disabled="!valid"
      :loading="isLoading"
      color="#2e7d32"
      class="mr-4 white--text"
      @click="onSubmit"
   >
      Guardar
   </v-btn>
    </v-row>
  </v-form> 
  </v-col>
    <v-col :cols="posMap">
     <v-card
      outlined
      v-show="dispositivoSuelo"
   >       
    <v-subheader>Valor</v-subheader>
    <v-card-text>
      <v-row>
        <v-col class="px-4">
          <v-range-slider
            v-model="rangeSuelo"
            :max="maxSuelo"
            :min="minSuelo"
            hide-details
            class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="rangeSuelo[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(rangeSuelo, 0, $event)"
                readonly
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="rangeSuelo[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(rangeSuelo, 1, $event)"
                readonly
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-col>
      </v-row>
    </v-card-text>

      <v-select
        v-model="suelo"
        :items="opcionesSuelo"
        :rules="[v => !!v || 'opcion es requerida']"
        label="Suelo opcion"
        style="z-index: 999"
      ></v-select>
   </v-card>

   <v-card
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
    </v-col>
     </v-row>
</div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';
import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain.js';
import {Spain_MapasrasterIGN} from '../../LeafletSpain.js';
import {Spain_IGNBase} from '../../LeafletSpain.js';
import {Spain_Catastro} from '../../LeafletSpain.js';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain.js';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
import {Alerta} from '../../Clases/Alerta';
import {Notificacion} from '../../Clases/Notificacion';
import {FactoryAPI} from '../../FactoryAPI';

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
      suelo: 'Dentro del rango',
      minSuelo: -50,
      maxSuelo: 90,
      rangeSuelo: [-20, 70],
      minTiempo: 1,
      maxTiempo: 120,
      slider: 5,
      gps: 'Entre en la zona',
      tipo: '',
      select: null,
      listaFincas: [
      ],
      listaPivots: [
      ],
      listaDispositivos: [
      ],
      opcionesSuelo: [
      'Dentro del rango',
      'Fuera del rango',
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
      dispositivoSuelo: false,
      dispositivoGps: true,
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      lazy: false,
      isLoading: false,
      map2: '',
      localizacion: [],
      coorFinca: '',
      coorPivot: '',
      coorDispositivo: '',
      fincaElement: '',
      dialogMapaOptions: true,
    };
  },

  methods: {
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
     fincaChanged(){
     this.listaPivots = [];
      var pivots = this.listaPivots;
      FactoryAPI.getFactoryAPI("Firebase").getPivot().listPivots(this.finca.key).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {       
            var pivot = childResult.nombre;         
            pivots.push({ text: pivot , value: childResult });
         }); 
       }
      }); 
     },
     pivotChanged(){
     this.listaDispositivos = [];
      var dispositivos = this.listaDispositivos;
     
      FactoryAPI.getFactoryAPI("Firebase").getDispositivo().listDevices(this.pivot.key).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {       
            var dispositivo = childResult.nombre;
            dispositivos.push({ text: dispositivo , value: childResult }); 
         }); 
       }
     }); 
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
     dispositivoChanged(){ 
       this.dispositivoGps = true; 
        
          this.tipo = this.dispositivo.tipo;
          
          if(this.tipo === 'GPS'){   
         
         var t = this;
                this.map2.eachLayer(function (layer) {
                  if (layer instanceof L.Rectangle || layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Marker)
                     t.map2.removeLayer(layer);
                });
                
          this.dispositivoSuelo = false;               
          if(this.finca === null) router.push('/alerta');
              var localizacionFinca = this.finca.localizacion;
              var map = this.map2;
              var finca;
              var fincaJson;
              L.geoJSON( L.geoJSON(JSON.parse(localizacionFinca[0])).toGeoJSON(), {
                onEachFeature: function (feature, layer) {
                   map.fitBounds(layer.getBounds());
                },
              });
              localizacionFinca.forEach(function(element,index) {
              var myStyle = {
               "color": 'red',
               "weight": 5,
               "opacity": 0.65
              };
              finca = JSON.parse(element);
              fincaJson = element;
           L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);
              })  
              this.coorFinca = finca; 
              this.fincaElement = fincaJson;
 
                if(this.pivot === null) router.push('/alerta');
                var localizacionPivot = this.pivot.localizacion;
                var map = this.map2;
                var pivot;
                localizacionPivot.forEach(function(element,index) {
                var myStyle = {
          "color": 'blue',
          "weight": 5,
          "opacity": 1
          };
                pivot = JSON.parse(element);
                L.geoJSON(JSON.parse(element), {
             pane: "pane450",
             style: myStyle
          }).addTo(map);
             })  
             this.coorPivot = pivot; 

               if(this.dispositivo === null) router.push('/alerta');
               var localizacionDispositivo = this.dispositivo.localizacion;
               var map = this.map2;
               var t = this;
                var coordenadasDispositivo = '';
                          L.geoJSON( L.geoJSON(JSON.parse(localizacionDispositivo[0])).toGeoJSON(), {
                            onEachFeature: function (feature, layer) {
                              coordenadasDispositivo = feature.geometry.coordinates;
                            },
                          });
                 var positions = JSON.parse(this.dispositivo.posiblesLocalizaciones); 
                 var coordenadaPivot = '';
                  L.geoJSON( L.geoJSON(JSON.parse(this.pivot.localizacion[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
          coordenadaPivot = layer;
          },
        });
               var iconType = this.iconTypes;
               var icon = iconType(this.dispositivo.tipo);
               var dispositivo;
               var iconDevice = L.icon({
    iconUrl: icon,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });
               localizacionDispositivo.forEach(function(element,index) {
               dispositivo = JSON.parse(element);
               L.geoJSON(JSON.parse(element), {
                   pointToLayer: function (feature, latlng) {
                          return L.marker(latlng, {
                             icon: iconDevice,
                          });
                     }
                }).addTo(map);
               
                   t.calculoPosicion(t.pivot.posActual,t.pivot.tipo,positions,coordenadaPivot,coordenadasDispositivo,t.dispositivo.tipo);
               })  
               this.coorDispositivo = dispositivo;  
               
        }
        else if(this.tipo === 'Suelo'){
          this.dispositivoGps = false;
          this.dispositivoSuelo = true;
       }  
   },
   
   
   
   
    calculoPosicion(coordPos,tipoPivot,positions,coordenadaPivot,coordenadasActualesDispositivo,tipo){   
      if(!coordPos.length == 0){ 
        var pos;
        var punto1;
        var punto2;
        var latlngCenter;                                    
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
        if(tipo == 'GPS'){           
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
     var rang=this.rangeSuelo;
       this.isLoading = true;   
       if(this.tipo === 'GPS'){
       var tierraLocalizacion = [];
        var layers = []; 
        var coordFinca = this.fincaElement;
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Rectangle && JSON.stringify(layer.toGeoJSON())!== coordFinca) {     
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
         var nombreTierra = this.finca.key;
         var nombrePivot = this.pivot.key;
         var NombreDispositivo = this.dispositivo.key;
         var alertaNombre = this.nombre;
         var alertaOpcion = this.gps;
         var alertaTipo = this.tipo;  
         var alertaTiempo = this.slider;

          var alerta = new Alerta("",alertaNombre, alertaTipo, tierraLocalizacion, alertaOpcion, alertaTiempo, "", false, nombreTierra, nombrePivot, NombreDispositivo);
          
      FactoryAPI.getFactoryAPI("Firebase").getAlerta().createAlert(alerta).then((result) =>{
         this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta creada correctamente';
         this.snackbar = true;
         var alertKey = result;
     
         //VER SI SECUMPLE LA ALERTA         
                  var nombreDispositivo = this.dispositivo.nombre;
                  var idDispositivo = this.dispositivo.id;
                  var dispositivoLocation = this.dispositivo.localizacion;                                                      
                               
                  L.geoJSON( L.geoJSON(JSON.parse(tierraLocalizacion[0])).toGeoJSON(), {
                    onEachFeature: function (feature, layer) {
                    var layerAlerta = layer;
                     L.geoJSON( L.geoJSON(JSON.parse(dispositivoLocation)).toGeoJSON(), {
                         onEachFeature: function (feature, layer) {
                           var coordenadasActualesDispositivo = feature.geometry.coordinates;
                           var punto=L.latLng(coordenadasActualesDispositivo[1],coordenadasActualesDispositivo[0]);
                           var inZone = FunctionsUtils.pointInLand(punto, layerAlerta);
                           let current_datetime = new Date();
                           var time = current_datetime.toISOString();
                           alerta.tiempoUltimaAlerta = time;
                           alerta.key = alertKey;
                           if(alertaOpcion === "Entre en la zona"){
                             if(inZone){ 
                             var notificacion = new Notificacion("",dispositivoLocation, time, alertKey);
                            FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
                         FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           }); 
                       }).catch((error) => {   	                 
                       });
                             }
                           }
                            else if(alertaOpcion === "Salga de la zona"){
                             if(!inZone){
                             var notificacion = new Notificacion("",dispositivoLocation, time, alertKey);
                             FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
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
         
         router.push('/alerta');
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear la alerta. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  
       }
       }
       else if(this.tipo === 'Suelo'){
         var nombreTierra = this.finca.key;
         var nombrePivot = this.pivot.key;
         var NombreDispositivo = this.dispositivo.key;
         var alertaNombre = this.nombre;
         var alertaDatos = this.rangeSuelo; 
         var alertaOpcion = this.suelo;
         var alertaTipo = this.tipo;
         var alertaTiempo = this.slider;

         var alerta = new Alerta("",alertaNombre, alertaTipo, alertaDatos, alertaOpcion, alertaTiempo, "", false, nombreTierra, nombrePivot, NombreDispositivo);
      FactoryAPI.getFactoryAPI("Firebase").getAlerta().createAlert(alerta).then((result) =>{
      var alertKey = result;
         this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta creada correctamente';
         this.snackbar = true;
         //COMPROBAR SI SE CUMPLE LA ALERTA         

          //NO HACE FALTA MIRAR tiempoUltimaAlerta ni tiempoAlerta ni silenced PORQUE AL CREARSE NUNCA TENDRA VALOR
         
                  var nombreDispositivo = this.dispositivo.nombre;
                  var idDispositivo = this.dispositivo.id;
                  var dispositivotemp = this.dispositivo.suelo;   
                 if(dispositivotemp !== ""){                                                   
                  let current_datetime = new Date();
                  var time = current_datetime.toISOString();   
                  alerta.tiempoUltimaAlerta = time;
                  alerta.key = alertKey;        
                  if(alertaOpcion === "Dentro del rango"){
                    if(dispositivotemp >= alertaDatos[0] && dispositivotemp <= alertaDatos[1]){
                    var notificacion = new Notificacion("",dispositivotemp, time, alertKey);
                       FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
                         FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           }); 
                       }).catch((error) => {   	                 
                       });
                    }
                  }
                  else if(alertaOpcion === "Fuera del rango"){
                    if(dispositivotemp < alertaDatos[0] || dispositivotemp > alertaDatos[1]){
                    var notificacion = new Notificacion("",dispositivoLocation, time, alertKey);
                       FactoryAPI.getFactoryAPI("Firebase").getNotificacion().createNotification(notificacion).then((result) =>{
                         FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           }); 
                       }).catch((error) => {   	                 
                       });;
                    }
                  }   
                 }                   
        
         router.push('/alerta');
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear la alerta. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  
       }
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
  },
 mounted() {
 this.dispositivoGps = true;
         if (this.map2 && this.map2.remove) {
                this.map2.off();
                this.map2.remove();
             }
             
             const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';
             const mapboxTiles1 = L.tileLayer(
              `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,

             );
             
             this.map2 = L.map(this.$refs['mapa'], {
               fullscreenControl: true,
               attributionControl: false,
             }); 
              
            ///////////////////////////////////////
             
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
      var myStyleLine = {
     "color": 'blue',
      "weight": 5,
      "opacity": 1
   };
   var myStylePolygon = {
     "color": 'red',
      "weight": 5,
      "opacity": 0.65
   };
   var myStyleRectangle = {
     "color": 'blue',
      "weight": 5,
      "opacity": 0.65
   };
   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     editMode: false,
     dragMode: false,
     cutPolygon: false,
   });
      this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups
   
         //DAR STYLE AL CREAR
   this.map2.on('pm:create', e => {
     this.map2.pm.addControls({
       drawRectangle: false,
     });
     e.layer.setStyle(myStyleRectangle);
   });
   
   //DEJAR CREAR OTRO PIVOT AL ELIMINAR EL ACTUAL
   this.map2.on('pm:remove', e => {
       if (e.layer instanceof L.Rectangle && JSON.stringify(e.layer.toGeoJSON())!== this.fincaElement) {//crearlo con el style y debajo de la linea
         this.map2.pm.addControls({ 
            drawRectangle: true,
         });
      } 
      else if (e.layer instanceof L.Polygon) {
         L.geoJSON((this.coorFinca), {
           pane: "pane250",
           style: myStylePolygon
         }).addTo(this.map2);
      } 
      else if ((e.layer instanceof L.Polyline) && ! (e.layer instanceof L.Polygon)) {//crearlo con el style y debajo de la linea
         L.geoJSON((this.coorPivot), {
           pane: "pane450",
           style: myStyleLine
         }).addTo(this.map2);
      } 
      else if (e.layer instanceof L.Marker) {//crearlo con el style y debajo de la linea
         var iconType = this.iconTypes;
      var icon = iconType(this.tipo);
                 var iconDevice = L.icon({
    iconUrl: icon,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });
      L.geoJSON(this.coorDispositivo, {
                   pointToLayer: function (feature, latlng) {
                          return L.marker(latlng, {
                             icon: iconDevice,
                          });
                     }
                }).addTo(this.map2);
      } 
   });

   L.tileLayer.wms('https://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="https://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
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
 this.dispositivoGps = false;
 
 },
  beforeMount () {
  
window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }
     var tierras = this.listaFincas;
     FactoryAPI.getFactoryAPI("Firebase").getFinca().listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {   
          var finca = childResult.nombre;
          tierras.push({ text: finca , value: childResult });
       }); 
     }
   }); 
  }
};
</script>
<style>
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
</style>
