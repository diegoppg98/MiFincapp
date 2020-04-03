<template>
  <form :class="$style.loginForm" @submit.stop.prevent="onSubmit">
    <vue-headline level="3">{{ $t('auth.LoginForm.title' /* Login Example */) }}</vue-headline>

    <br />

    <vue-input
      id="username"
      name="username"
      type="text"
      autofocus
      :label="$t('common.username' /* Username */)"
      placeholder="Correo"
      validation="required|email"
      error-message="Correo no valido"
      v-model="username"
    />

    <vue-input
      id="password"
      name="password"
      type="password"
      :label="$t('common.password' /* Password */)"
      placeholder="Contraseña"
      validation="required|min:6"
      error-message="La contraseña debe tener al menos seis caracteres"
      v-model="password"
    />

    <vue-button color="primary" tabindex="3" type="submit" :disabled="isSubmitDisabled" :loading="loading">
      {{ $t('auth.LoginForm.cta' /* Login */) }}
    </vue-button>
  </form>
</template>

<script lang="ts">
import VueHeadline from '@components/VueHeadline/VueHeadline.vue';
import VueInput from '@components/VueInput/VueInput.vue';
import VueButton from '@components/VueButton/VueButton.vue';


import {Database} from '../../../../interfaceDatabase';
import {ImplementationDatabase} from '../../../../firebaseImplementation';
let FunctionsDatabase: Database = new ImplementationDatabase();

export default {
  $_veeValidate: {
    validator: 'new' as 'new',
  },
  name: 'LoginForm',
  components: { VueButton, VueInput, VueHeadline },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data(): any {
    return {
      username: '',
      password: '',
    };
  },
  computed: {
    hasErrors() {
      return this.errors && this.errors.items.length > 0;
    },
    hasEmptyFields() {
      return this.username.trim() === '' || this.password.trim() === '';
    },
    isSubmitDisabled() {
      return this.hasErrors || this.hasEmptyFields;
    },
  },
  methods: {
    onSubmit() {
      FunctionsDatabase.login(this.username,this.password).then((user) =>{ this.$emit('submit', this.$data)}, (error) => { alert("Datos incorrectos"); console.log(error);});

    /* INICIO MEDIANTE GOOGLE
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(function(result) {
         this.$emit('submit', this.$data);
         // This gives you a Google Access Token. You can use it to access the Google API.
         var token = result.credential.accessToken;
         // The signed-in user info.
         var user = result.user;
         // ...
      }).catch(function(error) {
         // Handle Errors here.
         alert(error.message);
         var errorCode = error.code;
         var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });    */


    },
  },
};
</script>

<style lang="scss" module>
@import '~@/app/shared/design-system';

.loginForm {
  display: block;

  @include mediaMin(tabletPortrait) {
    min-width: 512px;
  }
}
</style>
