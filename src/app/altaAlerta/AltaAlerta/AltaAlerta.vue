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
     <v-card
      class="mx-10 my-12"
      outlined
      v-show="dispositivoTemperatura"
   >       
    <v-subheader>Temperatura</v-subheader>
    <v-card-text>
      <v-row>
        <v-col class="px-4">
          <v-range-slider
            v-model="rangeTemperatura"
            :max="maxTemperatura"
            :min="minTemperatura"
            hide-details
            class="align-center"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="rangeTemperatura[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                suffix="°C"
                style="width: 60px"
                @change="$set(rangeTemperatura, 0, $event)"
                readonly
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value="rangeTemperatura[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                suffix="°C"
                style="width: 60px"
                @change="$set(rangeTemperatura, 1, $event)"
                readonly
              ></v-text-field>
            </template>
          </v-range-slider>
        </v-col>
      </v-row>
    </v-card-text>

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
import {classMethods} from '../../classMethods';

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
      temperatura: 'Dentro del rango',
      minTemperatura: -50,
      maxTemperatura: 90,
      rangeTemperatura: [-20, 70],
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
      opcionesTemperatura: [
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
      dispositivoTemperatura: false,
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
      dialogMapa: true,
    };
  },

  methods: {
    mostrarOpciones(){ 
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapa){ lc[0].style.visibility = 'hidden'; this.dialogMapa = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapa = true; }
    },
     fincaChanged(){
     this.listaPivots = [];
      var pivots = this.listaPivots;
      classMethods.getPivotMethods().listPivots(this.finca.key).then((result) =>{
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
      classMethods.getDispositivoMethods().listDevices(this.pivot.key).then((result) =>{
        if(result !== null){
         result.forEach(function(childResult) {       
            var dispositivo = childResult.nombre;
            dispositivos.push({ text: dispositivo , value: childResult }); 
         }); 
       }
     }); 
     },
     dispositivoChanged(){ 
       this.dispositivoGps = true; 
          this.tipo = this.dispositivo.tipo;
          if(this.tipo === 'GPS'){   
         
          this.dispositivoTemperatura = false;               
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
               var dispositivo;
               localizacionDispositivo.forEach(function(element,index) {
               dispositivo = JSON.parse(element);
               L.geoJSON(JSON.parse(element)).addTo(map);
               })  
               this.coorDispositivo = dispositivo;   
        }
        else if(this.tipo === 'Temperatura'){
          this.dispositivoGps = false;
          this.dispositivoTemperatura = true;
       }  
   },
   
     onSubmit() {
     var rang=this.rangeTemperatura;
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
          
      classMethods.getAlertaMethods().createAlert(alerta).then((result) =>{
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
                            classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           }); 
                       }).catch((error) => {   	                 
                       });
                             }
                           }
                            else if(alertaOpcion === "Salga de la zona"){
                             if(!inZone){
                             var notificacion = new Notificacion("",dispositivoLocation, time, alertKey);
                             classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
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
         
         router.push('/alerta');
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear la alerta. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  
       }
       }
       else if(this.tipo === 'Temperatura'){
         var nombreTierra = this.finca.key;
         var nombrePivot = this.pivot.key;
         var NombreDispositivo = this.dispositivo.key;
         var alertaNombre = this.nombre;
         var alertaDatos = this.rangeTemperatura; 
         var alertaOpcion = this.temperatura;
         var alertaTipo = this.tipo;
         var alertaTiempo = this.slider;

         var alerta = new Alerta("",alertaNombre, alertaTipo, alertaDatos, alertaOpcion, alertaTiempo, "", false, nombreTierra, nombrePivot, NombreDispositivo);
      classMethods.getAlertaMethods().createAlert(alerta).then((result) =>{
      var alertKey = result;
         this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta creada correctamente';
         this.snackbar = true;
         //COMPROBAR SI SE CUMPLE LA ALERTA         

          //NO HACE FALTA MIRAR tiempoUltimaAlerta ni tiempoAlerta ni silenced PORQUE AL CREARSE NUNCA TENDRA VALOR
         
                  var nombreDispositivo = this.dispositivo.nombre;
                  var idDispositivo = this.dispositivo.id;
                  var dispositivotemp = this.dispositivo.temperatura;   
                 if(dispositivotemp !== ""){                                                   
                  let current_datetime = new Date();
                  var time = current_datetime.toISOString();   
                  alerta.tiempoUltimaAlerta = time;
                  alerta.key = alertKey;        
                  if(alertaOpcion === "Dentro del rango"){
                    if(dispositivotemp >= alertaDatos[0] && dispositivotemp <= alertaDatos[1]){
                    var notificacion = new Notificacion("",dispositivotemp, time, alertKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
                           }).catch((error) => {
                           }); 
                       }).catch((error) => {   	                 
                       });
                    }
                  }
                  else if(alertaOpcion === "Fuera del rango"){
                    if(dispositivotemp < alertaDatos[0] || dispositivotemp > alertaDatos[1]){
                    var notificacion = new Notificacion("",dispositivoLocation, time, alertKey);
                       classMethods.getNotificacionMethods().createNotification(notificacion).then((result) =>{
                         classMethods.getAlertaMethods().updateAlert(alerta).then((result) =>{
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
             {
             attribution:
              '&copy; <a href="https://www.mapbox.com/feedback/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
             }
             );
             
             this.map2 = L.map(this.$refs['mapa'], {
               fullscreenControl: true,
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
         L.geoJSON((this.coorDispositivo), {
           pane: "pane450"
         }).addTo(this.map2);
      } 
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
     classMethods.getFincaMethods().listLands().then((result) =>{
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
</style>
