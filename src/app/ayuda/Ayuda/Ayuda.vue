<template>
<<<<<<< HEAD
  <div >
    <v-app >
 </v-app>
=======
  <div :class="$style.ayuda" id="dispositivo">
    <br />
   <br />
 <vue-headline level="1">Ayuda</vue-headline>
>>>>>>> origin/master
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

import VueInput from '@/app/shared/components/VueInput/VueInput.vue';
import VueSelect from '@/app/shared/components/VueSelect/VueSelect.vue';
import VueCheckbox from '@/app/shared/components/VueCheckbox/VueCheckbox.vue';
import VueButton from '@/app/shared/components/VueButton/VueButton.vue';
import { addNotification, INotification } from '@/app/shared/components/VueNotificationStack/utils';

<<<<<<< HEAD
import '../../../../node_modules/@mdi/font/css/materialdesignicons.css';
import '../../../../node_modules/vuetify/dist/vuetify.css';
=======

>>>>>>> origin/master
//import { AyudaModule } from '../module';
import firebase from 'firebase';

var db = firebase.database();




export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  metaInfo:   {
    title: 'Ayuda',
  },
  components: {
    VueGrid,
    VueBreadcrumb,
    VueGridRow,
    VueGridItem,
    VueButton,
    VueHeadline,
    VueCheckbox, 
    VueSelect,
    VueInput,
  },
    data(): any {
    return {
      form: {
        firstname: '',
        email: '',
        zipCode: '',
        country: '',
        acceptTerms: false,
        newsletter: false,
      },
      countryOptions: [
        { label: 'Germany', value: 'de' },
        { label: 'USA', value: 'us' },
        { label: 'Other', value: 'other' },
      ],
      isLoading: false,
    };
  },
  methods: {
    onSubmit() {
      this.isLoading = true;
      // tslint:disable-next-line
      console.log(JSON.parse(JSON.stringify(this.form)));

      this.$emit('submit', this.form);
   //allow read, write: if request.auth.uid != null;
   //https://manuais.iessanclemente.net/index.php/Firebase_-_Base_de_Datos_en_Tiempo_Real#Guardar_datos_en_Firebase

db.ref('users/' + 'dppg/' + 'fincas').push({
    descripcion: "En ppg",
    localizacion: "Monte"
  });

/*db.ref('fincas').set({
    Descripcion: "Los Angeles",
    ID: 4,
});*/


      this.$nextTick(
        /* istanbul ignore next */ () => {
          setTimeout(() => {
            this.isLoading = false;
            addNotification({
              title: 'Data has been saved!',
              text: 'Have a look at the console!',
            } as INotification);
          }, 1000);
        },
      );
    },

  },
  computed: {
    breadCrumbItems() {
      return [
        { label: this.$t('common.home' /* Home */), href: '/' },
        { label: this.$t('common.Ayuda' /* Ayuda */), href: '/ayuda' },
      ];
    },

    addressDisabled() {
      return this.form.firstname === '' || this.form.lastname === '' || this.form.email === '';
    },
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      let hasEmptyField: boolean = false;

      Object.keys(this.form).forEach((key: string) => {
        if (key !== 'newsletter' && (this.form[key] === '' || this.form[key] === false)) {
          hasEmptyField = true;
        }
      });

      return hasEmptyField;
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
    },
  },
  beforeCreate() {
    //registerModule('ayuda', AyudaModule);
  },
  prefetch: (options: IPreLoad) => {
    //registerModule('ayuda', AyudaModule);

    /**
     * This is the function where you can load all the data that is needed
     * to render the page on the server and client side
     *
     * This function always returns a promise that means, if you want to
     * call a vuex action you have to return it, here is an example
     *
     * return options.store.dispatch('fetchAyuda', '1');
     *
     * If you need to fetch data from multiple source your can also return
     * a Promise chain or a Promise.all()
     */
   // return Promise.resolve();
  },
};
</script>

<<<<<<< HEAD
<style >

=======
<style lang="scss" module>
@import "~@/app/shared/design-system";

.ayuda {
  margin-top: $nav-bar-height;
  min-height: 500px;
  margin-left:5%;
}
>>>>>>> origin/master
</style>
