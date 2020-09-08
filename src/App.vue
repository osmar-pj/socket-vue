<template>
  <div id="app" class="section">
    <h1>SOCKET</h1>
    <b-field label="Name">
        <b-input v-model="form.temperature" type="number" size="0.01"></b-input>
    </b-field>
    <section>
        <b-button @click="sendParametro">Send</b-button>
    </section>
    <hr>
    <h1>AXIOS</h1>
    <b-field label="Name">
        <b-input v-model="form.temperature" type="number" size="0.01"></b-input>
    </b-field>
    <section>
        <b-button @click="sendAxios">Enviar</b-button>
    </section>
    <hr>
    <ul>
      <li v-for="temp in parametros" :key="temp.id">
        {{ temp }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    sendParametro() {
      this.$socket.emit('send', ({
        parametro: this.form.temperature
      }))
    },
    sendAxios() {
      this.axios.post(`${this.baseURL}/api/parametro`, this.form)
      .then(res => {
        console.log(res.data)
      })
    }
  },
  mounted() {
    this.$socket.on('update', (data) => {
      this.parametros = data
    })
  },
  data() {
    return {
      form: {
        temperature: 0
      },
      parametros: [],
      baseURL: `http://192.168.0.2:${process.env.VUE_APP_SOCKET_PORT}`,
      //baseURL: `http://55d72a594f50.ngrok.io:3000`
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
