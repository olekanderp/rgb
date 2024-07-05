<template>
  <v-app>
    <v-main>
      <v-container class="mb-6">
        <v-row  align="start" class="mt-2" no-gutters >
          <v-col>
            <v-file-input
                label="File input"
                v-model='file'
                accept=".pdf"
                @change="handleFileChange"
            >
            </v-file-input>
          </v-col>
        </v-row>
        <v-row  align="start" no-gutters >
          <v-col>
            <v-btn color="warning" @click="uploadFile">Upload</v-btn>
          </v-col>
        </v-row>
        <v-row  align="start" class="mt-10" no-gutters >
          <v-col>
            <v-btn color="info" @click="getAllFiles">Get all files</v-btn>
          </v-col>
        </v-row>
        <v-row  align="start" class="mt-2" no-gutters >
          <v-col>
            <v-btn color="info"  @click="allUsers">Get all users</v-btn>
          </v-col>
        </v-row>
        <v-row  align="start" class="mt-2" no-gutters >
          <v-col>
            <v-btn color="success"  @click="getByIdUsers">Get by ID users</v-btn>
          </v-col>
          <v-col>
            {{JSON.stringify(infoUser)}}
          </v-col>
        </v-row>
        <v-row  align="start" class="mt-2" no-gutters >
          <v-col>
            <v-btn color="info"  @click="getByIdFile">Get by ID File</v-btn>
          </v-col>
          <v-col>
            <v-text-field
                v-model="idFile"
                label="ID file"
            ></v-text-field>

          </v-col>
          <v-col>
            {{JSON.stringify(infoFiles)}}
          </v-col>
        </v-row>
        <v-row  align="start" class="mt-2" no-gutters >
          <v-col>
            <v-btn color="success"  @click="checkAndCreateUser">Сheck and create user</v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-data-table :items="items"></v-data-table>
        </v-row>
      </v-container>


    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    file: null,
    idUser: "",
    items: [],
    infoUser: "",
    infoFiles: "",
    idFile: null,
    api: process.env.VUE_APP_API

  }),
  async created() {
    await this.checkAndCreateUser()
    await this.getAllFiles()
  },
  methods:{
    async checkAndCreateUser(){
      let allUsers = await this.allUsers()
      if (!allUsers.length){
        let createUser = await this.createUser()
        console.log("createUser", createUser)
        this.idUser = createUser._id
      }else {
        this.idUser = allUsers[0]._id
      }
    },
    async allUsers(){
      try {
        const response = await axios.get(this.api + '/users');
        console.log(response)
        return response.data
      } catch (error) {
        console.error(error);
      }
    },
    handleFileChange(file) {
      if (file && file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5 MB');
        this.file = null;
      }
    },
    async uploadFile() {
      if (!this.file) {
        alert('No file selected or file size exceeds the limit');
        return;
      }
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('userId', this.idUser);
      try {
        const axiosConfig = {
          method: 'post',
          url: this.api + '/fiels',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
        const response = await axios(axiosConfig);
        console.log("response", response)
        await this.getAllFiles()
      } catch (error) {
        console.error(error);
      }
    },
    async getAllFiles(){
      try {
        const axiosConfig = {
          method: 'get',
          url: this.api + '/fiels',
        };
        const response = await axios(axiosConfig);
        this.items = response.data
        console.log(response)
      } catch (error) {
        console.error(error);
      }
    },
    async getByIdUsers(){
      try {
        const axiosConfig = {
          method: 'get',
          url: this.api + '/users/' + this.idUser,
        };
        const response = await axios(axiosConfig);
        console.log(response)
        this.infoUser = JSON.stringify(response.data)
      } catch (error) {
        console.error(error);
      }
    },
    async getByIdFile(){
      if (this.idFile){
        try {
          const axiosConfig = {
            method: 'get',
            url: this.api + '/fiels/' + this.idFile,
          };
          const response = await axios(axiosConfig);
          console.log(response)
          this.infoFiles = JSON.stringify(response.data)
        } catch (error) {
          console.error(error);
        }
      }
    },
    async createUser(){
      try {
        const axiosConfig = {
          method: 'post',
          url: this.api + '/users',
          data: {name: "Test 1"}
        };
        const response = await axios(axiosConfig);
        console.log(response)
        return response.data
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
