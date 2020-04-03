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
        :rules="nameRules"
        :error="isNameRepeated"
        label="Nombre"
        clearable
        required
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
        clearable
      ></v-text-field>

      <v-text-field
        v-model="cultivo"
        label="Cultivo (opcional)"
        clearable
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
  </v-app>

 </div> 
</template>

<script lang="ts">


//import { registerModule } from '@/app/store';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';

import VueInput from '@/app/shared/components/VueInput/VueInput.vue';

//import { AltaFincaModule } from '../module';


import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
/*


<div :class="$style.altaFinca">
    <br />

     <vue-grid>
      <vue-button color="primary" @click="toBack">
        <-
      </vue-button>
  </vue-grid>
  <div :class="$style.map" ref="mapa" id="mapa"></div>
 <form @submit.prevent="onSubmit" :class="$style.form">
    <br />
     <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">AltaFinca</vue-headline>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>
  
    <br />
    <br />
     <vue-input
      id="nombre"
      name="nombre"
      type="text"
      autofocus
      placeholder="Nombre"
      required
      validation="required"
      error-message="Campo obligatorio"
      v-model="form.nombre"
    />
  
        <vue-input
          name="descripcion"
          id="descripcion"
          placeholder="Descripcion"
          v-model="form.descripcion"
        />

        <vue-input
          name="tamaño"
          id="tamaño"
          placeholder="Tamaño"
          v-model="form.tamaño"
        />



    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="cultivo"
          id="cultivo"
          placeholder="Cultivo"
          v-model="form.cultivo"
        />
      </vue-grid-item>
    </vue-grid-row>


    <br />
    <vue-button color="primary" :disabled="isSubmitDisabled" :loading="isLoading"> Save </vue-button>
  </form>
  
 </div>

*/

import {router} from '../../router';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();


export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'AltaFinca',
  },
  components: {
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
    VueInput,
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
      nameRules: [
        v => !!v || 'Nombre no puede estar vacío',
        v => (v && v.length <= 40) || 'Nombre debe tener menos de cuarenta caracteres',
      ],
      lazy: false,
      map2: '',
      localizacion: [],
      isLoading: false,
      isNameRepeated: false,
    };
  },

watch: {
   async nombre(val) {
       var result = await this.nameRepeated;
       this.isNameRepeated = result; 
 
       if(this.isNameRepeated){
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Nombre de tierra ya utilizado. Por favor, pruebe con otro nombre';
          this.snackbar = true;
       }
    }
  },

  methods: {
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
          var tierraDescripcion = this.descripcion;
          var tierraTamaño = this.tamaño;
          var tierraCultivo = this.cultivo;
          FunctionsDatabase.createLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Tierra creada correctamente';
          this.snackbar = true;
         // router.push('/finca');
           this.nombre = '';
          this.isLoading = false;
       }
    },
  },

  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.AltaFinca' /* AltaFinca */), href: '/alta-finca' },
      ];
    },
     nameRepeated(){
      var nombre = this.nombre;
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.landExist(nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
            return true;
        })
      }
      return resultado;  
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
     .setView([0, 0], 1)
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

};
</script>

<style>
</style>
