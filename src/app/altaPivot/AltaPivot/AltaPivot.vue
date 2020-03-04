<template>
  <div :class="$style.altaPivot" >
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
          <vue-headline level="1">AltaPivot</vue-headline>
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

    <vue-grid-row>
      <vue-grid-item>
        <vue-input
          name="descripcion"
          id="descripcion"
          placeholder="Descripcion"
          v-model="form.descripcion"
        />
      </vue-grid-item> 
    </vue-grid-row>


    <vue-grid-row>
      <vue-grid-item>
        <vue-checkbox
          name="tipoLineal"
          id="tipoLineal"
          label="tipo lineal"
          :checked="form.tipo === true"
          @click="form.tipo = !form.tipo"
          radio
        />
        <br />
        <vue-checkbox
          name="tipoCircular"
          id="tipoCircular"
          label="tipo circular"
          :checked="form.tipo === false"
          @click="form.tipo = !form.tipo"
          radio
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
import VueCheckbox from '@/app/shared/components/VueCheckbox/VueCheckbox.vue';

//import { AltaPivotModule } from '../module';
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
    title: 'AltaPivot',
  },
  components: {
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
    VueInput,
    VueCheckbox,
  },
  data(): any {
    return {
      form: {
        nombre: '',
        descripcion: '',
        tipo: true,
      },
      map2: '',
      localizacion: [],
      isNameRepeated: false,
      isLoading: false,
    };
  },
  methods: {
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
          addNotification({ title: 'Localizacion no marcada', text: 'Por favor seleccione en el mapa la localizacion' });
          this.isLoading = false;
       }
       else{
         var nombreTierra = localStorage.nameFinca;
         var pivotNombre = this.form.nombre;
         var pivotDescripcion = this.form.descripcion;
         var pivotTipo = this.form.tipo;

         FunctionsDatabase.createPivot(pivotNombre,pivotDescripcion,pivotLocalizacion,pivotTipo,nombreTierra);
         addNotification({ title: 'Pivot creado correctamente', text: 'Pivot creado correctamente' });        
        // router.push('/detalle-finca');
         this.isLoading = false;
      }
    },
    async toBack() {
      router.push('/detalle-finca');
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.AltaPivot' /* AltaPivot */), href: '/alta-pivot' },
      ];
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (key !== 'tipo' && (this.form.nombre === '')) {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    nameRepeated(){
      var nombre = this.form.nombre;
      
      var nombreTierra = localStorage.nameFinca;
      var resultado = false;
      if (nombre === ''){
        resultado = false;
      }
      else{
        resultado = FunctionsDatabase.pivotExist(nombreTierra, nombre).then(function (result) {
            return false;
        })
        .catch(function (error) {
            console.log(error.message);
            addNotification({ title: 'Nombre de pivot ya utilizado', text: 'Por favor, pruebe con otro nombre' });
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
      return this.hasErrors || this.hasEmptyFields|| this.isNameRepeated;
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
     drawPolygon: false,
     drawRectangle: false,
     drawCircle: false,
     drawPolyline: true,
     deleteLayer: true,
     editeModel: false,
     dragMode: true,
     cutPolygon: false,
   });
 },



 beforeMount(){
     FunctionsDatabase.landInformation(localStorage.nameFinca).then((result) =>{
        if(result === null) router.push('/finca');
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
 },
  /*beforeCreate() {
    registerModule('altaPivot', AltaPivotModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('altaPivot', AltaPivotModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchAltaPivot', '1');
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

.altaPivot {
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
