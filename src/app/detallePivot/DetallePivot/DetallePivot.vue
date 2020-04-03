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
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/detalle-finca'>
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

    <v-radio-group v-model="tipo" :mandatory="false">
      <v-radio label="Circular" value="circular"></v-radio>
      <v-radio label="Lineal" value="lineal"></v-radio>
    </v-radio-group>

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
  <v-btn @click="registrarDispositivo" color="error">
    Registrar nuevo dispositivo
  </v-btn>

  <v-btn @click.stop="dialog = true" color="error">
    Eliminar pivot
  </v-btn>

<v-dialog
      v-model="dialog"
      max-width="290"
      style="z-index: 999"
    >
      <v-card>
        <v-card-title class="headline">Confirmacion de eliminacion</v-card-title>

        <v-card-text>
        Esta seguro de que desea eliminar el pivot, este procesos será irreversible.
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
            @click="eliminarPivot"
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
=======
  <div :class="$style.detallePivot" id="dispositivo">
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
          <vue-headline level="1">DetallePivot</vue-headline>
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
      :disabled="nameDisabled"
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
    <br />
    <br />
  <vue-grid :class="$style.detallePivotBoton">
      <vue-button color="primary" @click="registrarDispositivo"> Registrar Nuevo Dispositivo </vue-button>
      <vue-button color="primary" @click="eliminarPivot"> Eliminar Pivot </vue-button>
  </vue-grid>

  </div>
>>>>>>> origin/master

</template>

<script lang="ts">
<<<<<<< HEAD
import { IPreLoad } from '@/server/isomorphic';
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';
import {router} from '../../router';
=======
//import { registerModule } from '@/app/store';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';
import {router} from '../../router';
import VueInput from '@/app/shared/components/VueInput/VueInput.vue';
import VueCheckbox from '@/app/shared/components/VueCheckbox/VueCheckbox.vue';

import { addNotification, INotification } from '@components/VueNotificationStack/utils';
//import { DetallePivotModule } from '../module';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

>>>>>>> origin/master
let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'DetallePivot',
  },
  components: {
<<<<<<< HEAD
  },
  data(): any {
    return {
      nombre: '',
      descripcion: '',
      tipo: 'lineal',
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
     ...mapActions('app', ['changeNombreDispositivo']),
=======
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
      isLoading: false,
    };
  },
  methods: {
>>>>>>> origin/master
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
<<<<<<< HEAD
   	  this.colorSnackbar = "error";
          this.textSnackbar = 'Localizacion no marcada. Por favor seleccione en el mapa la localizacion';
          this.snackbar = true;
         this.isLoading = false;
       } 
       else{
         var nombreTierra = this.getNombreFinca;
         var pivotNombre = this.nombre;
         var pivotDescripcion = this.descripcion;
         var pivotTipo = this.tipo;
         FunctionsDatabase.updatePivot(pivotNombre,pivotDescripcion,pivotLocalizacion,pivotTipo,nombreTierra);
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Pivot actualizada correctamente';
          this.snackbar = true;
=======
         addNotification({ title: 'Localizacion no marcada', text: 'Por favor seleccione en el mapa la localizacion' });
         this.isLoading = false;
       } 
       else{
         var nombreTierra = localStorage.nameFinca;
         var pivotNombre = this.form.nombre;
         var pivotDescripcion = this.form.descripcion;
         var pivotTipo = this.form.tipo;
         FunctionsDatabase.updatePivot(pivotNombre,pivotDescripcion,pivotLocalizacion,pivotTipo,nombreTierra);
         addNotification({ title: 'Pivot actualizado correctamente', text: 'Pivot actualizado correctamente' });
>>>>>>> origin/master
         this.isLoading = false;
      } 
    },
    async registrarDispositivo() {
      router.push('/alta-dispositivo');
    },
    async eliminarPivot() {
<<<<<<< HEAD
      this.dialog = false;
       var nombreTierra = this.getNombreFinca;
       var pivotNombre = this.nombre;
       FunctionsDatabase.deletePivot(pivotNombre,nombreTierra); 
       router.push('/detalle-finca');
    },
    clickItem(nombreClicked){ 
      this.changeNombreDispositivo(nombreClicked); 
      router.push('/detalle-dispositivo');
    },
  },
  computed: {
    ...mapGetters('app', [ 'getNombreFinca', 'getNombrePivot']),
=======
       var nombreTierra = localStorage.nameFinca;
       var pivotNombre = this.form.nombre;
       FunctionsDatabase.deletePivot(pivotNombre,nombreTierra); 
        addNotification({ title: 'Pivot eliminado correctamente', text: 'Pivot eliminado correctamente' });
      router.push('/detalle-finca');
    },
    async toBack() {
      router.push('/detalle-finca');
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.DetallePivot' /* DetallePivot */), href: '/detalle-pivot' },
      ];
    },
    nameDisabled() {
      return 1;
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (key !== 'tipo' && (this.form.nombre === '' || this.form.localizacion === '')) {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
    },
>>>>>>> origin/master
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
<<<<<<< HEAD

beforeMount() {
     var items = this.items;
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
=======
  /*beforeCreate() {
    registerModule('detallePivot', DetallePivotModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('detallePivot', DetallePivotModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchDetallePivot', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
   // return Promise.resolve();
  //},
beforeMount() {
     FunctionsDatabase.landInformation(localStorage.nameFinca).then((result) =>{
>>>>>>> origin/master
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
<<<<<<< HEAD
     FunctionsDatabase.pivotInformation(this.getNombreFinca, this.getNombrePivot).then((result) =>{
        if(result === null) router.push('/finca');
        this.nombre = result.nombre[0];
=======
     FunctionsDatabase.pivotInformation(localStorage.nameFinca, localStorage.namePivot).then((result) =>{
        if(result === null) router.push('/finca');
        this.form.nombre = result.nombre[0];
>>>>>>> origin/master
        this.localizacion = result.localizacion[0];
        var map = this.map2;
        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
<<<<<<< HEAD
        this.descripcion = result.descripcion[0];
        this.tipo = result.tipo[0];
   });
     FunctionsDatabase.listDevices(this.getNombreFinca, this.getNombrePivot).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var dispositivo = childResult.nombre[0];
          items.push( { text: dispositivo ,icon: 'mdi-cellphone-wireless'});  
=======
        this.form.descripcion = result.descripcion[0];
        this.form.tipo = result.tipo[0];
   });
     FunctionsDatabase.listDevices(localStorage.nameFinca, localStorage.namePivot).then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var dispositivo = childResult.nombre[0];
           var body = document.getElementById("dispositivo");
           var button = document.createElement("button");
           button.style.width = '400px'; // setting the width to 200px
           button.style.height = '100px'; // setting the height to 200px
           button.style.fontSize = '20px';
           button.style.margin = "50px 80px 10px 200px"; 
           button.style.border = 'solid';
           button.style.background = 'rgba(0, 255, 0, 0.3)';
           button.innerHTML = dispositivo;
           body.appendChild(button);
           button.addEventListener ("click", function() {
               localStorage.nameDispositivo = dispositivo;               
               router.push('/detalle-dispositivo');
           })
          button.addEventListener("mouseover", function() {
               button.style.background = 'rgba(0, 255, 0, 0.8)';
           });
           button.addEventListener("mouseout", function() {
               button.style.background = 'rgba(0, 255, 0, 0.3)';
           });
>>>>>>> origin/master
       })
    }
   });
},
};
</script>

<<<<<<< HEAD
<style>
=======
<style lang="scss" module>
@import "~@/app/shared/design-system";

.detallePivot {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
.detallePivotBoton {
   display: inline;
   margin-left:20%;
   position:absolute; 
   left:10px;
   top: 570px;
}
.form {
   margin-right:60%;
 }
.map{
    width: 50%; 
    height: 380px; 
    position: absolute;
    left: 580px;
    top: 180px;
}
>>>>>>> origin/master
</style>
