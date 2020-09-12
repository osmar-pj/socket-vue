<template>
  <div id="app" class="section">
    <h1 class="title">WELCOME OSMAR's HOUSE</h1>
    <div class="field">
        <b-switch v-model="form.ledStatus" @input="activeLed" type="is-warning">
            ENCENDER PATIO DE CASA
        </b-switch>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    activeLed() {
      this.axios.post(`${this.baseURL}/api/led`, this.form)
      .then(res => {
        this.form.ledStatus = res.data.status
      })
    }
  },
  mounted() {
    this.$socket.on('led', (data) => {
      this.form.ledStatus = data
    })
    // this.$socket.on('led', (data) => {
    //   this.form.ledStatus = data
    // })
  },
  data() {
    return {
      form: {
        ledStatus: false
      },
      baseURL: `http://192.168.0.2:${process.env.VUE_APP_SOCKET_PORT}`,
      //baseURL: `http://osmarpj.com`
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
