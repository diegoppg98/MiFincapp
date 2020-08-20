<template>
  <div>

 </div>
</template>

<script lang="ts">
//import { registerModule } from '@/app/store';
import { IPreLoad } from '@/server/isomorphic';

import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import {router} from '../../router';
//import { HistoricoAlertaModule } from '../module';

export default {
  metaInfo:   {
    title: 'HistoricoAlerta',
  },
  components: {

  },
  data: (): any => ({}),
  methods: {},
  computed: {

  },
  beforeCreate() {
    router.push('/inicio');
  },
  /*beforeCreate() {
    registerModule('historicoAlerta', HistoricoAlertaModule);
  },
  prefetch: (options: IPreLoad) => {
    registerModule('historicoAlerta', HistoricoAlertaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchHistoricoAlerta', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
   // return Promise.resolve();
  //},
};
</script>

<style>

</style>
