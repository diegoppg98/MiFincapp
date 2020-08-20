<template>
<div>
  <v-app>
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
        clearable
        required
      ></v-text-field>

      <v-text-field
        v-model="tamaño"
        label="Tamaño (opcional)"
        clearable
      ></v-text-field>

      <v-select
        v-model="cultivo"
        :items="tiposCultivos"
        label="Cultivo (opcional)"
        style="z-index: 999"
      ></v-select>
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
    <div style="height: 350px;" ref="mapa" id="mapa"></div>
    </v-col>
     </v-row>
  </v-app>

 </div> 
</template>

<script lang="ts">

import { IPreLoad } from '@/server/isomorphic';
import { mapActions, mapGetters } from 'vuex';
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
import {Finca} from '../../Clases/Finca';
import {classMethods} from '../../classMethods';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'AltaFinca',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',      
      tamaño: '',
      cultivo: 'Desconocido',
      tiposCultivos: [
        'Maiz',
        'Trigo',
        'Girasol',
        'Cebada',
        'Remolacha',
        'Patatas',
        'Alfalfa',
        'Forraje',
        'Alubias',
        'Soja',
        'Veza',
        'Colza',
        'Desconocido',
      ],
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
      dialogMapa: true,
    };
  },

  methods: {
  ...mapActions('app', ['changeUser']),
  mostrarOpciones(){
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapa){ lc[0].style.visibility = 'hidden'; this.dialogMapa = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapa = true; }
    },
    onSubmit() {
       this.isLoading = true;
                  
       var tierraLocalizacion = [];
        var layers = [];
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Polygon) {
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
          var tierraNombre = this.nombre;
          var tierraTamaño = this.tamaño;
          var tierraCultivo = this.cultivo;
          
          var finca = new Finca("",tierraNombre, tierraTamaño, tierraCultivo, tierraLocalizacion);
         classMethods.getFincaMethods().createLand(finca).then((result) =>{
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Tierra creada correctamente';
          this.snackbar = true;
          router.push('/finca');
          this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al crear la tierra. Por favor inténtelo otra vez';
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
  // var lc = document.getElementsByClassName('leaflet-control-layers');
  // lc[0].style.visibility = 'hidden';
		   
   this.map2.pm.setLang('es');
   
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
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });

   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: true,
     drawRectangle: false,
     editPolygon: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     cutPolygon: false,
   });
   
      var myStyle = {
     "color": 'red',
      "weight": 5,
      "opacity": 0.65
   };
   
   //DAR STYLE AL CREAR
   this.map2.on('pm:create', e => {
     e.layer.bindPopup((LGeo.area(e.layer) / 10000).toFixed(2) + ' hectáreas');
     e.layer.openPopup();
     this.map2.pm.addControls({
       drawPolygon: false,
     });
     e.layer.setStyle(myStyle);
     this.map2.fitBounds(e.layer.getBounds());
     var map = this.map2; var layer = e.layer;
     e.layer.on('pm:edit', e => {
        map.fitBounds(layer.getBounds());
     });
   });
   
   this.map2.on('pm:remove', e => {
     this.map2.pm.addControls({
       drawPolygon: true,
     });
   });
   
  
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
</style>
