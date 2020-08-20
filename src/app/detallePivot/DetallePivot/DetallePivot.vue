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
   <h1>Pivot:  <span >{{ nombre }}</span></h1>  
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
      
 <v-alert
      type="info"
      v-model="alert"
      close-text="Close Alert"
      dark
      dismissible
    >
      Alerta: Pivot a entrado en la zona
    </v-alert>


    <v-radio-group v-model="tipo" :mandatory="false">
      <v-radio label="Circular" value="circular"></v-radio>
      <v-radio label="Lineal" value="lineal"></v-radio>
    </v-radio-group>

    
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
     <div class="d-block mx-2" style="height: 350px;" ref="mapa" id="mapa"></div>
    
    </v-col>
     </v-row>
    
<v-layout justify-center>
<v-card-actions class="d-block">
  <v-btn class="d-block my-2" @click="registrarDispositivo" color="info">
    Registrar nuevo dispositivo
  </v-btn>
  
<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmar eliminación</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar el pivot, este procesos será irreversible.
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
            @click="eliminarPivot"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-card-actions>
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
    Eliminar pivot
  </v-btn>

</v-layout>

 </div> 
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import {router} from '../../router';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
import {Pivot} from '../../Clases/Pivot';
import {Dispositivo} from '../../Clases/Dispositivo';
import {DispositivoGps} from '../../Clases/Dispositivo';
import {DispositivoTemperatura} from '../../Clases/Dispositivo';
import KalmanFilter from 'kalmanjs';
import {Spain_PNOA_Ortoimagen} from '../../LeafletSpain.js';
import {Spain_MapasrasterIGN} from '../../LeafletSpain.js';
import {Spain_IGNBase} from '../../LeafletSpain.js';
import {Spain_Catastro} from '../../LeafletSpain.js';
import {Spain_UnidadAdministrativa} from '../../LeafletSpain.js';
import {parcelas} from '../../LeafletSpain';
import {recintos} from '../../LeafletSpain';
import {classMethods} from '../../classMethods';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'DetallePivot',
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
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      item: 1,
      items: [
      ],
      itemsKey: [
      ],
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      dialog: false,
      coordenadaFinca:0,
      coordenadaPivot:0,
      coordenadasDispositivo:0,
      alert: false,
      pivot:[],
      coorFinca: '',
      groupLayer:[],
      dialogMapa: true,
    };
  },
  methods: {
     ...mapActions('app', ['changeDispositivo','changePivot', 'changeUser']),
    mostrarOpciones(){
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if(this.dialogMapa){ lc[0].style.visibility = 'hidden'; this.dialogMapa = false;}
      else{ lc[0].style.visibility = 'visible'; this.dialogMapa = true; }
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
         
         var pivot = new Pivot(this.getPivot.key,pivotNombre, pivotTipo, pivotLocalizacion, nombreTierra);
         classMethods.getPivotMethods().updatePivot(pivot).then((result) =>{
         this.changePivot(pivot); 
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Pivot actualizado correctamente';
          this.snackbar = true;
         this.isLoading = false;
         var t = this;
         this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al actualizar el pivot. Por favor inténtelo otra vez';
             this.snackbar = true;
          });
	  
   	  var t = this;
          this.items.forEach(function(childResult) {     
          var nombreDispositivo = childResult.dispositivo.nombre;
          var tipoDispositivo = childResult.dispositivo.tipo;
           if(tipoDispositivo === 'GPS'){
            var idDispositivo = childResult.dispositivo.id;
            var fincaDispositivo = childResult.dispositivo.finca;
            var pivotDispositivo = childResult.dispositivo.pivot;
            var localizacion = childResult.dispositivo.localizacion;
            var deviceKey = childResult.dispositivo.key;
            
            var latlngCenter = null;
         var latlngPoint = null;
         var positions = '';
      
       L.geoJSON(L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
             onEachFeature: function (feature, layer) {
              t.coordenadasDispositivo = feature.geometry.coordinates;
             },
        });
        
if(Math.floor(t.coordenadaPivot.getLatLngs()[0].lat*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(t.coordenadasDispositivo[1]*Math.pow(10,4))/(Math.pow(10,4)) && Math.floor(t.coordenadaPivot.getLatLngs()[0].lng*Math.pow(10,4))/(Math.pow(10,4)) === Math.floor(t.coordenadasDispositivo[0]*Math.pow(10,4))/(Math.pow(10,4))){
              latlngCenter = L.latLng(t.coordenadaPivot.getLatLngs()[1].lat, t.coordenadaPivot.getLatLngs()[1].lng);
              latlngPoint = L.latLng(t.coordenadaPivot.getLatLngs()[0].lat, t.coordenadaPivot.getLatLngs
()[0].lng);
                           }
                           else { 
              latlngCenter = L.latLng(t.coordenadaPivot.getLatLngs()[0].lat, t.coordenadaPivot.getLatLngs()[0].lng);
              latlngPoint = L.latLng(t.coordenadaPivot.getLatLngs()[1].lat, t.coordenadaPivot.getLatLngs()[1].lng);
                           }
                                                               
  if(pivotTipo === 'lineal'){           
    positions = FunctionsUtils.pivotLineal(t.map2, t.coordenadaFinca, latlngPoint, latlngCenter);

  }
  else if(pivotTipo === 'circular'){           
    positions = FunctionsUtils.pivotCircular(t.map2, t.coordenadaFinca, latlngPoint, latlngCenter); 
  }       
      
    var dispositivo = new DispositivoGps(deviceKey,nombreDispositivo, idDispositivo, tipoDispositivo, localizacion, fincaDispositivo, pivotDispositivo,JSON.stringify(positions));
      classMethods.getDispositivoMethods().updateDevice(dispositivo).then((result) =>{
                           }).catch((error) => {
                           });      
           }
         })

      } 
      }
    },

    async registrarDispositivo() {
      router.push('/alta-dispositivo');
    },
    async eliminarPivot() {
      this.dialog = false;
       var nombreTierra = this.getFinca;
       var pivotNombre = this.nombre;
       classMethods.getPivotMethods().deletePivot(this.getPivot.key).then((result) =>{
          router.push('/detalle-finca');
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al eliminar el pivot. Por favor inténtelo otra vez';
             this.snackbar = true;
          }); 
       
    },
    clickItem(nombreClicked){ 
      this.changeDispositivo(nombreClicked.dispositivo); 
      router.push('/detalle-dispositivo');
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
    ...mapGetters('app', [ 'getFinca', 'getPivot']),
  },


mounted() {

//let xhr = createCORSRequest('GET', 'https://cors-anywhere.herokuapp.com/https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?');

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

       /*var pnoa = L.tileLayer.wms("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
	   layers: "Catastro",//nombre de la capa (ver get capabilities)
	   format: 'image/jpeg',
	   transparent: true,
	   version: '1.1.1',//wms version (ver get capabilities)
	   attribution: "DIRECCION GENERAL DEL CATASTRO"
	});
	pnoa.crossOrigin = 'anonymous';
       // pnoa.addTo(this.map2);*/
 
 
	/*var source = L.WMS.source("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
		  opacity: 0.1,
	});
       source.crossOrigin = 'anonymous';
	source.getLayer("PARCELA").addTo(this.map2);*/
	
	//http://sigpac.mapama.gob.es/fega/serviciosvisorsigpac/layerinfo?layer=PARCELA&id=76727,3177160274,24,116,619,0,55



	/*var CleanInfoSource = L.WMS.Source.extend({
         'showFeatureInfo': function(latlng, info){
          //if (!this.map2){return;}
          console.log(latlng);
          console.log(info);
          //this.map2.openPopup(info, latlng);
          }
        });
       var source = new CleanInfoSource("http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
       layers: "PARCELA",//nombre de la capa (ver get capabilities)
       format: 'image/png',
       transparent: true,
       version: '1.1.0',//wms version (ver get capabilities)
       info_format: "text/plain",
       attribution: "DIRECCION GENERAL DEL CATASTRO"
    });
    
    source.getLayer("PARCELA").addTo(this.map2);*/

	
	
	////////////////////////////

//https://mappinggis.com/2018/01/accediendo-a-los-datos-de-un-servicio-wms-con-leaflet/
//https://github.com/heigeo/leaflet.wms
//https://stackoverflow.com/questions/46268753/filter-getfeatureinfo-results-leaflet-wms-plugin
//http://xeoinquedos.eu/curso-webgis/leaflet/5_interactuando_mapa/
    var TipoParcelas = L.tileLayer.wms("http://wms.mapama.es/sig/Agricultura/MapaCultivos2000-2010/wms.aspx?", {
       layers: "LC.LandCoverSurfaces",//nombre de la capa (ver get capabilities)
       format: 'image/png',
       transparent: true,
       version: '1.3.0',//wms version (ver get capabilities)
       attribution: "DIRECCION GENERAL DEL CATASTRO"
    });


    
   var baselayers = {
	"Normal": mapboxTiles1,
	"Vista Real": Spain_PNOA_Ortoimagen,
	"Mapa España": Spain_MapasrasterIGN,
	//"Mapa España y Mundo": Spain_IGNBase,
	"Parcelas": parcelas,
	"Recintos": recintos,
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
   //http://mapbbcode.org/leaflet.html

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
   
   var dispositivos = 0;
  
   this.map2.createPane("pane250").style.zIndex = 250; // between tiles and overlays
   this.map2.createPane("pane450").style.zIndex = 450; // between overlays and shadows
   this.map2.createPane("pane620").style.zIndex = 620; // between markers and tooltips
   this.map2.createPane("pane800").style.zIndex = 800; // above popups
   
      //DAR STYLE AL CREAR
   this.map2.on('pm:create', e => {
     this.map2.pm.addControls({
       drawPolyline: false,
     });
     e.layer.setStyle(myStyleLine);
     
   });
   
   //DEJAR CREAR OTRO PIVOT AL ELIMINAR EL ACTUAL
   this.map2.on('pm:remove', e => {
   /*    console.log((LGeo.area(e.layer) / 1000000).toFixed(2));
       var X = [];
var Y = [];
var lengthPolygon = 0;

for (var k=0;k<this.coordenadaFinca.getLatLngs().length;k++){
  var polyPoints = this.coordenadaFinca.getLatLngs()[k]; 
  lengthPolygon = lengthPolygon + polyPoints.length;
  for (var i = 0; i < polyPoints.length; i++) {
    X.push(polyPoints[i].lat); Y.push(polyPoints[i].lng);
  }
}

console.log(FunctionsUtils.polygonArea(X,Y,lengthPolygon)*10);*/
      if ((e.layer instanceof L.Polyline) && ! (e.layer instanceof L.Polygon)) {
         this.map2.pm.addControls({
            drawPolyline: true,
         });
      } 
      else if (e.layer instanceof L.Polygon) {//crearlo con el style y debajo de la linea
         L.geoJSON((this.coorFinca), {
           pane: "pane250",
           style: myStylePolygon
         }).addTo(this.map2);
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
    this.pivot.push(p);
    if(this.pivot.length === 2){
       this.pivot = [];
       requestAnimationFrame(() => e.marker._icon.click());
    }
  });
 
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

     if(this.getFinca === null || this.getPivot === null) router.push('/finca');
     else{
     var items = this.items;
     var itemsKey = this.itemsKey;

        if(this.getFinca === null) router.push('/finca');
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
        //COLORES
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

        if(this.getPivot === null) router.push('/finca');
        this.nombre = this.getPivot.nombre;
        this.localizacion = this.getPivot.localizacion;
        var map = this.map2;
        var t = this;

        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
           onEachFeature: function (feature, layer) {
               t.coordenadaPivot = layer;
           },
        });
        
        var myStyle = {
          "color": 'blue',
          "weight": 5,
          "opacity": 1
        };

        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element), {
             pane: "pane620",
             style: myStyle
           }).addTo(map);
        })  
        this.tipo = this.getPivot.tipo;
     var arrayDevices = [];
     classMethods.getDispositivoMethods().listDevices(this.getPivot.key).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {     
          var dispositivo = childResult.nombre;
          var label =dispositivo;
          arrayDevices.push(childResult);
          items.push( { text: label ,icon: 'mdi-cellphone-wireless', dispositivo: childResult });  
          itemsKey.push(childResult.key);  
       })
       //this.getPivot.dispositivos = arrayDevices;
          
    if(items.length > 0){      
     this.map2.pm.addControls({
       drawMarker: false,
       drawCircleMarker: false,
       drawPolygon: false,
       drawRectangle: false,
       drawCircle: false,
       drawPolyline: false,
       deleteLayer: false,
       editMode: false,
       dragMode: false,
       cutPolygon: false,    
     });
    }
    else{
     this.map2.pm.addControls({
       drawMarker: false,
       drawCircleMarker: false,
       drawPolygon: false,
       drawRectangle: false,
       drawCircle: false,
       drawPolyline: false,
       deleteLayer: true,
       editMode: false,
       dragMode: false,
       cutPolygon: false,    
     });
    }

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
   /*
   .leaflet-popup-content-wrapper {
      background: #2c3e50;
      color: #fff;
      font-size: 16px;
      line-height: 24px;
      border-radius: 0px;
    }
   */
</script>

<style>
</style>

