<template>
<<<<<<< HEAD
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
=======
  <div :class="$style.altaFinca">
>>>>>>> origin/master
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
<<<<<<< HEAD

*/
=======
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

import { addNotification, INotification } from '@components/VueNotificationStack/utils';

>>>>>>> origin/master

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
<<<<<<< HEAD
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
=======
      form: {
        nombre: '',        
        descripcion: '',
        tamaño: '',
        cultivo: '',
      },
>>>>>>> origin/master
      map2: '',
      localizacion: [],
      isLoading: false,
      isNameRepeated: false,
    };
  },
<<<<<<< HEAD

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

=======
>>>>>>> origin/master
  methods: {
    onSubmit() {
       this.isLoading = true;
                  
       var tierraLocalizacion = [];
        var layers = [];
        this.map2.eachLayer(function(layer) {
<<<<<<< HEAD
          if (layer instanceof L.Polygon) {
=======
          if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
>>>>>>> origin/master
           layers.push(layer); 
        }                    
        })
       this.localizacion = layers;
       this.localizacion.forEach(function(element,index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
       if(tierraLocalizacion.length === 0){
<<<<<<< HEAD
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

=======
          addNotification({ title: 'Localizacion no marcada', text: 'Por favor seleccione en el mapa la localizacion' });
          this.isLoading = false;
       }
       else{
          var tierraNombre = this.form.nombre;
          var tierraDescripcion = this.form.descripcion;
          var tierraTamaño = this.form.tamaño;
          var tierraCultivo = this.form.cultivo;
          FunctionsDatabase.createLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
          addNotification({ title: 'Tierra creada correctamente', text: 'Tierra creada correctamente' });
         // router.push('/finca');
          this.isLoading = false;
       }
    },
    async toBack() {
      router.push('/finca');
    },
  },
>>>>>>> origin/master
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.AltaFinca' /* AltaFinca */), href: '/alta-finca' },
      ];
    },
<<<<<<< HEAD
     nameRepeated(){
      var nombre = this.nombre;
=======
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
   hasEmptyFields() {

      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (this.form.nombre === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    nameRepeated(){
      var nombre = this.form.nombre;
>>>>>>> origin/master
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.landExist(nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
<<<<<<< HEAD
=======
            console.log(error.message);
            addNotification({ title: 'Nombre de tierra ya utilizado', text: 'Por favor, pruebe con otro nombre' });
>>>>>>> origin/master
            return true;
        })
      }
      return resultado;  
    },
<<<<<<< HEAD
=======
    
    async hasNameRepeated(){
       var result = await this.nameRepeated;
       this.isNameRepeated = result;
    },

    isSubmitDisabled() {
      this.hasNameRepeated;
      return this.hasErrors || this.hasEmptyFields || this.isNameRepeated; 
    },
>>>>>>> origin/master
  },

 mounted() {
   const accessToken = 'pk.eyJ1IjoiZGllZ29wcGciLCJhIjoiY2s3NmVtaXRmMTRyaDNndDA2dWFwYmk2OCJ9.0Evn9MpSDvrdASq2S60-hQ';
<<<<<<< HEAD
=======

>>>>>>> origin/master
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
<<<<<<< HEAD
=======

>>>>>>> origin/master
   this.map2.pm.setLang('es');

   this.map2.pm.addControls({
     drawMarker: false,
     drawCircleMarker: false,
     drawPolygon: true,
<<<<<<< HEAD
     drawRectangle: false,
=======
>>>>>>> origin/master
     editPolygon: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     cutPolygon: false,
   });
<<<<<<< HEAD
 },

};
</script>

<style>
=======

  /* this.map2.on('pm:create', function(e) {
     var layer = e.layer;
   });

   this.map2.on('pm:remove', function(e) {
      var layer = e.layer;
   });*/

 },

  /*beforeCreate() {
    registerModule('altaFinca', AltaFincaModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('altaFinca', AltaFincaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchAltaFinca', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
   // return Promise.resolve();
  //},
};
</script>

<style lang="scss" module>
@import "~@/app/shared/design-system";

.altaFinca {
 margin-top: $nav-bar-height;
 min-height: 500px;
 margin-left:5%;
}
.form {
   margin-right:60%;
 }
.map{
    width: 50%; 
    height: 380px; 
    position: absolute;
    left: 580px;
    top: 200px;
}
>>>>>>> origin/master
</style>
