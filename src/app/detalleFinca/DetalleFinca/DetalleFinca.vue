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
=======
  <div :class="$style.detalleFinca" id="pivot" >
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
          <vue-headline level="1">DetalleFinca</vue-headline>
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
      <vue-grid-item>
        <vue-input
          name="tamaño"
          id="tamaño"
          placeholder="Tamaño"
          v-model="form.tamaño"
        />
      </vue-grid-item>
    </vue-grid-row>


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
    <br />
    <br />
  <vue-grid :class="$style.detalleFincaBoton">
    <vue-button color="primary" @click="registrarPivot" > Registrar Nuevo Pivot </vue-button>
    <vue-button color="primary" @click="eliminarFinca" > Eliminar Finca </vue-button>
  </vue-grid>
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
import VueSelect from '@/app/shared/components/VueSelect/VueSelect.vue';
import { addNotification, INotification } from '@components/VueNotificationStack/utils';
//import { DetalleFincaModule } from '../module';

import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';
>>>>>>> origin/master

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'DetalleFinca',
  },
  components: {
<<<<<<< HEAD
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
=======
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
    VueInput,
    VueSelect,
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
    };
  },
  methods: {
      onSubmit() {

      this.isLoading = true;

       var tierraLocalizacion = [];
       
       var layers  = [];
        this.map2.eachLayer(function(layer) {
          if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
>>>>>>> origin/master
           layers.push(layer); 
        }                  
        })
       this.localizacion = layers;
<<<<<<< HEAD
=======

>>>>>>> origin/master
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

         FunctionsDatabase.updateLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
   	  this.colorSnackbar = "success";
          this.textSnackbar = 'Tierra actualizada correctamente';
          this.snackbar = true;
         // router.push('/finca');
          this.isLoading = false;
=======
         addNotification({ title: 'Localizacion no marcada', text: 'Por favor seleccione en el mapa la localizacion' });
         this.isLoading = false;
       } 
       else{
         var tierraNombre = this.form.nombre;
         var tierraDescripcion = this.form.descripcion;
         var tierraTamaño = this.form.tamaño;
         var tierraCultivo = this.form.cultivo;

         FunctionsDatabase.updateLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
         addNotification({ title: 'Tierra actualizada correctamente', text: 'Tierra actualizada correctamente' });
         // router.push('/finca');
         this.isLoading = false;
>>>>>>> origin/master
       }
    },
    async registrarPivot() {
      router.push('/alta-pivot');
    },
    async eliminarFinca() {
<<<<<<< HEAD
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
=======
       var tierraNombre = this.form.nombre;
       FunctionsDatabase.deleteLand(tierraNombre); 
        addNotification({ title: 'Tierra eliminada correctamente', text: 'Tierra eliminada correctamente' });
      router.push('/finca');
    },
    async toBack() {
      router.push('/finca');
    },
  },
  computed: {
>>>>>>> origin/master
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.DetalleFinca' /* DetalleFinca */), href: '/detalle-finca' },
      ];
    },
<<<<<<< HEAD
 },

mounted() {

=======
    nameDisabled() {
      return 1;
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      
      let hasEmptyField: boolean = false;
      var nombre = this.form.nombre;
      Object.keys(this.form).forEach((key: string) => {
       // console.log(FunctionsDatabase.landExist(nombre));
        if (this.form.nombre === '') {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
  },

 },

mounted() {
>>>>>>> origin/master
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

 beforeMount() {
     
     FunctionsDatabase.landInformation(this.getNombreFinca).then((result) =>{
        if(result === null) router.push('/finca');
        this.nombre = result.nombre[0];
=======
   // L.geoJSON(JSON.parse(this.localizacion)).addTo(this.map2);

   //console.log(JSON.parse(this.localizacion));
   this.map2.on('pm:create', function(e) {
     var layer = e.layer;
   });

   this.map2.on('pm:remove', function(e) {
      var layer = e.layer;
   });
},


 /* beforeCreate() {
    registerModule('detalleFinca', DetalleFincaModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('detalleFinca', DetalleFincaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchDetalleFinca', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
  //  return Promise.resolve();
  //},



//location.reload(); 
 beforeMount() {
     FunctionsDatabase.landInformation(localStorage.nameFinca).then((result) =>{
        if(result === null) router.push('/finca');
        this.form.nombre = result.nombre[0];
>>>>>>> origin/master
        this.localizacion = result.localizacion[0];
        var map = this.map2;

        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
<<<<<<< HEAD
=======
        /*   coordsToLatLng: function (coords) {
               map.setView([coords[1], coords[0]], 12);
           },*/
>>>>>>> origin/master
           onEachFeature: function (feature, layer) {
              map.setView([feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]], 13);
           },
        });

        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
        
<<<<<<< HEAD
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
=======
        this.form.descripcion = result.descripcion[0];
        this.form.tamaño = result.tamaño[0];
        this.form.cultivo = result.cultivo[0];
   });
    FunctionsDatabase.listPivots(localStorage.nameFinca).then((result) =>{
       if(result !== null){
        result.forEach(function(childResult) {       
          var pivot = childResult.nombre[0];
           var body = document.getElementById("pivot");
           var button = document.createElement("button");
           button.style.width = '400px'; // setting the width to 200px
           button.style.height = '100px'; // setting the height to 200px
           button.style.fontSize = '20px';
           button.style.margin = "50px 80px 10px 220px"; 
           button.style.border = 'solid';
           button.style.background = 'rgba(0, 255, 0, 0.3)';
           button.innerHTML = pivot;
           body.appendChild(button);
           button.addEventListener ("click", function() {
               localStorage.namePivot = pivot;               
               router.push('/detalle-pivot');
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

<<<<<<< HEAD
};
</script>

<style>
=======
/*mounted() {
    if (localStorage.getItem('reloaded')) {
        // The page was just reloaded. Clear the value from local storage
        // so that it will reload the next time this page is visited.
        localStorage.removeItem('reloaded');
    } else {
        // Set a flag so that we know not to reload the page twice.
        localStorage.setItem('reloaded', '1');
        location.reload();
    }
}*/
};
</script>

<style lang="scss" module>
@import "~@/app/shared/design-system";

.detalleFinca {
  margin-top: $nav-bar-height;
  margin-left:5%;
  min-height: 500px;
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
.detalleFincaBoton {
   display: inline;
   margin-left:20%;
   position:absolute; 
   left:10px;
   top: 570px;
}

>>>>>>> origin/master
</style>
