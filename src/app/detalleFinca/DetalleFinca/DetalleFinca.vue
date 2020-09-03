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
            Finca:
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
                    <v-container>
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
                          >Eliminar finca</v-btn>
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
                      <v-img
                        id="image"
                        src="https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FPivot2.jpeg?alt=media&token=dbb7694b-980f-4622-9747-b77d91e8c467"
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
            @click="registrarPivot"
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
          <v-dialog
            v-model="dialogDatos"
            style="z-index: 9999"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
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
                  clearable
                  required
                ></v-text-field>
                <v-text-field class="my-1 mx-2" v-model="tamaño" label="Tamaño (opcional)"></v-text-field>
                <v-select
                  class="my-1 mx-3"
                  v-model="cultivo"
                  :items="tiposCultivos"
                  label="Cultivo (opcional)"
                  style="z-index: 999"
                ></v-select>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog" max-width="290" style="z-index: 9999">
            <v-card>
              <v-card-title class="headline">Confirmar eliminación</v-card-title>
              <v-card-text>Esta seguro de que desea eliminar la finca, este procesos será irreversible.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#2e7d32" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="#7d2f2e" text @click="eliminarFinca">Eliminar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script lang="ts">
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { Utils } from '../../utils';
let FunctionsUtils: Utils = new Utils();
import { Spain_PNOA_Ortoimagen } from '../../LeafletSpain.js';
import { Spain_MapasrasterIGN } from '../../LeafletSpain.js';
import { Spain_IGNBase } from '../../LeafletSpain.js';
import { Spain_Catastro } from '../../LeafletSpain.js';
import { Spain_UnidadAdministrativa } from '../../LeafletSpain.js';
import { parcelas } from '../../LeafletSpain';
import { recintos } from '../../LeafletSpain';
import { Finca } from '../../Clases/Finca';
import { FactoryAPI } from '../../FactoryAPI';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo: {
    title: 'DetalleFinca',
  },
  components: {},
  data(): any {
    return {
      nombre: '',
      tamaño: '',
      cultivo: null,
      nameRules: [
        (v) => !!v || 'Nombre no puede estar vacío',
        (v) => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
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
      items: [],
      dialog: false,
      dialogOptions: false,
      dialogDatos: false,
      dialogMapaOptions: false,
      layerFinca: '',
    };
  },


  methods: {
    ...mapActions('app', ['changePivot', 'changeUser', 'changeFinca']),
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
    async onSubmit() {
      this.isLoading = true;
      var tierraLocalizacion = [];
      var layers = [];

      if (this.map2) {
        this.map2.eachLayer(function (layer) {
          if (layer instanceof L.Polygon) {
            layers.push(layer);
          }
        });
        this.localizacion = layers;
        this.localizacion.forEach(function (element, index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        });
      } else {
        tierraLocalizacion = this.localizacion;
      }
      if (tierraLocalizacion.length === 0) {
        this.colorSnackbar = 'error';
        this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
        this.snackbar = true;
        this.isLoading = false;
      } else {
        var t = this;

        var tierraNombre = this.nombre;
        var tierraTamaño = this.tamaño;
        var tierraCultivo = this.cultivo;

        var finca = new Finca(this.getFinca.key, tierraNombre, tierraTamaño, tierraCultivo, tierraLocalizacion);
        FactoryAPI.getFactoryAPI('Firebase')
          .getFinca()
          .updateLand(finca)
          .then((result) => {
            this.changeFinca(finca);
            this.colorSnackbar = 'success';
            this.textSnackbar = 'Tierra actualizada correctamente';
            this.snackbar = true;
            // router.push('/finca');
            this.isLoading = false;
          })
          .catch((error) => {
            this.colorSnackbar = 'error';
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
      FactoryAPI.getFactoryAPI('Firebase')
        .getFinca()
        .deleteLand(this.getFinca.key)
        .then((result) => {
          router.push('/finca');
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al eliminar la tierra. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },
    clickItem(nombreClicked) {
      this.changePivot(nombreClicked.pivot);
      router.push('/detalle-pivot');
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
          fullscreenControl: true,
          attributionControl: false,
        }).setView([0, 0], 1);
        var baselayers = {
          Normal: mapboxTiles1,
          'Vista Real': Spain_PNOA_Ortoimagen,
          'Mapa España': Spain_MapasrasterIGN,
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

        this.map2.pm.setLang('es');

        this.map2.on('fullscreenchange', function () {
          if (map.isFullscreen()) {
          } else {
            document.getElementById('mapaShow').style.display = 'none';
          }
        });

        var myStyle = {
          color: 'red',
          weight: 5,
          opacity: 0.65,
        };

        this.map2.on('pm:create', (e) => {
          var hectareas = (LGeo.area(e.layer) / 10000).toFixed(2);
          e.layer.bindPopup(hectareas + ' hectáreas');
          e.layer.openPopup();
          this.tamaño = hectareas + ' hectáreas';
          this.map2.pm.addControls({
            drawPolygon: false,
          });
          e.layer.setStyle(myStyle);
          var map = this.map2;
          var layer = e.layer;
          e.layer.on('pm:edit', (e) => {
            map.fitBounds(layer.getBounds());
          });
        });

        this.map2.on('pm:remove', (e) => {
          this.map2.pm.addControls({
            drawPolygon: true,
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
        this.map2.fitBounds(this.layerFinca.getBounds());

        if (this.items.length > 0) {
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
        } else {
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
        var map = this.map2;
        this.localizacion.forEach(function (element, index) {
          var myStyle = {
            color: 'red',
            weight: 5,
            opacity: 0.65,
          };

          L.geoJSON(JSON.parse(element), {
            style: myStyle,
          }).addTo(map);
        });
        this.map2.toggleFullscreen();
      } else {
        document.getElementById('mapaShow').style.display = 'block';
        this.map2.toggleFullscreen();
      }
    },
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
    ...mapGetters('app', ['getFinca']),
  },

  mounted() {

    if (this.getFinca === null) router.push('/finca');
    else {
      FactoryAPI.getFactoryAPI('Firebase')
        .getPivot()
        .listPivots(this.getFinca.key)
        .then((result) => {
          var items = this.items;
          var arrayPivots = [];
          if (result !== null) {
            result.forEach(function (childResult) {
              var pivot = childResult.nombre;
              var label = pivot;
              arrayPivots.push(childResult);
              items.push({
                text: label,
                icon: 'mdi-water-pump',
                pivot: childResult,
                src: 'https://i.ytimg.com/vi/B_RgooXDHvA/maxresdefault.jpg',
              });
            });
          }
        });

      this.nombre = this.getFinca.nombre;
      this.localizacion = this.getFinca.localizacion;
      var layers;

      L.geoJSON(L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
        onEachFeature: function (feature, layer) {
          layers = layer;
        },
      });

      this.layerFinca = layers;
      this.tamaño = this.getFinca.tamaño;
      if (this.getFinca.cultivo) this.cultivo = this.getFinca.cultivo;
    }
  },
  beforeMount() {
    window.onbeforeunload = function () {
      window.setTimeout(function () {
        window.location.href = '/perfil';
      }, 0);
      window.onbeforeunload = null; 
    };
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

#image {
  border-radius: 24px;
}

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
