<template>
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
      form: {
        nombre: '',        
        descripcion: '',
        tamaño: '',
        cultivo: '',
      },
      map2: '',
      localizacion: [],
      isLoading: false,
      isNameRepeated: false,
    };
  },
  methods: {
    onSubmit() {
       this.isLoading = true;
                  
       var tierraLocalizacion = [];
        var layers = [];
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
           layers.push(layer); 
        }                    
        })
       this.localizacion = layers;
       this.localizacion.forEach(function(element,index) {
          tierraLocalizacion.push(JSON.stringify(element.toGeoJSON()));
        })       
       if(tierraLocalizacion.length === 0){
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
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.AltaFinca' /* AltaFinca */), href: '/alta-finca' },
      ];
    },
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
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.landExist(nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
            console.log(error.message);
            addNotification({ title: 'Nombre de tierra ya utilizado', text: 'Por favor, pruebe con otro nombre' });
            return true;
        })
      }
      return resultado;  
    },
    
    async hasNameRepeated(){
       var result = await this.nameRepeated;
       this.isNameRepeated = result;
    },

    isSubmitDisabled() {
      this.hasNameRepeated;
      return this.hasErrors || this.hasEmptyFields || this.isNameRepeated; 
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
     editPolygon: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     cutPolygon: false,
   });

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
</style>
