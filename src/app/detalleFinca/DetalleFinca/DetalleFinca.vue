<template>
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

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
   $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'DetalleFinca',
  },
  components: {
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

         FunctionsDatabase.updateLand(tierraNombre,tierraDescripcion,tierraLocalizacion,tierraTamaño,tierraCultivo); 
         addNotification({ title: 'Tierra actualizada correctamente', text: 'Tierra actualizada correctamente' });
         // router.push('/finca');
         this.isLoading = false;
       }
    },
    async registrarPivot() {
      router.push('/alta-pivot');
    },
    async eliminarFinca() {
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
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.DetalleFinca' /* DetalleFinca */), href: '/detalle-finca' },
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
     editPolygon: true,
     drawCircle: false,
     drawPolyline: false,
     deleteLayer: true,
     cutPolygon: false,
   });
 
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
        this.localizacion = result.localizacion[0];
        var map = this.map2;

        L.geoJSON( L.geoJSON(JSON.parse(this.localizacion[0])).toGeoJSON(), {
        /*   coordsToLatLng: function (coords) {
               map.setView([coords[1], coords[0]], 12);
           },*/
           onEachFeature: function (feature, layer) {
              map.setView([feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]], 13);
           },
        });

        this.localizacion.forEach(function(element,index) {
           L.geoJSON(JSON.parse(element)).addTo(map);
        })  
        
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
       })
      }
   });
},

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

</style>
