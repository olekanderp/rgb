<template>
  <v-app>
    <v-main>
<!--      <HelloWorld/>-->
        <div>
          <v-btn color="success" @click="send">Success</v-btn>
          <v-btn color="error">Error</v-btn>
          <v-btn color="warning">Warning</v-btn>
          <v-btn color="info">Info</v-btn>
        </div>

    </v-main>
  </v-app>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios';

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    //
  }),
  methods:{
    async send(){
      console.log("send")
      try {
        const response = await axios.get('https://catfact.ninja/fact');
        console.log(response)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
}
</script>
