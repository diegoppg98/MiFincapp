<template>
<<<<<<< HEAD
  <div>
     <v-app >
 </v-app>
 </div>
=======
  <div :class="$style.historicoAlerta">
    <vue-grid>
      <vue-breadcrumb :items="breadCrumbItems"></vue-breadcrumb>

      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">HistoricoAlerta</vue-headline>
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>
  </div>
>>>>>>> origin/master
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
<<<<<<< HEAD
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======

>>>>>>> origin/master
//import { HistoricoAlertaModule } from '../module';

export default {
  metaInfo:   {
    title: 'HistoricoAlerta',
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
  methods: {},
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.HistoricoAlerta' /* HistoricoAlerta */), href: '/historico-alerta' },
      ];
    },
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

<<<<<<< HEAD
<style>

=======
<style lang="scss" module>
@import "~@/app/shared/design-system";

.historicoAlerta {
  margin-top: $nav-bar-height;
  min-height: 500px;
}
>>>>>>> origin/master
</style>
