<template>
   <div>
  <v-app>
  <v-snackbar
      v-model="snackbar"
      :timeout="timeoutSnackbar"
      :color="colorSnackbar"
    >
      {{ textSnackbar }}
      <v-btn
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/alerta'>
        <v-icon dark left>mdi-arrow-left</v-icon>
   </v-btn>
   <v-form
      class="mx-10 my-12"
      dark
      ref="form"
      v-model="valid"
      :lazy-validation="lazy"
    >
      <v-text-field
        v-model="nombre"
        disabled
        label="Nombre"
        required
      ></v-text-field>

      <v-select
        v-model="finca"
        :items="listaFincas"
        disabled
        label="Finca"
        required
      ></v-select>

      <v-select
        v-model="pivot"
        :items="listaPivots"
        disabled
        label="Pivot"
        required
      ></v-select>

      <v-select
        v-model="dispositivo"
        :items="listaDispositivos"
        disabled
        label="Dispositivo"
        required
      ></v-select>

   <v-card
      class="mx-10 my-12"
      outlined
      v-show="dispositivoTemperatura"
   >
      <v-text-field
          label="Temperatura"
          suffix="°C"
          v-model="DatoTemperatura"
          required
          type="number"
        ></v-text-field>

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
      <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
   </v-card>

   <v-btn
      :disabled="!valid"
      :loading="isLoading"
      color="success"
      class="mr-4"
      @click="onSubmit"
   >
      Guardar
   </v-btn>
  </v-form> 
 <v-card-actions class="justify-center">
<v-btn @click.stop="dialog = true" color="error">
    Eliminar alerta
  </v-btn>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmacion de eliminacion</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar la alerta, este procesos será irreversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="eliminarAlerta"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-card-actions>

 </v-app>
</div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'DetalleAlerta',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',
      finca: null,
      pivot: null,
      dispositivo: null,
      temperatura: 'Mayor',
      DatoTemperatura: '28',
      gps: 'Entre en la zona',
      descripcion: '',
      tipo: '',
      select: null,
      listaFincas: [
      ],
      listaPivots: [
      ],
      listaDispositivos: [
      ],
      opcionesTemperatura: [
      'Igual',
      'Mayor',
      'Menor',
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
      dispositivoGps: false,
      lazy: false,
      isNameRepeated: false,
      isLoading: false,
      map2: '',
      localizacion: [],
      dialog: false,
    };
  },
  methods: {
     onSubmit() {
       this.isLoading = true;   

       if(this.tipo === 'GPS'){
       var tierraLocalizacion = [];
        var layers = []; 
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Rectangle) {     
             layers.push(layer); 
        }                    
        })
       this.localizacion = layers;
     
       this.localizacion.forEach(function(element,index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
 
       if(tierraLocalizacion.length === 0){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Nueva localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
          this.isLoading = false;
       }      

       else{
         var nombreTierra = this.finca;
         var nombrePivot = this.pivot;
         var NombreDispositivo = this.dispositivo;
         var alertaNombre = this.nombre;
         var alertaOpcion = this.gps;
         var alertaDescripcion = this.descripcion;
         var alertaTipo = this.tipo;  
         FunctionsDatabase.updateAlert(alertaNombre, alertaTipo, alertaDescripcion, tierraLocalizacion, alertaOpcion, nombreTierra, nombrePivot, NombreDispositivo);
   	 this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta actualizada correctamente';
         this.snackbar = true;
         this.isLoading = false;
       }
       }

       else if(this.tipo === 'Temperatura'){
         var nombreTierra = this.finca;
         var nombrePivot = this.pivot;
         var NombreDispositivo = this.dispositivo;
         var alertaNombre = this.nombre;
         var alertaDatos = []; 
         var alertaOpcion = this.temperatura;
         var alertaDescripcion = this.descripcion;
         var alertaTipo = this.tipo;
         alertaDatos.push(this.DatoTemperatura);
         FunctionsDatabase.updateAlert(alertaNombre, alertaTipo, alertaDescripcion, alertaDatos, alertaOpcion, nombreTierra, nombrePivot, NombreDispositivo);
   	 this.colorSnackbar = "success";
         this.textSnackbar = 'Alerta actualizada correctamente';
         this.snackbar = true;
         this.isLoading = false;
       }
    },
    async eliminarAlerta() {
      this.dialog = false;
      var alertaNombre = this.nombre;
      FunctionsDatabase.deleteAlert(alertaNombre); 
      router.push('/alerta');
    },

  },
  computed: {
    ...mapGetters('app', [ 'getNombreAlerta']),
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
   this.map2 = L.map(this.$refs['mapa'])
     .addLayer(mapboxTiles1);
   this.map2.pm.setLang('es');
   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: false,
     drawRectangle: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     editeModel: false,
     dragMode: true,
     cutPolygon: false,
   });
 },

 beforeMount() {
     FunctionsDatabase.alertInformation(this.getNombreAlerta).then((result) =>{
        if(result === null) router.push('/alerta');
        this.nombre = result.nombre[0];
        this.descripcion = result.descripcion[0];
        this.tipo = result.tipo[0];
        this.listaFincas.push(result.nombreTierra[0]);
        this.listaPivots.push(result.nombrePivot[0]);
        this.listaDispositivos.push(result.nombreDispositivo[0]);
        this.finca = result.nombreTierra[0];
        this.pivot = result.nombrePivot[0];
        this.dispositivo = result.nombreDispositivo[0];

        if(this.tipo === 'GPS'){
        
        this.localizacion = result.datosAlerta[0];
        var map = this.map2;

        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        }) 
         
        this.gps = result.opcionAlerta[0];
        this.dispositivoGps = true;
        FunctionsDatabase.landInformation(this.finca).then((result) =>{
          if(result === null) router.push('/alerta');
          this.localizacion = result.localizacion[0];
          var map = this.map2;
          L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
             onEachFeature: function (feature, layer) {
                map.setView([feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]], 13);
             },
          });
          this.localizacion.forEach(function(element,index) {
             L.geoJSON(JSON.parse(element)).addTo(map);
          })  
        });
        FunctionsDatabase.pivotInformation(this.finca, this.pivot).then((result) =>{
          if(result === null) router.push('/alerta');
          this.localizacion = result.localizacion[0];
          var map = this.map2;
          this.localizacion.forEach(function(element,index) {
             L.geoJSON(JSON.parse(element)).addTo(map);
          })  
        });
        FunctionsDatabase.deviceInformation(this.finca, this.pivot, this.dispositivo).then((result) =>{
          if(result === null) router.push('/alerta');
          this.localizacion = result.localizacion[0];
          var map = this.map2;
          this.localizacion.forEach(function(element,index) {
             L.geoJSON(JSON.parse(element)).addTo(map);
          })  
        });

        }

        else if(this.tipo === 'Temperatura'){
          this.temperatura = result.opcionAlerta[0];
          this.DatoTemperatura = result.datosAlerta[0];
          this.dispositivoTemperatura = true;
        }
    });
  },
};
</script>

<style>
</style>
