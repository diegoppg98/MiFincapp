<template>
  <div id="finca" >
 <v-card-actions>
  <v-btn class="mx-auto" @click="registrarFinca" dark color="info">
    Registrar finca
  </v-btn>
  </v-card-actions>
  <v-list rounded>
      <v-list-item-group v-model="item" background-color= "red" >
        <v-list-item      
          style="background:#9F693A"
          v-for="item in items"
          :key="item.text"
          @click="clickItem(item)"
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

  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Finca} from '../../Clases/Finca';
import {classMethods} from '../../classMethods';

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
    ...mapActions('app', ['changeFinca']),
    clickItem(nombreClicked){ 
      this.changeFinca(nombreClicked.finca); 
      router.push('/detalle-finca');
    },
    async registrarFinca() {
      router.push('/alta-finca');
    },
  },
  
  beforeMount(){  
   window.onbeforeunload = function() { 
     window.setTimeout(function () { 
         window.location = "/perfil";
     }, 0); 
     window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
    }

   var items = this.items;   
   classMethods.getFincaMethods().listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var label = childResult.nombre;     
          items.push( { text: label , icon: 'mdi-corn', finca: childResult});
       }); 
     }
   }); 
   
  },
};
</script>

<style >
</style>
