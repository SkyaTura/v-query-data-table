import Component from './components/VQueryDataTable'

const ComponentLibrary = {
  install(Vue) {
    Vue.component(Component.name, Component)
  },
}

export default ComponentLibrary

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}
