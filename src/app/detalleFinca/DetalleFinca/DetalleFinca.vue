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
   <h1>Finca:  <span >{{ nombre }}</span></h1>  
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
        clearable
        required
      ></v-text-field>
      
      <v-text-field
        v-model="tamaño"
        label="Tamaño (opcional)"
      ></v-text-field>

         <v-select
        v-model="cultivo"
        :items="tiposCultivos"
        label="Cultivo (opcional)"
        style="z-index: 999"
      ></v-select>
      
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
    </v-form> 
</v-col :cols="posMap">
    <v-col>
    <v-card
      class="mx-10 my-12"
      outlined
      v-show="dialogMapa"
   >
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
      <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
   </v-card>
    
    </v-col>
     </v-row>
    
<v-layout justify-center>
  <v-btn class="d-block my-2" @click="registrarPivot" color="info">
    Registrar nuevo pivot
  </v-btn>
</v-layout>

 <v-list rounded>
      <v-list-item-group v-model="item" background-color= "red" >
        <v-list-item       
          style="background:#9F693A"
          v-for="item in items"
          :key="item.text"
          @click="clickItem(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content >
            <v-list-item-title value="true" color="red" v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
 
    
<v-layout justify-start>
  <v-btn class="mx-3 my-5" @click.stop="dialog = true" color="error">
    Eliminar finca
  </v-btn>
</v-layout>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar la finca, este procesos será irreversible.
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
            @click="eliminarFinca"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

 </div> 
</template>



<script lang="ts">
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
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
    title: 'DetalleFinca',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',        
      tamaño: '',
      cultivo: null,
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
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
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      item: 1,
      items: [
      ],
       dialog: false,
       dialogMapa: true,
       coorFinca: '',
       dialogMapaOptions: true,
    };
  },
  
  //BEFORE UPDATE CHECK THAT ALL PIVOTS AND DEVICES ARE INSIDE THE LAND 
  methods: {
     ...mapActions('app', ['changePivot', 'changeUser', 'changeFinca']),
     mostrarOpciones(){
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapaOptions){ lc[0].style.visibility = 'hidden'; this.dialogMapaOptions = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapaOptions = true; }
    },
      async onSubmit() {   
       this.isLoading = true;
       var tierraLocalizacion = [];      
       var layers  = [];
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
         var t = this;
  
          var tierraNombre = this.nombre;
          var tierraTamaño = this.tamaño;
          var tierraCultivo = this.cultivo;

         var finca = new Finca(this.getFinca.key,tierraNombre, tierraTamaño, tierraCultivo, tierraLocalizacion);
         classMethods.getFincaMethods().updateLand(finca).then((result) =>{
          this.changeFinca(finca); 
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Tierra actualizada correctamente';
          this.snackbar = true;
         // router.push('/finca');
          this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al actualizar la tierra. Por favor inténtelo otra vez';
             this.snackbar = true;
          });    
       }
    },
    async registrarPivot() {
      router.push('/alta-pivot');
    },
    async eliminarFinca() {
      this.dialog = false; 
      var tierraNombre = this.nombre;
      classMethods.getFincaMethods().deleteLand(this.getFinca.key).then((result) =>{
          router.push('/finca');
          this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al eliminar la tierra. Por favor inténtelo otra vez';
             this.snackbar = true;
          });  
    },
    clickItem(nombreClicked){ 
      this.changePivot(nombreClicked.pivot); 
      router.push('/detalle-pivot');
    },
    
    mostrarMapa(){
      if(this.dialogMapa)  this.dialogMapa = false;
      else{ 
        this.dialogMapa = true;
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Polygon) {
              layer.bindPopup((LGeo.area(layer) / 10000).toFixed(2) + ' hectáreas');
              layer.openPopup(); 
          }                  
        })              
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
   //var lc = document.getElementsByClassName('leaflet-control-layers');
   //lc[0].style.visibility = 'hidden';
    

   this.map2.pm.setLang('es');
   
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
     //this.map2.fitBounds(e.layer.getBounds());
     var map = this.map2; var layer = e.layer;
     e.layer.on('pm:edit', e => {
        map.fitBounds(layer.getBounds());
     });
   });
   
   //DEJAR CREAR OTRO POLYGON AL ELIMINAR EL ACTUAL
   this.map2.on('pm:remove', e => {
     this.map2.pm.addControls({
       drawPolygon: true,
     });
     });

     L.tileLayer.wms('http://www.ign.es/wms-inspire/pnoa-ma', {
	layers: 'OI.OrthoimageCoverage',
	format: 'image/png',
	transparent: false,
	continuousWorld : true,
	attribution: 'PNOA cedido por © <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
     }).addTo(this.map2);
     // var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
      var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);
 
      var results = L.layerGroup().addTo(this.map2);
      
      searchControl.on('results', function (data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      });
      
   //this.changeUser(true);  
  
     if(this.getFinca === null) router.push('/finca');
     else{
     classMethods.getPivotMethods().listPivots(this.getFinca.key).then((result) =>{
     var items = this.items;    
     var arrayPivots = []; 
       if(result !== null){
        result.forEach(function(childResult) {       
          var pivot = childResult.nombre;
          var label = pivot;
          arrayPivots.push(childResult);
          items.push( { text: label ,icon: 'mdi-water-pump', pivot: childResult});         
       })
      // this.getFinca.pivots = arrayPivots;
       if(items.length > 0){
         this.map2.pm.addControls({
            drawMarker: false,
            drawCircleMarker: false,
            drawPolygon: false,  
            drawRectangle: false,
            editPolygon: false,
            drawCircle: false,
            drawPolyline: false,
            deleteLayer: false,
            deletePolyline: false,
            dragMode: false,
            cutPolygon: false,
            editMode: false,     
          }); 
       }
       else{
          this.map2.pm.addControls({ 
            drawMarker: false,
            drawCircleMarker: false,
            drawPolygon: false,
            drawRectangle: false,
            editPolygon: true,
            drawCircle: false,
            drawPolyline: false,
            deleteLayer: true,
            deletePolyline: false,
            dragPolygon: false,
            cutPolygon: false,
            editMode: true,     
          });
        }
      }
   });

        this.nombre = this.getFinca.nombre;
        this.localizacion = this.getFinca.localizacion;
        var map = this.map2;
        var layers;


        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
              layers = layer;                        
           },
        });

       this.map2.fitBounds(layers.getBounds());

	//COLORES
	var finca;
        this.localizacion.forEach(function(element,index) {
          var myStyle = {
          "color": 'red',
          "weight": 5,
          "opacity": 0.65
          };
          finca = JSON.parse(element);
          //https://leafletjs.com/reference-1.6.0.html#path
          L.geoJSON(JSON.parse(element), {
             style: myStyle
          }).addTo(map);
          
        })       

        this.coorFinca = finca;    
        this.tamaño = this.getFinca.tamaño;
        if(this.getFinca.cultivo)
          this.cultivo = this.getFinca.cultivo;  
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

<style>

</style>
