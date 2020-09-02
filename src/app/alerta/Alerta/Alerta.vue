<template>
  <div id="alerta">
  
  <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
  
  <v-container>
      <v-row dense>

        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
        >
          <v-card
            color="#2e7d32"
            dark
            @click.native="clickItem(item)"
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title
                  v-text="item.text"
                ></v-card-title>
                
                 <v-btn class="mx-2" fab dark color="#7d2f2e" @click.stop="clickMuteItem(item)">
             <v-icon dark>{{ item.iconSound }}</v-icon>
          </v-btn> 
              </div>

              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img id="image" :src="item.src"></v-img>
              </v-avatar>
            </div>

          </v-card>
          
        </v-col>
      </v-row>
    </v-container>
   
   <v-btn fab absolute bottom right id="btn-flotante" class="white--text" @click="registrarAlerta" color="#2e7d32">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
 </v-col>
      </v-row>
    </v-container>
  </div>
  
  </div>
</template>

<script lang="ts">

import { IPreLoad } from '@/server/isomorphic';
import { mapActions } from 'vuex';
import {router} from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {Alerta} from '../../Clases/Alerta';
import {FactoryAPI} from '../../FactoryAPI';

export default {
  metaInfo:   {
    title: 'Alerta',
  },
  components: {
  },
  data: () => ({
      item: 1,
      items: [],
  }),
  methods: {
    ...mapActions('app', ['changeAlerta']),
    clickItem(nombreClicked: { alerta: any; }){ 
      this.changeAlerta(nombreClicked.alerta); 
      router.push('/detalle-alerta');
    },
    clickMuteItem(nombreClicked){    
       if(nombreClicked.silenciated){ nombreClicked.silenciated = false; nombreClicked.iconSound = 'mdi-volume-high';}
       else{ nombreClicked.silenciated = true; nombreClicked.iconSound = 'mdi-volume-off'; }
       nombreClicked.alerta.silenciada = nombreClicked.silenciated;

       FactoryAPI.getFactoryAPI("Firebase").getAlerta().updateAlert(nombreClicked.alerta).then((result) =>{
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
    imagesTypes(tipoAlerta){
      switch (tipoAlerta) {
            case 'GPS':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FSensorGps.jpg?alt=media&token=456c0eda-cad5-45ea-a010-9c49c69b9fa2';
            case 'Suelo':
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FsensorSuelo.jpg?alt=media&token=9b434fed-7a07-4e49-a034-db67af65fe21';
            default:
                return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2FsensorSuelo.jpg?alt=media&token=9b434fed-7a07-4e49-a034-db67af65fe21';
        }
    }
  },

computed: {
    posMap() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '12';
        case 'sm':
          return '12';
        case 'md':
          return '6';
        case 'lg':
          return '6';
        case 'xl':
          return '6';
      }
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
     var imageType = this.imagesTypes;
     FactoryAPI.getFactoryAPI("Firebase").getAlerta().listAlerts().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {     
          var alerta = childResult.nombre;
          var silenciado = childResult.silenciada;  
          var TipoAlerta = childResult.tipo;
          var icon = 'mdi-alert-circle';
          var iconSilenciado = 'mdi-volume-high';
          var image = imageType(TipoAlerta);

          if(silenciado){
             iconSilenciado = 'mdi-volume-off';
          }                    
          items.push( { text: alerta , src: image, alerta: childResult, silenciated: silenciado, iconSound: iconSilenciado});
       }); 
     }
   }); 
  }

};
</script>

</script>

<style>
#image {
  border-radius: 24px;
}
#btn-flotante {
	font-size: 16px; 
	font-weight: bold; 
	padding: 18px 30px; 
	position: fixed;
	bottom: 40px;
	right: 40px;
	transition: all 300ms ease 0ms;
	box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
	z-index: 99;
}
#btn-flotante:hover {
	background-color: #2c2fa5; 
	box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.3);
	transform: translateY(-7px);
}
@media only screen and (max-width: 600px) {
 	.btn-flotante {
		font-size: 14px;
		padding: 12px 20px;
		bottom: 20px;
		right: 20px;
	}
} 
</style>
