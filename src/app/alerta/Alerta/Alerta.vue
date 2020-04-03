<template>
<<<<<<< HEAD
  <div id="alerta">
  <v-app >
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/example/dashboard'>
        <v-icon dark left>mdi-arrow-left</v-icon>
   </v-btn>
   <v-card-actions class="justify-center">
  <v-btn @click="registrarAlerta" color="error">
    Registrar nueva alerta
  </v-btn>
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
=======
   <div :class="$style.alerta">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">Alerta</vue-headline>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>
>>>>>>> origin/master
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import { IPreLoad } from '@/server/isomorphic';
import { mapActions } from 'vuex';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
=======
//import { registerModule } from '@/app/store';
import { IPreLoad } from '@/server/isomorphic';
import VueGrid from '@/app/shared/components/VueGrid/VueGrid.vue';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import VueGridRow from '@/app/shared/components/VueGridRow/VueGridRow.vue';
import VueGridItem from '@/app/shared/components/VueGridItem/VueGridItem.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import VueHeadline from '@/app/shared/components/VueHeadline/VueHeadline.vue';



//import { AlertaModule } from '../module';
>>>>>>> origin/master

export default {
  metaInfo:   {
    title: 'Alerta',
  },
  components: {
<<<<<<< HEAD
  },
  data: () => ({
      item: 1,
      items: [
      ],
  }),
  methods: {
    ...mapActions('app', ['changeNombreAlerta']),
    clickItem(nombreClicked){ 
      this.changeNombreAlerta(nombreClicked); 
      router.push('/detalle-alerta');
    },
    async registrarAlerta() {
      router.push('/alta-alerta');
    },
  },

 beforeMount () {
     var items = this.items;
     FunctionsDatabase.listAlerts().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var alerta = childResult.nombre[0];
          var TipoAlerta = childResult.tipo[0];
          var icon = 'mdi-alert-circle';
          if(TipoAlerta === 'GPS'){
             icon = 'mdi-map-marker-alert';
          }
          else if (TipoAlerta === 'Temperatura'){
             icon = 'mdi-thermometer-alert';
          }
          
          items.push( { text: alerta , icon: icon});
       }); 
     }
   }); 
  }

};
</script>

<style>

=======
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
  },
  data: (): any => ({}),
  methods: {},
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.Alerta' /* Alerta */), href: '/alerta' },
      ];
    },
  },







  mounted() {


  },














  /*beforeCreate() {
    registerModule('alerta', AlertaModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('alerta', AlertaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchAlerta', '1');
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

.alerta {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
>>>>>>> origin/master
</style>
