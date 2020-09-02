<template>
  <div>
    <v-card class="mx-2 my-2">
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
        item-key="notification.key"
        @click:row="clicked"
        :headers="headers"
        :items="items"
        :items-per-page="itemsPerPage"
        :page.sync="page"
        hide-default-footer
        @page-count="pageCount = $event"
        class="elevation-1"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
      >
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >Tu búsqueda por "{{ search }}" no ha encontrado resultados.</v-alert>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            Detalle Alerta:
            <v-icon small class="mr-2" @click="clickAlerta(item)">mdi-alert</v-icon>Eliminar:
            <v-icon small color="pink" @click="deleteItem(item)">mdi-delete</v-icon>
          </td>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
        <v-text-field
          :value="itemsPerPage"
          label="Elementos por pagina"
          type="number"
          min="0"
          max="100"
          @input="itemsPerPage = parseInt($event, 10)"
        ></v-text-field>
      </div>

      <v-card ref="mapaShow" id="mapaShow" outlined>
        <div class="d-block" style="height: 350px;" ref="mapa" id="mapa">
          <v-layout v-if="!dialogOpciones">
            <v-btn
              small
              rounded
              id="optionButton"
              class="mx-3 my-5"
              @click="mostrarOpciones"
              color="grey"
            >Mostrar Opciones</v-btn>
          </v-layout>
          <v-layout v-if="dialogOpciones">
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


      <v-dialog v-model="dialog" max-width="290" style="z-index: 999">
        <v-card>
          <v-card-title class="headline">Confirmar eliminación</v-card-title>

          <v-card-text>Esta seguro de que desea eliminar la notificacion, este procesos será irreversible.</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="success" text @click="dialog = false">Cancelar</v-btn>

            <v-btn color="error" text @click="eliminarNotificacion">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { router } from '../../router';
import { mapActions } from 'vuex';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Utils} from '../../utils';
let FunctionsUtils: Utils = new Utils();
import { Spain_PNOA_Ortoimagen } from '../../LeafletSpain';
import { Spain_MapasrasterIGN } from '../../LeafletSpain';
import { Spain_IGNBase } from '../../LeafletSpain';
import { Spain_Catastro } from '../../LeafletSpain';
import { Spain_UnidadAdministrativa } from '../../LeafletSpain';
import { parcelas } from '../../LeafletSpain';
import { recintos } from '../../LeafletSpain';
import { Notificacion } from '../../Clases/Notificacion';
import { FactoryAPI } from '../../FactoryAPI';
export default {
  metaInfo: {
    title: 'Notificacion',
  },
  data: () => ({
    item: 1,
    items: [],
    dialog: false,
    expanded: [],
    singleExpand: false,
    itemActual: '',
    page: 1,
    sortBy: 'tiempo',
    sortDesc: true,
    pageCount: 0,
    itemsPerPage: 5,
    search: '',
    dialogOpciones: false,
    headers: [
      { text: 'Alerta', value: 'nombreAlerta' },
      { text: 'Tiempo', value: 'tiempo' },
      { text: '', value: 'data-table-expand' },
    ],
  }),
  components: {},
  methods: {
    ...mapActions('app', ['changeAlerta']),
    mostrarOpciones() {
      var lc = document.getElementsByClassName('leaflet-control-layers');
      if (this.dialogOpciones) {
        lc[0].style.visibility = 'hidden';
        this.dialogOpciones = false;
      } else {
        lc[0].style.visibility = 'visible';
        this.dialogOpciones = true;
      }
    },

    deleteItem(nombreClicked) {
      this.itemActual = nombreClicked.notification.key;
      this.dialog = true;
    },

    clickAlerta(nombreClicked) {
      this.changeAlerta(nombreClicked.alerta);
      router.push('/detalle-alerta');
    },
    eliminarNotificacion() {
      this.dialog = false;
      FactoryAPI.getFactoryAPI('Firebase')
        .getNotificacion()
        .deleteNotification(this.itemActual)
        .then((result) => {
          for (var k = 0; k < this.items.length; k++) {
            if (this.itemActual === this.items[k].notification.key) this.items.splice(k, 1);
          }
        })
        .catch((error) => {
          /*this.colorSnackbar = "error";
           this.textSnackbar = 'Error al eliminar la notificacion. Por favor inténtelo otra vez';
           this.snackbar = true;*/
        });
    },
iconTypes(tipoDispositivo :string){
      switch (tipoDispositivo) {
            case 'GPS':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=b48f592e-2e75-40ab-b5ba-4ee6e1ba70d2';
            case 'Suelo':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Ftemperatura.png?alt=media&token=81cc83fa-b579-42d0-8638-fc4d173b0c6c';
            default:
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=4305b91d-a064-4805-bfcb-ef45084aae52';
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
    
    
    
    
    
    clicked(value) {
    if(value.alerta.tipo == 'GPS'){
    document.getElementById("mapaShow").style.display = "block";
      if (this.map2 && this.map2.remove) {
        this.map2.off();
        this.map2.remove();
      }
      /////////////

      const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';
      const mapboxTiles1 = L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`,
      );

      this.map2 = L.map(this.$refs['mapa'], {
        fullscreenControl: true,
        attributionControl: false,
      })
        .setView([0, 0], 1)
        .addLayer(mapboxTiles1);

      var baselayers = {
        Normal: mapboxTiles1,
        'Vista Real': Spain_PNOA_Ortoimagen,
        'Mapa España': Spain_MapasrasterIGN,
        'Mapa España y Mundo': Spain_IGNBase,
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
      var lc = document.getElementsByClassName('leaflet-control-layers');
      lc[0].style.visibility = 'hidden';

      this.map2.pm.setLang('es');
      
      this.map2.on('fullscreenchange', function () {
        if (map.isFullscreen()) {
          //console.log('entered fullscreen');
        } else {
          document.getElementById("mapaShow").style.display = "none";
        }
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
      //var tiles = L.esri.basemapLayer("Streets").addTo(this.map2);
      var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);

      var results = L.layerGroup().addTo(this.map2);

      searchControl.on('results', function (data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        }
      });
      this.map2.createPane('pane250').style.zIndex = 250; // between tiles and overlays
      this.map2.createPane('pane450').style.zIndex = 450; // between overlays and shadows
      this.map2.createPane('pane620').style.zIndex = 620; // between markers and tooltips
      this.map2.createPane('pane800').style.zIndex = 800; // above popups

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

      //////////7
      var t = this;
      this.map2.eachLayer(function (layer) {
        if (
          layer instanceof L.Rectangle ||
          layer instanceof L.Polygon ||
          layer instanceof L.Polyline ||
          layer instanceof L.Marker
        )
          t.map2.removeLayer(layer);
      });

      var map = this.map2;
      
      this.map2.toggleFullscreen();

      if (value.alerta === null) router.push('/alerta');
      var finca = value.alerta.tierra;
      var pivot = value.alerta.pivot;
      var dispositivo = value.alerta.dispositivo;
      var localizacion = value.alerta.datos;
      var map = this.map2;
      var myStyle = {
        color: 'purple',
        weight: 5,
        opacity: 0.65,
      };

      localizacion.forEach(function (element, index) {
        L.geoJSON(JSON.parse(element), {
          style: myStyle,
        }).addTo(map);
      });

      FactoryAPI.getFactoryAPI('Firebase')
        .getFinca()
        .landInformation(finca)
        .then((result) => {
          if (result === null) router.push('/alerta');
          var localizacionFinca = result.localizacion;
          var map = this.map2;
          L.geoJSON(L.geoJSON(JSON.parse(localizacionFinca[0])).toGeoJSON(), {
            onEachFeature: function (feature, layer) {
              map.fitBounds(layer.getBounds());
            },
          });
          localizacionFinca.forEach(function (element, index) {
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
        });

      FactoryAPI.getFactoryAPI('Firebase')
        .getPivot()
        .pivotInformation(pivot)
        .then((result) => {
          if (result === null) router.push('/alerta');
          var localizacion = result.localizacion;
          var tipoPivot = result.tipo;
          var coordPos = result.posActual;
          var localizacion = result.localizacion;
          var coordenadaPivot = '';
          L.geoJSON( L.geoJSON(JSON.parse(localizacion[0])).toGeoJSON(), {
            onEachFeature: function (feature, layer) {
              coordenadaPivot = layer;
            },
          });
          var map = this.map2;
          localizacion.forEach(function (element, index) {
            var myStyle = {
              color: 'blue',
              weight: 5,
              opacity: 1,
            };
            L.geoJSON(JSON.parse(element), {
              pane: 'pane450',
              style: myStyle,
            }).addTo(map);
          });
        
      FactoryAPI.getFactoryAPI('Firebase')
        .getDispositivo()
        .deviceInformation(dispositivo)
        .then((result) => {
          if (result === null) router.push('/alerta');
          var localizacion = result.localizacion;
          var tipo = result.tipo;
          var positions = JSON.parse(result.posiblesLocalizaciones); 
          var coordenadasDispositivo = '';
              L.geoJSON( L.geoJSON(JSON.parse(result.localizacion[0])).toGeoJSON(), {
                 onEachFeature: function (feature, layer) {
                       coordenadasDispositivo = feature.geometry.coordinates;
                 },
              });
          var map = this.map2;
          var t = this;
          var iconType = this.iconTypes;
          var icon = iconType(result.tipo);
          var iconDevice = L.icon({
    iconUrl: icon,
            iconSize: [30, 42],
            iconAnchor: [15, 42],  
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
           });
          localizacion.forEach(function (element, index) {
            L.geoJSON(JSON.parse(element), {
                   pointToLayer: function (feature, latlng) {
                          return L.marker(latlng, {
                             icon: iconDevice,
                          });
                     }
                }).addTo(map);
                t.calculoPosicion(coordPos,tipoPivot,positions,coordenadaPivot,coordenadasDispositivo,tipo);
                
                value.medida.forEach(function (element, index) {
        ///CAMBIAR ICONO MEDIDA
        var yellowIcon = new L.Icon({
          iconUrl:
            'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        var marker = L.geoJSON(JSON.parse(element), {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: yellowIcon,
            });
          },
        }).addTo(map);
      });
      
          });

        });
        
        });
        }
    },
  },

  mounted() {
    //setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
    window.onload = function() {
      document.getElementById("mapaShow").style.display = "none";
    };
  },
  beforeMount() {
    window.onbeforeunload = function () {
      window.setTimeout(function () {
        window.location = '/perfil';
      }, 0);
      window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser
    };

    var items = this.items;

    FactoryAPI.getFactoryAPI('Firebase')
      .getNotificacion()
      .listNotification()
      .then((result) => {
        if (result !== null) {
          result.forEach(function (childResult) {
            var medida = childResult.medida;
            var time = childResult.tiempo;
            var msec = Date.parse(time);
            var date = new Date(msec);
            var tiempo = date.toLocaleString();
            var keyAlert = childResult.alerta;
            var keyNotification = childResult.key;

            //  items.push( { medida: medida ,tiempo: tiempo , icon: 'mdi-bell', notification: childResult});

            FactoryAPI.getFactoryAPI('Firebase')
              .getAlerta()
              .alertInformation(keyAlert)
              .then((result) => {
                if (result !== null) {
                  var nombre = result.nombre;
                  items.push({
                    nombreAlerta: nombre,
                    medida: medida,
                    tiempo: tiempo,
                    icon: 'mdi-bell',
                    notification: childResult,
                    alerta: result,
                  });
                }
              });
          });
        }
      });
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
