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

    <v-radio-group v-model="tipo" :mandatory="false">
      <v-radio label="Circular" value="circular"></v-radio>
      <v-radio label="Lineal" value="lineal"></v-radio>
    </v-radio-group>

     
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
              </v-layout>   </div>
    </v-col>   
     </v-row>
 </div> 
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { mapActions, mapGetters } from 'vuex';
import {router} from '../../router';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain.js';
import {Spain_MapasrasterIGN} from '../../LeafletSpain.js';
import {Spain_IGNBase} from '../../LeafletSpain.js';
import {Spain_Catastro} from '../../LeafletSpain.js';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain.js';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import {Pivot} from '../../Clases/Pivot';
import {FactoryAPI} from '../../FactoryAPI';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'AltaPivot',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',
      tipo: 'lineal',
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
      map2: '',
      localizacion: [],
      isLoading: false,
      pivot:[],
      coorFinca: '',
      groupLayer:[],
      coordenadaFinca:0,
      dialogMapaOptions: true,
      iconPivot:'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FmarkerDevice.png?alt=media&token=88ede691-a2a8-40ef-8a88-05cd62eef8bd',
  }; 
  },

  methods: {
  ...mapActions('app', ['changeUser']),
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
    onSubmit() {
       this.isLoading = true;

       var pivotLocalizacion = [];
        var layers = [];
        this.map2.eachLayer(function(layer) {
          if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
            layers.push(layer); 
          }              
        })
       this.localizacion = layers;
       this.localizacion.forEach(function(element,index) {
          pivotLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })    
         
       if(pivotLocalizacion.length === 0){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
          this.isLoading = false;
       }
       else{
        var p1 = L.latLng(this.localizacion[0].getLatLngs()[0].lat, this.localizacion[0].getLatLngs()[0].lng);
        var p2 = L.latLng(this.localizacion[0].getLatLngs()[1].lat, this.localizacion[0].getLatLngs()[1].lng);  
       if(!FunctionsUtils.pointInLand(p1,this.coordenadaFinca) || !FunctionsUtils.pointInLand(p2,this.coordenadaFinca)){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Localizacion no válida. Por favor seleccione la localizacion del pivot dentro de la finca';
          this.snackbar = true;
         this.isLoading = false;
       }
       else{
         var nombreTierra = this.getFinca.key;
         var pivotNombre = this.nombre;
         var pivotTipo = this.tipo;
         
         var pivot = new Pivot("",pivotNombre, pivotTipo, pivotLocalizacion, nombreTierra,[]);
        FactoryAPI.getFactoryAPI("Firebase").getPivot().createPivot(pivot).then((result) =>{
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Pivot creado correctamente';
          this.snackbar = true;        
         router.push('/detalle-finca');
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear el pivot. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  

      }
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
    ...mapGetters('app', [ 'getFinca']),
    
  },
 mounted() {
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
//   var lc = document.getElementsByClassName('leaflet-control-layers');
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

   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: false,
     drawCircle: false,
     drawPolyline: true,
     deleteLayer: true,
     editMode: false,
     dragMode: false,
     cutPolygon: false,
   });
      this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups
    var t = this;
      var icon = L.icon({
    iconUrl: t.iconPivot,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });

      //DAR STYLE AL CREAR
   this.map2.on('pm:create', e => {
     this.map2.pm.addControls({
       drawPolyline: false,
     });
     e.layer.setStyle(myStyleLine);
    
       var punto1 = L.latLng(e.layer.getLatLngs()[0].lat,e.layer.getLatLngs()[0].lng);
                          var punto2 = L.latLng(e.layer.getLatLngs()[1].lat,e.layer.getLatLngs()[1].lng);
     L.marker(punto1, {
                             icon: icon,
                          }).addTo(map);
                       
                 L.marker(punto2, {
                             icon: icon,
                          }).addTo(map); 
     
   });
      //DEJAR CREAR OTRO PIVOT AL ELIMINAR EL ACTUAL
   this.map2.on('pm:remove', e => {
      if ((e.layer instanceof L.Polyline) && ! (e.layer instanceof L.Polygon)) {
         this.map2.pm.addControls({
            drawPolyline: true,
         });
         this.map2.eachLayer(function (layer) {
                  if (layer instanceof L.Marker)
                     t.map2.removeLayer(layer);
                });
      } 
      else if (e.layer instanceof L.Polygon) {//crearlo con el style y debajo de la linea
         L.geoJSON((this.coorFinca), {
           pane: "pane250",
           style: myStylePolygon
         }).addTo(this.map2);
         //e.layer.pm.disable(); 
      } 
   });
   
     //CREAR FIGURA AL SEGUNDO CLICK 
   this.map2.on('pm:drawstart', ({ workingLayer }) => {    

  workingLayer.on('pm:vertexadded', e => {
    var p = L.latLng(e.latlng.lat, e.latlng.lng);
    if(!FunctionsUtils.pointInLand(p,this.coordenadaFinca)){
       this.map2.pm.Draw.Line._removeLastVertex();
       this.colorSnackbar = "error";
       this.textSnackbar = 'Posición no válida. Por favor, marque una posición dentro de la finca';
       this.snackbar = true;
    }
    else{
      this.pivot.push(p);
      if(this.pivot.length === 2){
        this.pivot = [];
        requestAnimationFrame(() => e.marker._icon.click());
      }
    }
  });
});

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
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });
 
     if(this.getFinca === null) router.push('/finca');
     else{
        if(this.getFinca === null) router.push('/finca');       
        this.localizacion = this.getFinca.localizacion;
        var map = this.map2;
         var layers;
         var t = this;
        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
           layers = layer;
           t.coordenadaFinca = layer;
           // map.setView([feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]], 13);
//map.fitBounds(poly.getBounds(),{maxZoom:12});
           },
        }); 
        this.groupLayer.push(layers);
        var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
        var finca;
        this.localizacion.forEach(function(element,index) {
          var myStyle = {
            "color": 'red',
            "weight": 5,
            "opacity": 0.65
          };
          finca = JSON.parse(element);
          L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);
        })  
        this.coorFinca = finca; 

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
