<template>
  <div id="app" class="section">
    <h1 class="title">WELCOME OSMAR's HOUSE</h1>
    <div class="field">
        <b-switch v-model="form.ledStatus" @input="activeLed" type="is-warning">
            ENCENDER PATIO DE CASA
        </b-switch>
    </div>
    <hr>
    <h2 class="subtitle">Temperatura y humedad!</h2>
    <chart width="500" :options="options" :series="series"></chart>
  </div>
</template>

<script>
import Chart from 'vue-apexcharts'

export default {
  components: {
    Chart
  },
  methods: {
    activeLed() {
      this.axios.post(`${this.baseURL}/api/led`, this.form)
      .then(res => {
        this.form.ledStatus = res.data.status
      })
    }
  },
  created() {
    this.axios.get(`${this.baseURL}/api/parametro`)
    .then(res => {
      const temp = res.data.t
      const hum = res.data.h
      const fecha = res.data.date
      temp.reverse()
      hum.reverse()
      fecha.reverse()
      this.t = temp
      this.h = hum
      this.date = fecha
    })
  },
  mounted() {
    this.$socket.on('led', (data) => {
      this.form.ledStatus = data
    })
    this.$socket.on('params', (data) => {
      const temp = data.t
      const hum = data.h
      const fecha = data.date
      temp.reverse()
      hum.reverse()
      fecha.reverse()
      this.t = temp
      this.h = hum
      this.date = fecha
    })
  },
  data() {
    return {
      form: {
        ledStatus: false
      },
      parametros: [],
      t: [],
      h: [],
      date: [],
      baseURL: `http://localhost:${process.env.VUE_APP_SOCKET_PORT}`,
      //baseURL: `http://osmarpj.com`,
    }
  },
  computed: {
    series() {
      return [
        {
          type: 'line',
          name: 'Temperatura',
          data: this.t
        },
        {
          type: 'line',
          name: 'Humedad',
          data: this.h
        }
      ]
    },
    options() {
      return {
        chart: {
          id: 'Temperatura y humedad'
        },
        xaxis: {
          categories: this.date
        }
      }
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
