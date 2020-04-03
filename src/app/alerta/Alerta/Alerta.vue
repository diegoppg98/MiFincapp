<template>
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
  </div>
</template>

<script lang="ts">
import { IPreLoad } from '@/server/isomorphic';
import { mapActions } from 'vuex';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
  metaInfo:   {
    title: 'Alerta',
  },
  components: {
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

</style>
