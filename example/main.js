import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VQueryDataTable from '../src/main.js'

Vue.config.productionTip = false
Vue.use(VQueryDataTable)

const vue = new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

if (typeof window !== 'undefined') {
  window.$vue = vue
}
