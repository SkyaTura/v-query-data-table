import Vue from 'vue'
import QueryDataTable from './QueryDataTable'
import * as DatatablesStore from './store'

Vue.component('QueryDataTable', QueryDataTable)

export default async (ctx, inject) => {
  const { store } = ctx
  await store.registerModule('datatables', DatatablesStore)
  const datatable = key => ({
    table: store.getters['datatables/getTable'](key),
    query: () => store.dispatch('datatables/query', { key }),
    fetch: () => store.dispatch('datatables/fetch', { key, options }),
    remove: () => store.commit('datatables/TABLE_REMOVE', key),
    search: searchString =>
      store.dispatch('datatables/search', { key, searchString }),
    paginate: pagination =>
      store.dispatch('datatables/paginate', { key, pagination }),
    prepare: (options, quiet) =>
      store.dispatch('datatables/prepare', { key, options, quiet }),
    config: (options, quiet) =>
      store.dispatch('datatables/config', { key, options, quiet }),
  })
  inject('datatable', datatable)
}
