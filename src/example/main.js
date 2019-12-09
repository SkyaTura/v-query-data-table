import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

const vue = new Vue({
  vuetify,
  render: h => h(App),
}).$mount('#app')

if (typeof window !== 'undefined') {
  window.$vue = vue
}
