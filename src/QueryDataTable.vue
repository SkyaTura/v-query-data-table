<template lang="pug">
v-card(flat, v-if="table")
  v-card-title
    v-layout(align-end, row, fill-height)
      slot(name="title-prepend")
      h5.headline.md-0(v-if="title")
        slot(name="title") {{ title }}
        slot(name="tooltip")
      slot(name="title-append")
      v-spacer
      slot(name="search-prepend")
      SearchField(v-if="!hideSearch" :value="searchString", @input="search")
      slot(name="search-append")
  v-card-text
    slot
    v-data-table(
      v-bind="usedProps",
      :headers="table.headers",
      :items="items",
      :pagination="table.query.pagination",
      :loading="loading",
      :total-items="table.dataset.totalItems",
      @update:pagination="paginate"
    )
      template(slot="no-data")
        slot(name="no-data")
          p.title.text-xs-center(v-if="loading") Carregando...
          v-alert(v-else :value="true" color="error" icon="warning")
            | Sua busca {{ !searchString ? &apos;&apos; : &grave;por &quot;${searchString}&quot;&grave; }} n&atilde;o encontrou resultados.
      template(slot="header-cell" slot-scope="props")
        slot(name="header-cell", v-bind="props", :$slotScope="props")
      //- template(slot="headers" slot-scope="props")
        slot(name="headers", v-bind="props", :$slotScope="props")
      template(slot="items" slot-scope="props")
        slot(name="items", v-bind="props", :$slotScope="props")
          tr(@click="props.expanded = !props.expanded")
            td(
              v-for="cell in table.headers",
              :align="cell.align",
              :key="props.item[cell.value][usedProps.itemKey || 'id']"
            ) {{ props.item[cell.value] }}
      template(slot="page-text" slot-scope="props")
        slot(name="page-text", v-bind="props", :$slotScope="props")
      template(slot="expand" slot-scope="props")
        slot(name="expand", v-bind="props", :$slotScope="props")
      template(slot="actions-append")
        slot(name="actions-append")
      template(slot="actions-prepend")
        slot(name="actions-prepend")
      template(slot="footer")
        slot(name="footer")
      template(slot="no-results")
        slot(name="no-results")
</template>

<script>
import SearchField from './SearchField'

export default {
  name: 'QueryDataTable',
  components: { SearchField },
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'v-card' },
    title: { type: String, default: '' },
    store: { type: String, required: true },
    storeSetup: { type: Object, default: () => ({}) },
    itemTransform: { type: Function, default: null },
    dataTableProps: { type: Object, default: () => ({}) },
    hideSearch: { type: Boolean, default: false },
  },
  computed: {
    datatable() {
      return this.$datatable(this.store)
    },
    table() {
      return this.datatable.table
    },
    items() {
      const { table, itemTransform } = this
      return typeof itemTransform === 'function'
        ? table.dataset.items.map(itemTransform)
        : table.dataset.items
    },
    loading() {
      return this.table.loading
    },
    searchString() {
      return this.table.query.searchString
    },
    usedProps() {
      return { ...this.table.dataTableProps, ...this.dataTableProps }
    },
  },
  async mounted() {
    const { table, store, storeSetup } = this
    if (!table && storeSetup) {
      await this.datatable.prepare(storeSetup)
      return
    }
    if (table.dataset.items.length) return
    this.query()
  },
  methods: {
    fetchData() {
      return this.datatable.fetch()
    },
    query() {
      return this.datatable.query()
    },
    paginate(pagination) {
      return this.datatable.paginate(pagination)
    },
    search(searchString) {
      return this.datatable.search(searchString)
    },
  },
}
</script>
