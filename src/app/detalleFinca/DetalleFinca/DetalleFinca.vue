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

   <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/finca'>
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
        label="Nombre"
        required
        disabled
      ></v-text-field>

     <v-textarea
         v-model="descripcion"
         clearable
     >
      <template v-slot:label>
        <div>
          Descripcion <small>(opcional)</small>
        </div>
      </template>
     </v-textarea>

      <v-text-field
        v-model="tamaño"
        label="Tamaño (opcional)"
      ></v-text-field>

      <v-text-field
        v-model="cultivo"
        label="Cultivo (opcional)"
      ></v-text-field>
     <div class="d-block" style="height: 350px;" ref="mapa" id="mapa"></div>
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
  <v-btn @click="registrarPivot" color="error">
    Registrar nuevo pivot
  </v-btn>

  <v-btn @click.stop="dialog = true" color="error">
    Eliminar finca
  </v-btn>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmacion de eliminacion</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar la finca, este procesos será irreversible.
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
            @click="eliminarFinca"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


</v-card-actions>
 <v-list rounded>
      <v-list-item-group v-model="item" background-color= "red" >
        <v-list-item       
          style="background:#26da3a"
          v-for="item in items"
          :key="item.text"
          @click="clickItem(item.text)"
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
  </v-app>

 </div> 
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
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
    title: 'DetalleFinca',
  },
  components: {
  },
  data(): any {
    return {
      nombre: '',        
      descripcion: '',
      tamaño: '',
      cultivo: '',
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
    };
  },
  methods: {
     ...mapActions('app', ['changeNombrePivot']),

      onSubmit() {   
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
          var tierraNombre = this.nombre;
          var tierraDescripcion = this.descripcion;
          var tierraTamaño = this.tamaño;
          var tierraCultivo = this.cultivo;

         FunctionsDatabase.updateLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Tierra actualizada correctamente';
          this.snackbar = true;
         // router.push('/finca');
          this.isLoading = false;
       }
    },
    async registrarPivot() {
      router.push('/alta-pivot');
    },
    async eliminarFinca() {
      this.dialog = false;
      var tierraNombre = this.nombre;
      FunctionsDatabase.deleteLand(tierraNombre); 
      router.push('/finca');
    },
    clickItem(nombreClicked){ 
      this.changeNombrePivot(nombreClicked); 
      router.push('/detalle-pivot');
    },
  },
  computed: {
    ...mapGetters('app', [ 'getNombreFinca']),
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.DetalleFinca' /* DetalleFinca */), href: '/detalle-finca' },
      ];
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
   
   this.map2 = L.map(this.$refs['mapa'])
     .addLayer(mapboxTiles1);

   this.map2.pm.setLang('es');

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
 
},

 beforeMount() {
     
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
        if(result === null) router.push('/finca');
        this.nombre = result.nombre[0];
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
        
        this.descripcion = result.descripcion[0];
        this.tamaño = result.tamaño[0];
        this.cultivo = result.cultivo[0];
   });
    FunctionsDatabase.listPivots(this.getNombreFinca).then((result) =>{
     var items = this.items;
       if(result !== null){
        result.forEach(function(childResult) {       
          var pivot = childResult.nombre[0];
          items.push( { text: pivot ,icon: 'mdi-water-pump'});          
       })
      }
   });
},

};
</script>

<style>
</style>
