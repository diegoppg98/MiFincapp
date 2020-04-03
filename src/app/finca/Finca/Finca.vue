<template>
<<<<<<< HEAD
  <div id="finca">
  <v-app >
  <v-btn class="mx-10 my-2" color="orange darken-2" dark absolute to='/example/dashboard'>
        <v-icon dark left>mdi-arrow-left</v-icon>
   </v-btn>
   <v-card-actions class="justify-center">
  <v-btn @click="registrarFinca" color="error">
    Registrar nueva finca
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
  <div :class="$style.finca" >
    <vue-grid id="finca">
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">Finca</vue-headline>
        </vue-grid-item>
      </vue-grid-row>

      <vue-button color="primary" @click="registrarFinca">
        Registrar Nueva Finca
      </vue-button>
    </vue-grid>
>>>>>>> origin/master
  </div>
</template>

<script lang="ts">
<<<<<<< HEAD
import { mapActions } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';
let FunctionsDatabase: Database = new ImplementationDatabase();
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
/*

DARK STYLE
COLORES
ARREGLAR PROMISE FIREBASE

//https://vuetifyjs.com/en/components/alerts/-|

//altaAlerta array tipos : for i=false-|
//tiempo-|
//https://firebase.google.com/docs/auth/admin/verify-id-tokens?hl=es-|


https://materialdesignicons.com/  ICONOS----
https://vuetifyjs.com/en/components/dialogs/ INICIOSESION----
https://vuetifyjs.com/en/components/text-fields/ //password----
//https://vuetifyjs.com/en/components/avatars/----

*/
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
//import { FincaModule } from '../module';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();
>>>>>>> origin/master

export default {
  metaInfo:   {
    title: 'Finca',
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
    ...mapActions('app', ['changeNombreFinca']),
    clickItem(nombreClicked){ 
      this.changeNombreFinca(nombreClicked); 
      router.push('/detalle-finca');
    },
=======
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
  },
  data: (): any => ({}),
  methods: {
>>>>>>> origin/master
    async registrarFinca() {
      router.push('/alta-finca');
    },
  },
<<<<<<< HEAD

  beforeMount () {
     var items = this.items;
=======
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.Finca' /* Finca */), href: '/finca' },
      ];
    },
  },
  beforeMount () {
     
>>>>>>> origin/master
     FunctionsDatabase.listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var finca = childResult.nombre[0];
<<<<<<< HEAD
          items.push( { text: finca , icon: 'mdi-corn'});
=======
           var body = document.getElementById("finca");
           var button = document.createElement("button");
           button.innerHTML = finca;
           button.style.width = '400px'; // setting the width to 200px
           button.style.height = '100px'; // setting the height to 200px
           button.style.fontSize = '20px';
           button.style.margin = "10px 10px"; 
           button.style.border = 'solid';
           button.style.background = 'rgba(0, 255, 0, 0.3)';

           body.appendChild(button);
           button.addEventListener ("click", function() {
               localStorage.nameFinca = finca;               
               router.push('/detalle-finca');
           });
           button.addEventListener("mouseover", function() {
               button.style.background = 'rgba(0, 255, 0, 0.8)';
           });
           button.addEventListener("mouseout", function() {
               button.style.background = 'rgba(0, 255, 0, 0.3)';
           });
>>>>>>> origin/master
       }); 
     }
   }); 
  }
<<<<<<< HEAD
};
</script>

<style >
=======
  /*
   beforeCreate() {
    registerModule('finca', FincaModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('finca', FincaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchFinca', '1');
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

.finca {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-right:70%;
  margin-left:30%;
  padding: 2em;
  display: flex;
  justify-content: top-center;
  align-items: top-center;
}

>>>>>>> origin/master
</style>
