<template>
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


import {router} from '../../router';
//import { FincaModule } from '../module';

import {Database} from '../../interfaceDatabase';
import {ImplementationDatabase} from '../../firebaseImplementation';

let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
  metaInfo:   {
    title: 'Finca',
  },
  components: {
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
  },
  data: (): any => ({}),
  methods: {
    async registrarFinca() {
      router.push('/alta-finca');
    },
  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.Finca' /* Finca */), href: '/finca' },
      ];
    },
  },
  beforeMount () {
     
     FunctionsDatabase.listLands().then((result) =>{
      if(result !== null){
       result.forEach(function(childResult) {       
          var finca = childResult.nombre[0];
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
       }); 
     }
   }); 
  }
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

</style>
