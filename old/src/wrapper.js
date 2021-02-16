import component from './components/v-query-data-table.vue'

// Declara a função de instalação executada pelo Vue.use()
export function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('VQueryDataTable', component)
}

// Cria a definição do módulo para Vue.use()
const plugin = { install }

// Auto-instala quando o Vue é encontrado (no navegador via <script>)
let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}

component.install = install
// Para permitir o uso como um módulo exportável (npm/webpack/etc.)
export default component
