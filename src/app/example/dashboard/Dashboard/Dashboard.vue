<template>
  <div :class="$style.dashboard">
    <vue-grid>
      <vue-grid-row>
        <vue-grid-item fill>
          <vue-headline level="1">Inicio</vue-headline>
          INICIO
          <br />
          <strong>RESUMEN APP.</strong>
          <br />
          <br />
        </vue-grid-item>
      </vue-grid-row>
    </vue-grid>
  </div>
</template>

<script lang="ts">
import VueGrid from '@components/VueGrid/VueGrid.vue';
import VueGridItem from '@components/VueGridItem/VueGridItem.vue';
import VueButton from '@components/VueButton/VueButton.vue';
import VueGridRow from '@components/VueGridRow/VueGridRow.vue';
import VueHeadline from '@components/VueHeadline/VueHeadline.vue';
import { HttpService } from '@shared/services/HttpService/HttpService';
import VueBreadcrumb from '@components/VueBreadcrumb/VueBreadcrumb.vue';
import firebase from 'firebase';

export default {
  metaInfo: {
    title: 'Dashboard',
  },
  components: {
    VueBreadcrumb,
    VueGrid,
    VueGridItem,
    VueButton,
    VueGridRow,
    VueHeadline,
  },
  data(): any {
    return { pending: false };
  },
  methods: {
   
  },
  computed: {},
  mounted () {
    
  }
};
</script>

<style lang="scss" module>
@import '~@/app/shared/design-system';

.dashboard {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-right:70%;
  margin-left:30%;
  padding: 2em;
  justify-content: top-center;
  align-items: top-center;
}
</style>
