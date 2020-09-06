import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.config.productionTip = false
Vue.use(Buefy)

Vue.prototype.$socket = io(`http://localhost:${process.env.VUE_APP_SOCKET_PORT}`)

new Vue({
  render: h => h(App),
}).$mount('#app')
