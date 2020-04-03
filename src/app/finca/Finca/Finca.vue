<template>
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
  </div>
</template>

<script lang="ts">
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

export default {
  metaInfo:   {
    title: 'Finca',
  },
  components: {
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
    async registrarFinca() {
      router.push('/alta-finca');
    },
  },

  beforeMount () {
     var items = this.items;
     FunctionsDatabase.listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var finca = childResult.nombre[0];
          items.push( { text: finca , icon: 'mdi-corn'});
       }); 
     }
   }); 
  }
};
</script>

<style >
</style>
