import Vue from 'vue'
import App from './App.vue'

import VueTailwind from 'vue-tailwind'
import VueSimpleAlert from 'vue-simple-alert'
import './main.css'

const settings = {}

Vue.use(VueTailwind, settings)
Vue.use(VueSimpleAlert)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
