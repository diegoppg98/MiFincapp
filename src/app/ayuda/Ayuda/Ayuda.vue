<template>
<div>
</div>
</template>

<script lang="ts">
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { IPreLoad } from '@/server/isomorphic';
import {router} from '../../router';


//import PreventUnload from 'vue-prevent-unload'; <PreventUnload :when="hasChanges"/>
//https://laracasts.com/discuss/channels/vue/detect-page-refreshchange-in-vue
//https://stackoverflow.com/questions/7317273/warn-user-before-leaving-web-page-with-unsaved-changes
//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_onbeforeunload_dom
export default {
  metaInfo:   {
    title: 'Ayuda',
  },
  data: () => ({
      item: 1,
      items: [
      ],

  }),
  components: { 
  //PreventUnload,
  },
  methods: {

  },
  computed: {

  },
  beforeMount() {
  window.onbeforeunload = function() { 
    window.setTimeout(function () { 
        window.location = "/perfil";
    }, 0); 
    window.onbeforeunload = null; // necessary to prevent infinite loop, that kills your browser 
   }

}

};
</script>

<style lang="scss" module>

</style>
