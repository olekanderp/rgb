<template>
  <v-app>
    <v-main>
<!--      <HelloWorld/>-->
        <div>
          <v-btn color="success">Success</v-btn>
          <v-btn color="error">Error</v-btn>
          <v-btn color="warning">Warning</v-btn>
          <v-btn color="info">Info</v-btn>
        </div>

    </v-main>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    //
  }),
}
</script>
