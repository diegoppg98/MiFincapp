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
            Alerta:
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
                <v-btn fab dark color="#2e7d32" class="white--text" @click="clickMuteItem()">
                  <v-icon dark>{{ icon }}</v-icon>
                </v-btn>
                <v-dialog v-model="dialogOptions" style="z-index: 999">
                  <v-card outlined>
                    <v-container>
                      <v-row align="center" justify="center">
                        <v-col :cols="posMap">
                          <v-btn
                            color="#2e7d32"
                            block
                            @click.stop="dialogDatos = true"
                            class="white--text my-4"
                          >Cambiar Datos</v-btn>
                          <v-btn
                            color="#7d2f2e"
                            block
                            class="white--text"
                            @click.stop="dialog = true"
                          >Eliminar alerta</v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card>
                </v-dialog>
              </v-row>
            </v-col>
          </v-container>
          <v-dialog
            v-model="dialogDatos"
            style="z-index: 999"
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
                  required
                  clearable
                ></v-text-field>
                <v-select
                  class="my-1 mx-3"
                  v-model="finca"
                  :items="listaFincas"
                  :rules="[v => !!v || 'Finca es requerida']"
                  label="Finca"
                  required
                  style="z-index: 999"
                  @change="fincaChanged"
                  disabled
                ></v-select>
                <v-select
                  class="my-1 mx-3"
                  v-model="pivot"
                  :items="listaPivots"
                  :rules="[v => !!v || 'Pivot es requerido']"
                  label="Pivot"
                  required
                  style="z-index: 999"
                  @change="pivotChanged"
                  disabled
                ></v-select>
                <v-select
                  class="my-1 mx-3"
                  v-model="dispositivo"
                  :items="listaDispositivos"
                  :rules="[v => !!v || 'Dispositivo es requerido']"
                  label="Dispositivo"
                  required
                  style="z-index: 999"
                  @change="dispositivoChanged"
                  disabled
                ></v-select>
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
              </v-form>
            </v-card>
          </v-dialog>
          <v-card class="mx-1 my-1" outlined v-show="dispositivoSuelo">
            <v-subheader>Valores</v-subheader>
            <v-card-text>
              <v-row>
                <v-col class="px-4">
                  <v-range-slider
                    v-model="rangeSuelo"
                    :max="maxSuelo"
                    :min="minSuelo"
                    hide-details
                    class="align-center"
                    :vertical="vertical"
                    @change="sliderChanged"
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
              @change="opcionChanged"
            ></v-select>
          </v-card>
          <v-card class="mx-1 my-1" outlined v-show="dispositivoGps">
            <v-select
              v-model="gps"
              :items="opcionesGps"
              :rules="[v => !!v || 'opcion es requerida']"
              label="Gps opcion"
              style="z-index: 999"
              @change="opcionChanged"
            ></v-select>
            <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
          </v-card>
          <v-card-actions class="justify-center">
            <v-dialog v-model="dialog" max-width="290" style="z-index: 999">
              <v-card>
                <v-card-title class="headline">Confirmar eliminación</v-card-title>
                <v-card-text>Esta seguro de que desea eliminar la alerta, este procesos será irreversible.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="#2e7d32" text @click="dialog = false">Cancelar</v-btn>
                  <v-btn color="#7d2f2e" text @click="eliminarAlerta">Eliminar</v-btn>
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
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { Spain_PNOA_Ortoimagen } from '../../LeafletSpain.js';
import { Spain_MapasrasterIGN } from '../../LeafletSpain.js';
import { Spain_IGNBase } from '../../LeafletSpain.js';
import { Spain_Catastro } from '../../LeafletSpain.js';
import { Spain_UnidadAdministrativa } from '../../LeafletSpain.js';
import { parcelas } from '../../LeafletSpain';
import { recintos } from '../../LeafletSpain';
import { Alerta } from '../../Clases/Alerta';
import { Notificacion } from '../../Clases/Notificacion';
import { Utils } from '../../utils';
let FunctionsUtils: Utils = new Utils();
import { FactoryAPI } from '../../FactoryAPI';
import { Pivot } from 'app/Clases/Pivot';
import { Dispositivo } from 'app/Clases/Dispositivo';

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo: {
    title: 'DetalleAlerta',
  },
  components: {},
  data(): any {
    return {
      nombre: '',
      icon: 'mdi-volume-off',
      silenciated: true,
      finca: null,
      pivot: null,
      dispositivo: null,
      fincaKey: '',
      pivotKey: '',
      dispositivoKey: '',
      nameRules: [
        (v) => !!v || 'Nombre no puede estar vacío',
        (v) => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
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
      listaFincas: [],
      listaPivots: [],
      listaDispositivos: [],
      opcionesSuelo: ['Dentro del rango', 'Fuera del rango'],
      opcionesGps: ['Salga de la zona', 'Entre en la zona'],
      tiempoUltimaNotificacion: '',
      colorSnackbar: '',
      snackbar: false,
      textSnackbar: '',
      timeoutSnackbar: 4000,
      valid: true,
      dispositivoSuelo: false,
      dispositivoGps: true,
      lazy: false,
      isLoading: false,
      map2: '',
      localizacion: [],
      localizacionPivot: [],
      dialog: false,
      dialogOptions: false,
      dialogDatos: false,
      coorFinca: '',
      coorPivot: '',
      coorDispositivo: '',
      fincaElement: '',
      dialogMapa: true,
    };
  },
  methods: {
    ...mapActions('app', ['changeUser', 'changeAlerta']),

    opcionChanged() {
      var alertaOpcion;
      var alertaDatos;
      if (this.tipo === 'GPS') {
        alertaOpcion = this.gps;
        alertaDatos = this.localizacion;
      } else if (this.tipo === 'Suelo') {
        alertaDatos = this.rangeSuelo;
        alertaOpcion = this.suelo;
      }
      var alerta = new Alerta(
        this.getAlerta.key,
        this.nombre,
        this.tipo,
        alertaDatos,
        alertaOpcion,
        this.slider,
        this.tiempoUltimaNotificacion,
        this.silenciated,
        this.finca.key,
        this.pivot.key,
        this.dispositivo.key,
      );
      FactoryAPI.getFactoryAPI('Firebase')
        .getAlerta()
        .updateAlert(alerta)
        .then((result) => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },
    sliderChanged() {
      var alerta = new Alerta(
        this.getAlerta.key,
        this.nombre,
        this.tipo,
        this.rangeSuelo,
        this.suelo,
        this.slider,
        this.tiempoUltimaNotificacion,
        this.silenciated,
        this.finca.key,
        this.pivot.key,
        this.dispositivo.key,
      );
      FactoryAPI.getFactoryAPI('Firebase')
        .getAlerta()
        .updateAlert(alerta)
        .then((result) => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },

    clickMuteItem() {
      if (this.silenciated) {
        this.silenciated = false;
        this.icon = 'mdi-volume-high';
      } else {
        this.silenciated = true;
        this.icon = 'mdi-volume-off';
      }
      this.silenciada = this.silenciated;
      var alertaOpcion;
      var alertaDatos;
      if (this.tipo === 'GPS') {
        alertaOpcion = this.gps;
        alertaDatos = this.localizacion;
      } else if (this.tipo === 'Suelo') {
        alertaDatos = this.rangeSuelo;
        alertaOpcion = this.suelo;
      }

      var alerta = new Alerta(
        this.getAlerta.key,
        this.nombre,
        this.tipo,
        alertaDatos,
        alertaOpcion,
        this.slider,
        this.tiempoUltimaNotificacion,
        this.silenciated,
        this.finca.key,
        this.pivot.key,
        this.dispositivo.key,
      );
      FactoryAPI.getFactoryAPI('Firebase')
        .getAlerta()
        .updateAlert(alerta)
        .then((result) => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    },

    fincaChanged() {
      this.listaPivots = [];
      var pivots = this.listaPivots;
      FactoryAPI.getFactoryAPI('Firebase')
        .getPivot()
        .listPivots(this.finca.key)
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult: Pivot) {
              var pivot = childResult.nombre;
              pivots.push({ text: pivot, value: childResult });
            });
          }
        });
    },
    pivotChanged() {
      this.listaDispositivos = [];
      var dispositivos = this.listaDispositivos;
      FactoryAPI.getFactoryAPI('Firebase')
        .getDispositivo()
        .listDevices(this.pivot.key)
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult: Dispositivo) {
              var dispositivo = childResult.nombre;
              dispositivos.push({ text: dispositivo, value: childResult });
            });
          }
        });
    },
    iconTypes(tipoDispositivo: string) {
      switch (tipoDispositivo) {
        case 'GPS':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=b48f592e-2e75-40ab-b5ba-4ee6e1ba70d2';
        case 'Suelo':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Ftemperatura.png?alt=media&token=81cc83fa-b579-42d0-8638-fc4d173b0c6c';
        default:
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FGPS.png?alt=media&token=4305b91d-a064-4805-bfcb-ef45084aae52';
      }
    },
    dispositivoChanged() {
      this.dispositivoGps = true;
      this.tipo = this.dispositivo.tipo;
      if (this.tipo === 'GPS') {
        this.dispositivoSuelo = false;
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

        if (this.finca === null) router.push('/alerta');
        var localizacionFinca = this.finca.localizacion;
        var map = this.map2;
        var finca;
        var fincaJson;

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
          finca = JSON.parse(element);
          fincaJson = element;
          L.geoJSON(JSON.parse(element), {
            pane: 'pane250',
            style: myStyle,
          }).addTo(map);
        });
        this.coorFinca = finca;
        this.fincaElement = fincaJson;

        if (this.pivot === null) router.push('/alerta');
        var localizacionPivot = this.pivot.localizacion;
        var map = this.map2;
        var pivot;
        localizacionPivot.forEach(function (element, index) {
          var myStyle = {
            color: 'blue',
            weight: 5,
            opacity: 1,
          };
          pivot = JSON.parse(element);
          L.geoJSON(JSON.parse(element), {
            pane: 'pane450',
            style: myStyle,
          }).addTo(map);
        });
        this.coorPivot = pivot;

        if (this.dispositivo === null) router.push('/alerta');
        var localizacionDispositivo = this.dispositivo.localizacion;
        var coordenadasDispositivo = '';
        L.geoJSON(L.geoJSON(JSON.parse(localizacionDispositivo[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
            coordenadasDispositivo = feature.geometry.coordinates;
          },
        });
        var positions = JSON.parse(this.dispositivo.posiblesLocalizaciones);
        var coordenadaPivot = '';
        L.geoJSON(L.geoJSON(JSON.parse(this.pivot.localizacion[0])).toGeoJSON(), {
          onEachFeature: function (feature, layer) {
            coordenadaPivot = layer;
          },
        });
        var map = this.map2;
        var t = this;
        var dispositivo;
        var iconType = this.iconTypes;
        var icon = iconType(this.dispositivo.tipo);
        var iconDevice = L.icon({
          iconUrl: icon,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [-3, -76], 
        });
        localizacionDispositivo.forEach(function (element, index) {
          dispositivo = JSON.parse(element);
          L.geoJSON(JSON.parse(element), {
            pointToLayer: function (feature, latlng) {
              return L.marker(latlng, {
                icon: iconDevice,
              });
            },
          }).addTo(map);
          t.calculoPosicion(
            t.pivot.posActual,
            t.pivot.tipo,
            positions,
            coordenadaPivot,
            coordenadasDispositivo,
            t.dispositivo.tipo,
          );
        });
        this.coorDispositivo = dispositivo;
      } else if (this.tipo === 'Suelo') {
        //AQUI SOLO PIVOT
        this.dispositivoGps = false;
        this.dispositivoSuelo = true;
      }
    },

    calculoPosicion(coordPos, tipoPivot, positions, coordenadaPivot, coordenadasActualesDispositivo, tipo) {
      if (!coordPos.length == 0) {
        var pos;
        var punto1;
        var punto2;
        var latlngCenter;
        var puntoDevice = L.latLng(coordPos[0], coordPos[1]);
        if (tipoPivot === 'lineal') {
          pos = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
          punto1 = L.latLng(pos[0].x, pos[0].y);
          punto2 = L.latLng(pos[1].x, pos[1].y);
          pos = punto2;
        } else {
          if (
            Math.floor(coordenadaPivot.getLatLngs()[0].lat * Math.pow(10, 4)) / Math.pow(10, 4) ===
              Math.floor(coordenadasActualesDispositivo[1] * Math.pow(10, 4)) / Math.pow(10, 4) &&
            Math.floor(coordenadaPivot.getLatLngs()[0].lng * Math.pow(10, 4)) / Math.pow(10, 4) ===
              Math.floor(coordenadasActualesDispositivo[0] * Math.pow(10, 4)) / Math.pow(10, 4)
          ) {
            latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[1].lat, coordenadaPivot.getLatLngs()[1].lng);
          } else {
            latlngCenter = L.latLng(coordenadaPivot.getLatLngs()[0].lat, coordenadaPivot.getLatLngs()[0].lng);
          }
          pos = FunctionsUtils.closestPoint(tipoPivot, positions, puntoDevice);
          punto1 = latlngCenter;
          punto2 = pos;
        }
        var LatLngs = [];
        LatLngs.push(punto1);
        LatLngs.push(punto2);
        var LatLng = pos;
        if (tipo == 'GPS') {
          this.map2.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
              layer.setLatLng(LatLng);
            }
          });
        }

        this.map2.eachLayer(function (layer) {
          if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
            layer.setLatLngs(LatLngs);
          }
        });
      }
    },

    onSubmit() {
      this.isLoading = true;

      if (this.tipo === 'GPS') {
        var tierraLocalizacion = [];
        var layers = [];
        var coordFinca = this.fincaElement;

        this.map2.eachLayer(function (layer) {
          if (layer instanceof L.Polygon && JSON.stringify(layer.toGeoJSON()) !== coordFinca) {
            layers.push(layer);
          }
        });
        var localizacion = layers;

        localizacion.forEach(function (element, index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        });

        if (tierraLocalizacion.length === 0) {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Nueva localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
          this.isLoading = false;
        } else {
          var nombreTierra = this.finca.key; 
          var nombrePivot = this.pivot.key;
          var NombreDispositivo = this.dispositivo.key;
          var alertaNombre = this.nombre;
          var alertaOpcion = this.gps;
          var alertaTipo = this.tipo;
          var alertaTiempo = this.slider;
          var alertaMute = this.silenciated;
          var alertaUltimaNotificacion = this.tiempoUltimaNotificacion;
          var alertaKey = this.getAlerta.key;

          var alerta = new Alerta(
            alertaKey,
            alertaNombre,
            alertaTipo,
            tierraLocalizacion,
            alertaOpcion,
            alertaTiempo,
            alertaUltimaNotificacion,
            alertaMute,
            nombreTierra,
            nombrePivot,
            NombreDispositivo,
          );

          FactoryAPI.getFactoryAPI('Firebase')
            .getAlerta()
            .updateAlert(alerta)
            .then((result) => {
              this.changeAlerta(alerta);
              this.colorSnackbar = 'success';
              this.textSnackbar = 'Alerta actualizada correctamente';
              this.snackbar = true;
            })
            .catch((error) => {
              this.colorSnackbar = 'error';
              this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
              this.snackbar = true;
            });

          if (!alertaMute) {
            let current_datetime = new Date();
            var time = current_datetime.toISOString();
            if (
              alertaUltimaNotificacion === '' ||
              (Date.parse(time) - Date.parse(alertaUltimaNotificacion)) / 60000 >= alertaTiempo
            ) {
              this.tiempoUltimaNotificacion = time;
              var nombreDispositivo = this.dispositivo.nombre;
              var idDispositivo = this.dispositivo.id;
              var dispositivoLocation = this.dispositivo.localizacion;
              L.geoJSON(L.geoJSON(JSON.parse(tierraLocalizacion[0])).toGeoJSON(), {
                onEachFeature: function (feature, layer) {
                  var layerAlerta = layer;
                  L.geoJSON(L.geoJSON(JSON.parse(dispositivoLocation)).toGeoJSON(), {
                    onEachFeature: function (feature, layer) {
                      var coordenadasActualesDispositivo = feature.geometry.coordinates;
                      var punto = L.latLng(coordenadasActualesDispositivo[1], coordenadasActualesDispositivo[0]);
                      var inZone = FunctionsUtils.pointInLand(punto, layerAlerta);
                      if (alertaOpcion === 'Entre en la zona') {
                        if (inZone) {
                          var notificacion = new Notificacion('', dispositivoLocation, time, alertaKey);
                          FactoryAPI.getFactoryAPI('Firebase')
                            .getNotificacion()
                            .createNotification(notificacion)
                            .then((result) => {
                              var alertaNotificada = new Alerta(
                                alertaKey,
                                alertaNombre,
                                alertaTipo,
                                tierraLocalizacion,
                                alertaOpcion,
                                alertaTiempo,
                                time,
                                alertaMute,
                                nombreTierra,
                                nombrePivot,
                                NombreDispositivo,
                              );

                              FactoryAPI.getFactoryAPI('Firebase')
                                .getAlerta()
                                .updateAlert(alertaNotificada)
                                .then((result) => {
                                  this.changeAlerta(alerta);
                                })
                                .catch((error) => {});
                            })
                            .catch((error) => {});
                        }
                      } else if (alertaOpcion === 'Salga de la zona') {
                        if (!inZone) {
                          var notificacion = new Notificacion('', dispositivoLocation, time, alertaKey);
                          FactoryAPI.getFactoryAPI('Firebase')
                            .getNotificacion()
                            .createNotification(notificacion)
                            .then((result) => {
                              var alertaNotificada = new Alerta(
                                alertaKey,
                                alertaNombre,
                                alertaTipo,
                                tierraLocalizacion,
                                alertaOpcion,
                                alertaTiempo,
                                time,
                                alertaMute,
                                nombreTierra,
                                nombrePivot,
                                NombreDispositivo,
                              );
                              FactoryAPI.getFactoryAPI('Firebase')
                                .getAlerta()
                                .updateAlert(alertaNotificada)
                                .then((result) => {
                                  this.changeAlerta(alerta);
                                })
                                .catch((error) => {});
                            })
                            .catch((error) => {});
                        }
                      }
                    },
                  });
                },
              });
            }
          }
          this.colorSnackbar = 'success';
          this.textSnackbar = 'Alerta actualizada correctamente';
          this.snackbar = true;
          this.isLoading = false;
        }
      } else if (this.tipo === 'Suelo') {
        var nombreTierra = this.finca.key;
        var nombrePivot = this.pivot.key;
        var NombreDispositivo = this.dispositivo.key;
        var alertaNombre = this.nombre;
        var alertaDatos = this.rangeSuelo;
        var alertaOpcion = this.suelo;
        var alertaTipo = this.tipo;
        var alertaTiempo = this.slider;
        var alertaMute = this.silenciated;
        var alertaUltimaNotificacion = this.tiempoUltimaNotificacion;
        var alertaKey = this.getAlerta.key;

        var alerta = new Alerta(
          alertaKey,
          alertaNombre,
          alertaTipo,
          alertaDatos,
          alertaOpcion,
          alertaTiempo,
          alertaUltimaNotificacion,
          alertaMute,
          nombreTierra,
          nombrePivot,
          NombreDispositivo,
        );
        FactoryAPI.getFactoryAPI('Firebase')
          .getAlerta()
          .updateAlert(alerta)
          .then((result) => {
            this.changeAlerta(alerta);
            this.colorSnackbar = 'success';
            this.textSnackbar = 'Alerta actualizada correctamente';
            this.snackbar = true;
          })
          .catch((error) => {
            this.colorSnackbar = 'error';
            this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
            this.snackbar = true;
          });

        if (!alertaMute) {
          let current_datetime = new Date();
          var time = current_datetime.toISOString();
          if (
            alertaUltimaNotificacion === '' ||
            (Date.parse(time) - Date.parse(alertaUltimaNotificacion)) / 60000 >= alertaTiempo
          ) {
            this.tiempoUltimaNotificacion = time;
            var idDispositivo = this.dispositivo.id;
            var dispositivotemp = this.dispositivo.suelo;

            if (alertaOpcion === 'Dentro del rango') {
              if (dispositivotemp >= alertaDatos[0] && dispositivotemp <= alertaDatos[1]) {
                var notificacion = new Notificacion('', dispositivotemp, time, alertaKey);
                FactoryAPI.getFactoryAPI('Firebase')
                  .getNotificacion()
                  .createNotification(notificacion)
                  .then((result) => {
                    var alertaNotificada = new Alerta(
                      alertaKey,
                      alertaNombre,
                      alertaTipo,
                      tierraLocalizacion,
                      alertaOpcion,
                      alertaTiempo,
                      time,
                      alertaMute,
                      nombreTierra,
                      nombrePivot,
                      NombreDispositivo,
                    );
                    FactoryAPI.getFactoryAPI('Firebase')
                      .getAlerta()
                      .updateAlert(alertaNotificada)
                      .then((result) => {
                        this.changeAlerta(alerta);
                      })
                      .catch((error) => {});
                  })
                  .catch((error) => {});
              }
            } else if (alertaOpcion === 'Fuera del rango') {
              if (dispositivotemp < alertaDatos[0] || dispositivotemp > alertaDatos[1]) {
                var notificacion = new Notificacion('', dispositivotemp, time, alertaKey);
                FactoryAPI.getFactoryAPI('Firebase')
                  .getNotificacion()
                  .createNotification(notificacion)
                  .then((result) => {
                    var alertaNotificada = new Alerta(
                      alertaKey,
                      alertaNombre,
                      alertaTipo,
                      tierraLocalizacion,
                      alertaOpcion,
                      alertaTiempo,
                      time,
                      alertaMute,
                      nombreTierra,
                      nombrePivot,
                      NombreDispositivo,
                    );
                    FactoryAPI.getFactoryAPI('Firebase')
                      .getAlerta()
                      .updateAlert(alertaNotificada)
                      .then((result) => {
                        this.changeAlerta(alerta);
                      })
                      .catch((error) => {});
                  })
                  .catch((error) => {});
              }
            }
          }
        }
        this.colorSnackbar = 'success';
        this.textSnackbar = 'Alerta actualizada correctamente';
        this.snackbar = true;
        this.isLoading = false;
      }
    },
    async eliminarAlerta() {
      this.dialog = false;
      var alertaNombre = this.nombre;
      FactoryAPI.getFactoryAPI('Firebase')
        .getAlerta()
        .deleteAlert(this.getAlerta.key)
        .then((result) => {
          router.push('/alerta');
          this.isLoading = false;
        })
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al eliminar la alerta. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
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
    vertical() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true;
        case 'sm':
          return false;
        case 'md':
          return false;
        case 'lg':
          return false;
        case 'xl':
          return false;
      }
    },
    ...mapGetters('app', ['getAlerta']),
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
    }).addLayer(mapboxTiles1);

    L.control
      .scale({
        options: { position: 'bottomleft', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false },
      })
      .addTo(this.map2);
    Spain_PNOA_Ortoimagen.addTo(this.map2);
    this.map2.pm.setLang('es');
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
    var myStyleRectangle = {
      color: 'black',
      weight: 5,
      opacity: 0.65,
    };
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
    this.map2.createPane('pane250').style.zIndex = 250; // between tiles and overlays
    this.map2.createPane('pane450').style.zIndex = 450; // between overlays and shadows
    this.map2.createPane('pane620').style.zIndex = 620; // between markers and tooltips
    this.map2.createPane('pane800').style.zIndex = 800; // above popups

    this.map2.on('pm:create', (e) => {
      var tierraLocalizacion = [];
      var layers = [];
      var coordFinca = this.fincaElement;

      this.map2.eachLayer(function (layer) {
        if (layer instanceof L.Polygon && JSON.stringify(layer.toGeoJSON()) !== coordFinca) {
          layers.push(layer);
        }
      });
      var localizacion = layers;

      localizacion.forEach(function (element, index) {
        tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
      });

      this.map2.pm.addControls({
        drawRectangle: false,
      });
      e.layer.setStyle(myStyleRectangle);

      var alerta = new Alerta(
        this.getAlerta.key,
        this.nombre,
        this.tipo,
        tierraLocalizacion,
        this.gps,
        this.slider,
        this.tiempoUltimaNotificacion,
        this.silenciated,
        this.finca.key,
        this.pivot.key,
        this.dispositivo.key,
      );
      FactoryAPI.getFactoryAPI('Firebase')
        .getAlerta()
        .updateAlert(alerta)
        .then((result) => {})
        .catch((error) => {
          this.colorSnackbar = 'error';
          this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
          this.snackbar = true;
        });
    });

    this.map2.on('pm:remove', (e) => {
      if (e.layer instanceof L.Polygon && JSON.stringify(e.layer.toGeoJSON()) !== this.fincaElement) {

        this.map2.pm.addControls({
          drawRectangle: true,
        });
      } else if (e.layer instanceof L.Polygon) {
        L.geoJSON(this.coorFinca, {
          pane: 'pane250',
          style: myStylePolygon,
        }).addTo(this.map2);
      } else if (e.layer instanceof L.Polyline && !(e.layer instanceof L.Polygon)) {

        L.geoJSON(this.coorPivot, {
          pane: 'pane450',
          style: myStyleLine,
        }).addTo(this.map2);
      } else if (e.layer instanceof L.Marker) {
        //crearlo con el style y debajo de la linea
        var iconType = this.iconTypes;
        var icon = iconType(this.tipo);
        var iconDevice = L.icon({
          iconUrl: icon,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [-3, -76], 
        });
        L.geoJSON(this.coorDispositivo, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: iconDevice,
            });
          },
        }).addTo(this.map2);
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

    var searchControl = L.esri.Geocoding.geosearch().addTo(this.map2);

    var results = L.layerGroup().addTo(this.map2);

    searchControl.on('results', function (data) {
      results.clearLayers();
      for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });
    this.dispositivoGps = false;

    if (this.getAlerta === null) router.push('/alerta');
    else {
      if (this.getAlerta === null) router.push('/alerta');
      this.nombre = this.getAlerta.nombre;

      this.tipo = this.getAlerta.tipo;
      this.fincaKey = this.getAlerta.tierra;
      this.pivotKey = this.getAlerta.pivot;
      this.dispositivoKey = this.getAlerta.dispositivo;
      this.slider = this.getAlerta.tiempo;
      this.silenciated = this.getAlerta.silenciada;
      this.tiempoUltimaNotificacion = this.getAlerta.tiempoUltimaAlerta;

      var tierras = this.listaFincas;
      var t = this;
      FactoryAPI.getFactoryAPI('Firebase')
        .getFinca()
        .listLands()
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult) {
              var finca = childResult.nombre;
              tierras.push({ text: finca, value: childResult });

              if (childResult.key == t.fincaKey) {
                var localizacionFinca = childResult.localizacion;
                t.finca = childResult;
                var map = t.map2;
                var finca;
                var fincaJson;
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
                  fincaJson = element;
                  finca = JSON.parse(element);
                  L.geoJSON(JSON.parse(element), {
                    pane: 'pane250',
                    style: myStyle,
                  }).addTo(map);
                });
                t.fincaElement = fincaJson;
                t.coorFinca = finca;
              }
            });
          }
        });

      var pivots = this.listaPivots;
      FactoryAPI.getFactoryAPI('Firebase')
        .getPivot()
        .listPivots(this.fincaKey)
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult) {
              var pivot = childResult.nombre;
              pivots.push({ text: pivot, value: childResult });

              if (childResult.key == t.pivotKey) {
                var localizacionPivot = childResult.localizacion;
                t.pivot = childResult;
                var map = t.map2;
                var pivot;
                localizacionPivot.forEach(function (element, index) {
                  var myStyle = {
                    color: 'blue',
                    weight: 5,
                    opacity: 1,
                  };
                  pivot = JSON.parse(element);
                  L.geoJSON(JSON.parse(element), {
                    pane: 'pane450',
                    style: myStyle,
                  }).addTo(map);
                });
                t.coorPivot = pivot;
              }
            });
          }
        });
      var iconType = this.iconTypes;
      var t = this;
      var dispositivos = this.listaDispositivos;
      FactoryAPI.getFactoryAPI('Firebase')
        .getDispositivo()
        .listDevices(this.pivotKey)
        .then((result) => {
          if (result !== null) {
            result.forEach(function (childResult) {
              var dispositivo = childResult.nombre;
              dispositivos.push({ text: dispositivo, value: childResult });

              if (childResult.key == t.dispositivoKey) {
                var localizacionDispositivo = childResult.localizacion;
                t.dispositivo = childResult;
                var map = t.map2;
                var dispositivo;

                var icon = iconType(childResult.tipo);
                var iconDevice = L.icon({
                  iconUrl: icon,
                  iconSize: [30, 42],
                  iconAnchor: [15, 42],
                  popupAnchor: [-3, -76], 
                });

                localizacionDispositivo.forEach(function (element, index) {
                  dispositivo = JSON.parse(element);
                  L.geoJSON(JSON.parse(element), {
                    pointToLayer: function (feature, latlng) {
                      return L.marker(latlng, {
                        icon: iconDevice,
                      });
                    },
                  }).addTo(map);

                  if (t.dispositivo.tipo == 'GPS') {
                    var coordenadasDispositivo = '';
                    L.geoJSON(L.geoJSON(JSON.parse(localizacionDispositivo[0])).toGeoJSON(), {
                      onEachFeature: function (feature, layer) {
                        coordenadasDispositivo = feature.geometry.coordinates;
                      },
                    });
                    var positions = JSON.parse(t.dispositivo.posiblesLocalizaciones);
                    var coordenadaPivot = '';
                    L.geoJSON(L.geoJSON(JSON.parse(t.pivot.localizacion[0])).toGeoJSON(), {
                      onEachFeature: function (feature, layer) {
                        coordenadaPivot = layer;
                      },
                    });
                    t.calculoPosicion(
                      t.pivot.posActual,
                      t.pivot.tipo,
                      positions,
                      coordenadaPivot,
                      coordenadasDispositivo,
                      t.dispositivo.tipo,
                    );
                  }
                });
                t.coorDispositivo = dispositivo;
              }
            });
          }
        });

      if (this.silenciated) this.icon = 'mdi-volume-off';
      else this.icon = 'mdi-volume-high';

      if (this.tipo === 'GPS') {
        this.localizacion = this.getAlerta.datos;
        var map = this.map2;
        var myStyle = {
          color: 'black',
          weight: 5,
          opacity: 0.65,
        };

        this.localizacion.forEach(function (element, index) {
          L.geoJSON(JSON.parse(element), {
            style: myStyle,
          }).addTo(map);
        });

        this.gps = this.getAlerta.opcion;
        this.dispositivoGps = true;
      } else if (this.tipo === 'Suelo') {
        this.suelo = this.getAlerta.opcion;
        this.rangeSuelo = this.getAlerta.datos;
        this.dispositivoSuelo = true;
      }
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
</style>
