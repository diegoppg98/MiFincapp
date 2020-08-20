<template>
<div>
  <v-card
      class="mx-10 my-12"
      outlined
      v-show="dialogMapa"
   >
   <v-layout justify-end v-if="!dialogOpciones">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Mostrar Opciones
     </v-btn>
     </v-layout>
     
    <v-layout justify-end v-if="dialogOpciones">
     <v-btn small rounded class="mx-3 my-5" @click="mostrarOpciones" color="grey">
        Ocultar Opciones
     </v-btn>
     </v-layout>
  <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
    </v-card>
  
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
        @click:row="clicked"
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
import {router} from '../../router';
import { mapActions } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain';
import {Spain_MapasrasterIGN} from '../../LeafletSpain';
import {Spain_IGNBase} from '../../LeafletSpain';
import {Spain_Catastro} from '../../LeafletSpain';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import {Notificacion} from '../../Clases/Notificacion';
import {classMethods} from '../../classMethods';
export default {
  metaInfo:   {
    title: 'Notificacion',
  },
  data: () => ({
      item: 1,
      items: [],
      dialog: false,
      dialogMapa: false,
      itemActual:'',
      page: 1,
      sortBy: 'tiempo',
        sortDesc: true,
        pageCount: 0,
        itemsPerPage: 5,
        search: '',
        dialogOpciones: true,
      headers: [
          { text: 'Alerta', value: 'nombreAlerta' },
          { text: 'Tiempo', value: 'tiempo' },
          { text: 'Eliminar', value: 'actions', sortable: false },
          { text: 'Detalle alerta', value: 'detalleAlerta', sortable: false },
          { text: '', value: 'data-table-expand' },
        ],

  }),
  components: {
  },
  methods: {
  ...mapActions('app', ['changeAlerta']),
  mostrarOpciones(){
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogOpciones){ lc[0].style.visibility = 'hidden'; this.dialogOpciones = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogOpciones = true; }
    },
  mostrarMapa(){       
      if(this.dialogMapa) this.dialogMapa = false;
      else{ 
        this.dialogMapa = true;     
      }     
    },
    
  deleteItem(nombreClicked){ 
      this.itemActual = nombreClicked.notification.key;
      this.dialog = true;
    },
    
  clickAlerta(nombreClicked){
      this.changeAlerta(nombreClicked.alerta); 
      router.push('/detalle-alerta');
  },
  eliminarNotificacion() {
      this.dialog = false;    
      classMethods.getNotificacionMethods().deleteNotification(this.itemActual).then((result) =>{
          for (var k=0;k<this.items.length;k++){
            if(this.itemActual === this.items[k].notification.key)
             this.items.splice(k, 1);
          }
        }).catch((error) => {
           /*this.colorSnackbar = "error";
           this.textSnackbar = 'Error al eliminar la notificacion. Por favor inténtelo otra vez';
           this.snackbar = true;*/
        });   
    },
     
    clicked(value) {
    if(this.dialogMapa){
 
   var t = this;
                this.map2.eachLayer(function (layer) {
                  if (layer instanceof L.Rectangle || layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Marker)
                     t.map2.removeLayer(layer);
                });
   
var map = this.map2;
    value.medida.forEach(function(element,index) {

///CAMBIAR ICONO MEDIDA
var yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

             var marker = L.geoJSON(JSON.parse(element),{
                pointToLayer: function (feature, latlng) {
                  return L.marker(latlng, {
                    icon: yellowIcon
                  });
                }
             }).addTo(map);

   })  
   
      
        if(value.alerta === null) router.push('/alerta');
        var finca = value.alerta.tierra;
        var pivot = value.alerta.pivot;
        var dispositivo = value.alerta.dispositivo;
        var localizacion = value.alerta.datos;
        var map = this.map2;
        var myStyle = {
          "color": 'purple',
          "weight": 5,
          "opacity": 0.65
         };
 
        localizacion.forEach(function(element,index) {
          L.geoJSON(JSON.parse(element), {
             style: myStyle
          }).addTo(map);
        }) 

        classMethods.getFincaMethods().landInformation(finca).then((result) =>{
          if(result === null) router.push('/alerta');
          var localizacionFinca = result.localizacion;
          var map = this.map2;
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

           L.geoJSON(JSON.parse(element), {
             pane: "pane250",
             style: myStyle
          }).addTo(map);   
          })  

        });
        
        classMethods.getPivotMethods().pivotInformation(pivot).then((result) =>{
          if(result === null) router.push('/alerta');
          var localizacion = result.localizacion;      
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

        });
        classMethods.getDispositivoMethods().deviceInformation(dispositivo).then((result) =>{
          if(result === null) router.push('/alerta');
          var localizacion = result.localizacion;      
          var map = this.map2;
          localizacion.forEach(function(element,index) {
             L.geoJSON(JSON.parse(element)).addTo(map);
          })  
        });     
      
      }
    }
  },
  
  mounted(){
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
    }).setView([0, 0], 1).addLayer(mapboxTiles1);
   
    var baselayers = {
	"Normal": mapboxTiles1,
	"Vista Real": Spain_PNOA_Ortoimagen,
	"Mapa España": Spain_MapasrasterIGN,
	"Mapa España y Mundo": Spain_IGNBase,
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
  this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups

   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: false,
     editMode: false,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: false,
     dragMode: false,
     cutPolygon: false,
   });
  
  },
  beforeMount(){
  window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }
   this.dialogMapa = true;
  var items = this.items;

     classMethods.getNotificacionMethods().listNotification().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var medida = childResult.medida; 
          var tiempo = childResult.tiempo; 
          var keyAlert = childResult.alerta; 
          var keyNotification = childResult.key;

        //  items.push( { medida: medida ,tiempo: tiempo , icon: 'mdi-bell', notification: childResult});
            
          classMethods.getAlertaMethods().alertInformation(keyAlert).then((result) =>{
            if(result !== null){ 
               var nombre = result.nombre;         
               items.push( { nombreAlerta: nombre ,medida: medida ,tiempo: tiempo , icon: 'mdi-bell', notification: childResult, alerta: result});
            }
          });


       }); 
     }
   }); 
   
  },

};
</script>

<style>
</style>
