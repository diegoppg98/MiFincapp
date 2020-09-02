<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
      style="z-index: 999999"
    >
      {{ textSnackbar }}
      <v-btn text @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
          <h1 style="color:#2e7d32;" class="mx-1 my-1 text-center">
            Pivot:
            <span>{{ nombre }}</span>
          </h1>

          <v-container>
            <v-col>
              <v-row>
                <v-layout justify-start>
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


                <v-dialog v-model="dialogOptions" style="z-index: 999">
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
                    color="#7d2f2e"
                    block
                    class="white--text"
                    @click.stop="dialog = true"
                  >Eliminar pivot</v-btn>
                  </v-col>
      </v-row>
    </v-container>
    </v-card>
                </v-dialog>
              </v-row>
            </v-col>
          </v-container>

          <v-container>
            <v-row dense>
              <v-col v-for="(item, i) in items" :key="i" cols="12">
                <v-card color="#2e7d32" dark @click.native="clickItem(item)">
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title v-text="item.text"></v-card-title>
                    </div>
                    <v-avatar class="ma-3" size="125" tile>
                      <v-img id="image"
                        :src="item.src"
                      ></v-img>
                    </v-avatar>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-btn
            fab
            absolute
            bottom
            right
            class="white--text"
            @click="registrarDispositivo"
            color="#2e7d32"
            id="btn-flotante"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>

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
              <v-form class="my-1" dark ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  class="my-1 mx-3 mt-5"
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
                >Alerta: Pivot a entrado en la zona</v-alert>

                <v-radio-group class="my-1 mx-3" v-model="tipo" :mandatory="false" disabled>
                  <v-radio label="Circular" value="circular"></v-radio>
                  <v-radio label="Lineal" value="lineal"></v-radio>
                </v-radio-group>

              </v-form>
            </v-card>
          </v-dialog>

          <v-card-actions class="d-block">
            <v-dialog v-model="dialog" max-width="290" style="z-index: 999">
              <v-card>
                <v-card-title class="headline">Confirmar eliminación</v-card-title>

                <v-card-text>Esta seguro de que desea eliminar el pivot, este procesos será irreversible.</v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="#2e7d32" text @click="dialog = false">Cancelar</v-btn>

                  <v-btn color="#7d2f2e" text @click="eliminarPivot">Eliminar</v-btn>
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
import { router } from '../../router';
import { Utils } from '../../utils';
let FunctionsUtils: Utils = new Utils();
import { Pivot } from '../../Clases/Pivot';
import { Dispositivo } from '../../Clases/Dispositivo';
import { DispositivoGps } from '../../Clases/Dispositivo';
import { DispositivoSuelo } from '../../Clases/Dispositivo';
import KalmanFilter from 'kalmanjs';
import { Spain_PNOA_Ortoimagen } from '../../LeafletSpain.js';
import { Spain_MapasrasterIGN } from '../../LeafletSpain.js';
import { Spain_IGNBase } from '../../LeafletSpain.js';
import { Spain_Catastro } from '../../LeafletSpain.js';
import { Spain_UnidadAdministrativa } from '../../LeafletSpain.js';
import { parcelas } from '../../LeafletSpain';
import { recintos } from '../../LeafletSpain';
import { FactoryAPI } from '../../FactoryAPI';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo: {
    title: 'DetallePivot',
  },
  components: {},
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
      localizacionFinca: [],
      isLoading: false,
      item: 1,
      items: [],
      itemsKey: [],
      nameRules: [
        (v) => !!v || 'Nombre no puede estar vacío',
        (v) => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      dialog: false,
      dialogOptions: false,
      dialogDatos: false,
      coordenadaFinca: 0,
      coordenadaPivot: 0,
      coordenadasDispositivo: 0,
      alert: false,
      pivot: [],
      coorFinca: '',
      groupLayer: [],
      dialogMapaOptions: false,
      coordPos:'',
      iconPivot:'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FmarkerDevice.png?alt=media&token=88ede691-a2a8-40ef-8a88-05cd62eef8bd',
    };
  },
  methods: {
    ...mapActions('app', ['changeDispositivo', 'changePivot', 'changeUser']),
    mostrarOpciones() {
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if (this.dialogMapaOptions) {
        lc[0].style.visibility = 'hidden';
        this.dialogMapaOptions = false;
      } else {
        lc[0].style.visibility = 'visible';
        this.dialogMapaOptions = true;
      }
    },
    mostrarMapa() {
      if (!this.map2) {
        document.getElementById('mapaShow').style.display = 'block';

        const accessToken =
          'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';

        const mapboxTiles1 = L.tileLayer(
          `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
        );

        this.map2 = L.map(this.$refs['mapa'], {
          attributionControl: false,
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
        var TipoParcelas = L.tileLayer.wms('https://wms.mapama.es/sig/Agricultura/MapaCultivos2000-2010/wms.aspx?', {
          layers: 'LC.LandCoverSurfaces', //nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: true,
          version: '1.3.0', //wms version (ver get capabilities)
          attribution: 'DIRECCION GENERAL DEL CATASTRO',
        });

        var baselayers = {
          Normal: mapboxTiles1,
          'Vista Real': Spain_PNOA_Ortoimagen,
          'Mapa España': Spain_MapasrasterIGN,
          //"Mapa España y Mundo": Spain_IGNBase,
          Parcelas: parcelas,
          Recintos: recintos,
          Catastro: Spain_Catastro,
        };
        var overlayers = {
          'Unidades administrativas': Spain_UnidadAdministrativa,
        };
        L.control.layers(baselayers, overlayers, { collapsed: false }).addTo(this.map2);
        L.control
          .scale({
            options: { position: 'bottomleft', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false },
          })
          .addTo(this.map2);
        Spain_PNOA_Ortoimagen.addTo(this.map2);
        //var lc = document.getElementsByClassName('leaflet-control-layers');
        //lc[0].style.visibility = 'hidden';

        this.map2.pm.setLang('es');
        this.map2.on('fullscreenchange', function () {
          if (map.isFullscreen()) {
            //console.log('entered fullscreen');
          } else {
            document.getElementById('mapaShow').style.display = 'none';
          }
        });

        var myStyleLine = {
          color: 'blue',
          weight: 5,
          opacity: 1,
        };
        var myStylePolygon = {
          color: 'red',
          weight: 5,
          opacity: 0.65,
        };

        var dispositivos = 0;

        this.map2.createPane('pane250').style.zIndex = 250; // between tiles and overlays
        this.map2.createPane('pane450').style.zIndex = 450; // between overlays and shadows
        this.map2.createPane('pane620').style.zIndex = 620; // between markers and tooltips
        this.map2.createPane('pane800').style.zIndex = 800; // above popups

        //DAR STYLE AL CREAR
        this.map2.on('pm:create', (e) => {
          this.map2.pm.addControls({
            drawPolyline: false,
          });
          e.layer.setStyle(myStyleLine);
        });

        //DEJAR CREAR OTRO PIVOT AL ELIMINAR EL ACTUAL
        this.map2.on('pm:remove', (e) => {
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
          if (e.layer instanceof L.Polyline && !(e.layer instanceof L.Polygon)) {
            this.map2.pm.addControls({
              drawPolyline: true,
            });
          } else if (e.layer instanceof L.Polygon) {
            //crearlo con el style y debajo de la linea
            L.geoJSON(this.coorFinca, {
              pane: 'pane250',
              style: myStylePolygon,
            }).addTo(this.map2);
          }
        });

        //CREAR FIGURA AL SEGUNDO CLICK
        this.map2.on('pm:drawstart', ({ workingLayer }) => {
          workingLayer.on('pm:vertexadded', (e) => {
            var p = L.latLng(e.latlng.lat, e.latlng.lng);
            if (!FunctionsUtils.pointInLand(p, this.coordenadaFinca)) {
              this.map2.pm.Draw.Line._removeLastVertex();
              this.colorSnackbar = 'error';
              this.textSnackbar = 'Posición no válida. Por favor, marque una posición dentro de la finca';
              this.snackbar = true;
            } else {
              this.pivot.push(p);
              if (this.pivot.length === 2) {
                this.pivot = [];
                requestAnimationFrame(() => e.marker._icon.click());
              }
            }
            this.pivot.push(p);
            if (this.pivot.length === 2) {
              this.pivot = [];
              requestAnimationFrame(() => e.marker._icon.click());
            }
          });
        });

        L.tileLayer
          .wms('https://www.ign.es/wms-inspire/pnoa-ma', {
            layers: 'OI.OrthoimageCoverage',
            format: 'image/png',
            transparent: false,
            continuousWorld: true,
            attribution:
              'PNOA cedido por © <a href="https://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>',
          })
          .addTo(this.map2);
        //   var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
        var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);

        var results = L.layerGroup().addTo(this.map2);

        searchControl.on('results', function (data) {
          results.clearLayers();
          for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
          }
        });
        var lc = document.getElementsByClassName('leaflet-control-layers');
        lc[0].style.visibility = 'hidden';
        this.map2.toggleFullscreen();
        if (this.items.length > 0) {
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
        } else {
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
        var group = new L.featureGroup(this.groupLayer);
        this.map2.fitBounds(group.getBounds());
        var map = this.map2;
        var t = this;
        
         
              
        this.localizacion.forEach(function (element, index) {
          var myStyle = {
            color: 'blue',
            weight: 5,
            opacity: 1,
          };
          L.geoJSON(JSON.parse(element), {
            pane: 'pane620',
            style: myStyle,
          }).addTo(map);
          
           var icon = L.icon({
    iconUrl: t.iconPivot,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });

L.geoJSON( L.geoJSON(JSON.parse(t.localizacion[0])).toGeoJSON(), {
 onEachFeature: function (feature, layer) { 
 var punto1 = L.latLng(feature.geometry.coordinates[1][1],feature.geometry.coordinates[1][0]);
                    var punto2 = L.latLng(feature.geometry.coordinates[0][1],feature.geometry.coordinates[0][0]); 
                 L.marker(punto1, {
                             icon: icon,
                          }).addTo(t.map2);
                       
                 L.marker(punto2, {
                             icon: icon,
                          }).addTo(t.map2); 
                          },
              });


          t.items.forEach(function (childResult) {
              var dispositivo = childResult.dispositivo;
              var TipoDispositivo = dispositivo.tipo;
              if(TipoDispositivo == 'GPS'){
                 var coordenadasDispositivo = '';
                      L.geoJSON( L.geoJSON(JSON.parse(dispositivo.localizacion[0])).toGeoJSON(), {
                        onEachFeature: function (feature, layer) {
                          coordenadasDispositivo = feature.geometry.coordinates;
                        },
                      });
                 var positions = JSON.parse(dispositivo.posiblesLocalizaciones); 
                 t.calculoPosicion(t.coordPos,t.tipo,positions,t.coordenadaPivot,coordenadasDispositivo,TipoDispositivo); 
              }
              
            });
            console.log("1");
          //AQUI SOLO PIVOT
        });

        this.localizacionFinca.forEach(function (element, index) {
          var myStyle = {
            color: 'red',
            weight: 5,
            opacity: 0.65,
          };
          L.geoJSON(JSON.parse(element), {
            pane: 'pane250',
            style: myStyle,
          }).addTo(map);
        });
      } else {
        document.getElementById('mapaShow').style.display = 'block';
        this.map2.toggleFullscreen();
      }
    },
    
    
    
    
    calculoPosicion(coordPos,tipoPivot,positions,coordenadaPivot,coordenadasActualesDispositivo,tipo){    
     if(!coordPos.length == 0){ 
        var pos;
        var punto1;
        var punto2;
        var latlngCenter; 
        var t = this;   
        var map = this.map2;                                
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
        
        var icon = L.icon({
    iconUrl: t.iconPivot,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });

this.map2.eachLayer(function(layer) { 
             if (layer instanceof L.Marker) {
              map.removeLayer(layer);
             }                    
          })
         
                 
                 L.marker(punto1, {
                             icon: icon,
                          }).addTo(this.map2);
                       
                 L.marker(punto2, {
                             icon: icon,
                          }).addTo(this.map2); 
                      // console.log(feature.geometry.coordinates);
                 
                                  
             
     /*   if(tipo == 'GPS'){                 
          this.map2.eachLayer(function(layer) { 
             if (layer instanceof L.Marker) {
              layer.setLatLng(LatLng);
             }                    
          })
        }*/
        this.map2.eachLayer(function(layer) {
           if ((layer instanceof L.Polyline) && ! (layer instanceof L.Polygon)) {
            layer.setLatLngs(LatLngs); 
           }                       
        })   

      }
    },
    
    
    
    
    
    onSubmit() {
      this.isLoading = true;
      var pivotLocalizacion = [];
      var layers = [];
      
      if (this.map2) {
      this.map2.eachLayer(function (layer) {
        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
          layers.push(layer);
        }
      });
      this.localizacion = layers;
      this.localizacion.forEach(function (element, index) {
        pivotLocalizacion.push(JSON.stringify(element.toGeoJSON()));
      });
      }
      else{
        pivotLocalizacion = this.localizacion;
      }
      if (pivotLocalizacion.length === 0) {
        this.colorSnackbar = 'error';
        this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
        this.snackbar = true;
        this.isLoading = false;
      } else {
      
          var p1 = L.latLng(JSON.parse(pivotLocalizacion[0]).geometry.coordinates[0][1], JSON.parse(pivotLocalizacion[0]).geometry.coordinates[0][0]);
          var p2 = L.latLng(JSON.parse(pivotLocalizacion[0]).geometry.coordinates[1][1], JSON.parse(pivotLocalizacion[0]).geometry.coordinates[1][0]);
        if (
          !FunctionsUtils.pointInLand(p1, this.coordenadaFinca) ||
          !FunctionsUtils.pointInLand(p2, this.coordenadaFinca)
        ) {
          this.colorSnackbar = 'error';
          this.textSnackbar =
            'Localizacion no válida. Por favor seleccione la localizacion del pivot dentro de la finca';
          this.snackbar = true;
          this.isLoading = false;
        } else {
          var nombreTierra = this.getFinca.key;
          var pivotNombre = this.nombre;
          var pivotTipo = this.tipo;

          var pivot = new Pivot(this.getPivot.key, pivotNombre, pivotTipo, pivotLocalizacion, nombreTierra,[]);
          FactoryAPI.getFactoryAPI('Firebase')
            .getPivot()
            .updatePivot(pivot)
            .then((result) => {
              this.changePivot(pivot);
              this.colorSnackbar = 'success';
              this.textSnackbar = 'Pivot actualizado correctamente';
              this.snackbar = true;
              this.isLoading = false;
              var t = this;
              this.isLoading = false;
            })
            .catch((error) => {
              this.colorSnackbar = 'error';
              this.textSnackbar = 'Error al actualizar el pivot. Por favor inténtelo otra vez';
              this.snackbar = true;
            });

         /*
         CALCULO POSITIONS ONLY IF TYPE PIVOT CHANGE
          var t = this;
          this.items.forEach(function (childResult) {
            var nombreDispositivo = childResult.dispositivo.nombre;
            var tipoDispositivo = childResult.dispositivo.tipo;
            if (tipoDispositivo === 'GPS') {
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

              if (
                Math.floor(t.coordenadaPivot.getLatLngs()[0].lat * Math.pow(10, 4)) / Math.pow(10, 4) ===
                  Math.floor(t.coordenadasDispositivo[1] * Math.pow(10, 4)) / Math.pow(10, 4) &&
                Math.floor(t.coordenadaPivot.getLatLngs()[0].lng * Math.pow(10, 4)) / Math.pow(10, 4) ===
                  Math.floor(t.coordenadasDispositivo[0] * Math.pow(10, 4)) / Math.pow(10, 4)
              ) {
                latlngCenter = L.latLng(t.coordenadaPivot.getLatLngs()[1].lat, t.coordenadaPivot.getLatLngs()[1].lng);
                latlngPoint = L.latLng(t.coordenadaPivot.getLatLngs()[0].lat, t.coordenadaPivot.getLatLngs()[0].lng);
              } else {
                latlngCenter = L.latLng(t.coordenadaPivot.getLatLngs()[0].lat, t.coordenadaPivot.getLatLngs()[0].lng);
                latlngPoint = L.latLng(t.coordenadaPivot.getLatLngs()[1].lat, t.coordenadaPivot.getLatLngs()[1].lng);
              }

              if (pivotTipo === 'lineal') {
                positions = FunctionsUtils.pivotLineal(t.map2, t.coordenadaFinca, latlngPoint, latlngCenter);
              } else if (pivotTipo === 'circular') {
                positions = FunctionsUtils.pivotCircular(t.map2, t.coordenadaFinca, latlngPoint, latlngCenter);
              }

              var dispositivo = new DispositivoGps(
                deviceKey,
                nombreDispositivo,
                idDispositivo,
                tipoDispositivo,
                localizacion,
                fincaDispositivo,
                pivotDispositivo,
                JSON.stringify(positions),
                ,[]
              );
              FactoryAPI.getFactoryAPI('Firebase')
                .getDispositivo()
                .updateDevice(dispositivo)
                .then((result) => {})
                .catch((error) => {});
            }
          });*/
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
      FactoryAPI.getFactoryAPI('Firebase')
        .getPivot()
        .deletePivot(this.getPivot.key)
        .then((result) => {
          router.push('/detalle-finca');
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al eliminar el pivot. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },
    clickItem(nombreClicked) {
      this.changeDispositivo(nombreClicked.dispositivo);
      router.push('/detalle-dispositivo');
    },
    imagesTypes(TipoDispositivo){
      switch (TipoDispositivo) {
            case 'GPS':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FSensorGps.jpg?alt=media&token=456c0eda-cad5-45ea-a010-9c49c69b9fa2';
            case 'Suelo':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FsensorSuelo.jpg?alt=media&token=9b434fed-7a07-4e49-a034-db67af65fe21';
            default:
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FsensorSuelo.jpg?alt=media&token=9b434fed-7a07-4e49-a034-db67af65fe21';
        }
    }
  },
  computed: {
    posMap() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12';
        case 'sm':
          return '12';
        case 'md':
          return '6';
        case 'lg':
          return '6';
        case 'xl':
          return '6';
      }
    },
    ...mapGetters('app', ['getFinca', 'getPivot']),
  },

  mounted() {
    //let xhr = createCORSRequest('GET', 'https://cors-anywhere.herokuapp.com/https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?');

    if (this.getFinca === null || this.getPivot === null) router.push('/finca');
    else {
      var items = this.items;
      var itemsKey = this.itemsKey;

      if (this.getFinca === null) router.push('/finca');
      this.localizacionFinca = this.getFinca.localizacion;
      var layers;
      var t = this;

      L.geoJSON(L.geoJSON(JSON.parse(this.localizacionFinca[0])).toGeoJSON(), {
        onEachFeature: function (feature, layer) {
          t.coordenadaFinca = layer;
          layers = layer;
        },
      });

      this.groupLayer.push(layers);

      //COLORES
      var finca;
      this.localizacionFinca.forEach(function (element, index) {
        finca = JSON.parse(element);
      });
      this.coorFinca = finca;

      if (this.getPivot === null) router.push('/finca');
      this.nombre = this.getPivot.nombre;
      this.localizacion = this.getPivot.localizacion;
      this.coordPos = this.getPivot.posActual;

      var t = this;

      L.geoJSON(L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
        onEachFeature: function (feature, layer) {
          t.coordenadaPivot = layer;
        },
      });

      this.tipo = this.getPivot.tipo;
      var imageType = this.imagesTypes;
      var arrayDevices = [];
      FactoryAPI.getFactoryAPI('Firebase')
        .getDispositivo()
        .listDevices(this.getPivot.key)
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult) {
              var dispositivo = childResult.nombre;
              var label = dispositivo;
              var TipoDispositivo = childResult.tipo;
              var image = imageType(TipoDispositivo);
              arrayDevices.push(childResult);
              items.push({ text: label,src: image, icon: 'mdi-cellphone-wireless', dispositivo: childResult });
              itemsKey.push(childResult.key);
            });
            //this.getPivot.dispositivos = arrayDevices;
          }
        });
    }
  },

  beforeMount() {
    window.onbeforeunload = function () {
      window.setTimeout(function () {
        window.location = '/perfil';
      }, 0);
      window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
    };
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
#image {
  border-radius: 24px;
}
<style>
#mapaShow {
  display: none;
}
#btn-flotante {
	font-size: 16px; 
	font-weight: bold; 
	padding: 18px 30px; 
	position: fixed;
	bottom: 40px;
	right: 40px;
	transition: all 300ms ease 0ms;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
	z-index: 99;
}
#btn-flotante:hover {
	background-color: #2c2fa5; 
	box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.3);
	transform: translateY(-7px);
}
@media only screen and (max-width: 600px) {
 	.btn-flotante {
		font-size: 14px;
		padding: 12px 20px;
		bottom: 20px;
		right: 20px;
	}
} 
</style>

