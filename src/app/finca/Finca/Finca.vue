<template>
  <div id="finca">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col :cols="posMap">
          <v-container>
            <v-row dense>
              <v-col v-for="(item, i) in items" :key="i" cols="12">
                <v-card color="#2e7d32" dark @click.native="clickItem(item)">
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title v-text="item.text"></v-card-title>
                    </div>
                    <v-avatar class="ma-3" size="125" tile>
                      <v-img id="image" :src="item.src"></v-img>
                    </v-avatar>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-btn
            fab
            absolute
            bottom
            right
            id="btn-flotante"
            class="white--text"
            @click="registrarFinca"
            color="#2e7d32"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import { IPreLoad } from '@/server/isomorphic';
import { router } from '../../router';
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
import { Finca } from '../../Clases/Finca';
import { FactoryAPI } from '../../FactoryAPI';

export default {
  metaInfo: {
    title: 'Finca',
  },
  components: {},
  data: () => ({
    item: 1,
    items: [],
  }),
  methods: {
    ...mapActions('app', ['changeFinca']),
    clickItem(nombreClicked) {
      this.changeFinca(nombreClicked.finca);
      router.push('/detalle-finca');
    },
    async registrarFinca() {
      router.push('/alta-finca');
    },
    imagesTypes(tipoCultivo: string) {
      switch (tipoCultivo) {
        case 'Maiz':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fmaiz.jpg?alt=media&token=5811c487-9e1d-44b1-9e09-6cbce01a146d';
        case 'Trigo':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Ftrigo.jpg?alt=media&token=c32a4754-0d2b-4577-97fa-a2c952ab8d5a';
        case 'Girasol':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fgirasol.jpg?alt=media&token=203381b1-be3a-4426-ba66-bc422ad6276f';
        case 'Cebada':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fcebada.jpg?alt=media&token=80adcae5-4f25-4c48-9c66-a69feef4c204';
        case 'Remolacha':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fremolacha.jpg?alt=media&token=4cdbb261-1ad6-4411-9fa7-c01c2f87960f';
        case 'Patatas':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fpatata.jpg?alt=media&token=38fe06ab-cf3e-45c3-a07a-de4583473cfc';
        case 'Alfalfa':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Falfalfa.jpg?alt=media&token=d85ec548-737a-47ba-9659-9ac8da25dfe6';
        case 'Forraje':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fforraje.jpg?alt=media&token=cc076670-5776-47f8-bceb-058ec4bf047c';
        case 'Alubias':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Falubias.jpg?alt=media&token=fda94680-0cdd-4e66-9f05-33a3598bec6b';
        case 'Soja':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fsoja.jpg?alt=media&token=c6820e32-5b9f-4593-a755-032557d624d9';
        case 'Veza':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fveza.jpg?alt=media&token=159d3bc6-7565-4a1e-b93c-3b37d949f92e';
        case 'Colza':
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fcolza.jpg?alt=media&token=6b5cd656-1655-4c2a-b11d-45727aa0d6e4';

        default:
          return 'https://firebasestorage.googleapis.com/v0/b/pivot-2f31f.appspot.com/o/Images%2Fdesconocido.jpg?alt=media&token=c1b6636e-2cf2-4b22-b188-9dba7f3e98dd';
      }
    },
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
  beforeMount() {
    window.onbeforeunload = function () {
      window.setTimeout(function () {
        window.location.href = '/perfil';
      }, 0);
      window.onbeforeunload = null;
    };

    var items = this.items;
    var imageType = this.imagesTypes;
    FactoryAPI.getFactoryAPI('Firebase')
      .getFinca()
      .listLands()
      .then((result) => {
        if (result !== null) {
          result.forEach(function (childResult: Finca) {
            var label = childResult.nombre;
            var tipoCultivo = childResult.cultivo;
            var image = imageType(tipoCultivo);
            items.push({ text: label, src: image, icon: 'mdi-corn', finca: childResult });
          });
        }
      });
  },
};
</script>

<style >
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
