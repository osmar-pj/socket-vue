<template>
  <div id="app" class="section">
    <h1>HELLO WORLD</h1>
    <b-field label="Name">
        <b-input v-model="parametro" type="number" size="0.01"></b-input>
    </b-field>
    <section>
        <b-button @click="sendParametro">Send</b-button>
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
        parametro: this.parametro
      }))
    }
  },
  mounted() {
    this.$socket.on('update', (data) => {
      this.parametros = data
    })
  },
  data() {
    return {
      parametros: [],
      parametro: ''
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
