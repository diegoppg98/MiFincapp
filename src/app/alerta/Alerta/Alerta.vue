<template>
  <div id="alerta">
  <v-card-actions>
   <v-btn class="mx-auto" @click="registrarAlerta" dark color="info">
     Registrar alerta
   </v-btn>
  </v-card-actions>
  <v-list rounded>
      <v-list-item-group v-model="item" background-color= "red" >
        <v-list-item      
          style="background:#9F693A"
          v-for="item in items"
          :key="item"
          @click="clickItem(item)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title value="true" color="red" v-text="item.text"></v-list-item-title>            
          </v-list-item-content>
          <v-btn fab dark color="indigo" @click.stop="clickMuteItem(item)">
             <v-icon dark>{{ item.iconSound }}</v-icon>
          </v-btn>  
        </v-list-item>
      </v-list-item-group>
  </v-list>
  </div>
</template>

<script lang="ts">

import { IPreLoad } from '@/server/isomorphic';
import { mapActions } from 'vuex';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Alerta} from '../../Clases/Alerta';
import {classMethods} from '../../classMethods';

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
    ...mapActions('app', ['changeAlerta']),
    clickItem(nombreClicked){ 
      this.changeAlerta(nombreClicked.alerta); 
      router.push('/detalle-alerta');
    },
    clickMuteItem(nombreClicked){    
       if(nombreClicked.silenciated){ nombreClicked.silenciated = false; nombreClicked.iconSound = 'mdi-volume-high';}
       else{ nombreClicked.silenciated = true; nombreClicked.iconSound = 'mdi-volume-off'; }
       nombreClicked.alerta.silenciada = nombreClicked.silenciated;

       classMethods.getAlertaMethods().updateAlert(nombreClicked.alerta).then((result) =>{
          this.isLoading = false;
          }).catch((error) => {
   	     this.colorSnackbar = "error";
             this.textSnackbar = 'Error al actualizar la alerta. Por favor inténtelo otra vez';
             this.snackbar = true;
          });
    },
    async registrarAlerta() {
      router.push('/alta-alerta');
    },
  },

 beforeMount () {
 window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }
   
     var items = this.items;
     classMethods.getAlertaMethods().listAlerts().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {     
          var alerta = childResult.nombre;
          var silenciado = childResult.silenciada;  
          var TipoAlerta = childResult.tipo;
          var icon = 'mdi-alert-circle';
          var iconSilenciado = 'mdi-volume-high';
          if(TipoAlerta === 'GPS'){
             icon = 'mdi-map-marker-alert';
          }
          else if (TipoAlerta === 'Temperatura'){
             icon = 'mdi-thermometer-alert';
          }
          if(silenciado){
             iconSilenciado = 'mdi-volume-off';
          }                    
          items.push( { text: alerta , icon: icon, alerta: childResult, silenciated: silenciado, iconSound: iconSilenciado});
       }); 
     }
   }); 
  }

};
</script>

</script>

<style>
</style>
