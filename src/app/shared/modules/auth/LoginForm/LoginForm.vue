<template>
 
</template>

<script lang="ts">
import VueHeadline from '@components/VueHeadline/VueHeadline.vue';
import VueInput from '@components/VueInput/VueInput.vue';
import VueButton from '@components/VueButton/VueButton.vue';


import {Database} from '../../../../interfaceDatabase';
import {ImplementationDatabase} from '../../../../firebaseImplementation';
let FunctionsDatabase: Database = new ImplementationDatabase();

export default {

  name: 'LoginForm',
  /*components: { VueButton, VueInput, VueHeadline },
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

     INICIO MEDIANTE GOOGLE
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
      });    


    },
  },*/
};
</script>

<style lang="scss" module>

</style>
