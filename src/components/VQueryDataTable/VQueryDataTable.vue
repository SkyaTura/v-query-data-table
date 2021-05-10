<template lang="pug">
v-card(color="transparent" flat v-if="loading.firstTime && loading.active")
  v-skeleton-loader(type="table")
v-card.VQueryDataTable(
  color="transparent"
  flat
  v-else
  :style="{ '--x-color': options.toolbarFieldsBackground }"
)
  slot(name="header" v-bind="options")
    TableHeader(v-on="$listeners" :options="options")

  slot(name="body" v-bind="options")
    p.px-5.py-3.mb-10.grey--text.text--darken-1(v-if="options.description") {{ options.description }}

  BulkActions(:options="options")

  DataTable.px-5(:options="options" :query.sync="iQuery")
    template(v-for="slot in options.slots.others" v-slot:[slot]="props")
      slot(v-bind="props" :name="slot")
    template(
      v-for="slot in options.slots.table"
      v-slot:[`table.${slot}`]="props"
    )
      slot(v-bind="props" :name="`table.${slot}`")

  slot(name="footer" v-bind="options")
    TableFooter(:options="options" :query="query")

  TableFab(v-on="$listeners" :options="options")

  template(v-if="showDebug")
    .text-h6 Debug
    pre {{ values.selected }}
    pre {{ options }}
</template>

<script>
import TableHeader from './TableHeader.vue'
import TableFab from './TableFab.vue'
import TableFooter from './TableFooter.vue'
import BulkActions from './BulkActions.vue'
import DataTable from './DataTable.vue'

export default {
  name: 'VQueryDataTable',
  components: { BulkActions, TableHeader, TableFooter, DataTable, TableFab },
  inheritAttrs: false,
  props: {
    showDebug: { type: Boolean, default: false },

    title: { type: String, default: '' },
    description: { type: String, default: '' },

    toolbarFieldsBackground: { type: String, default: 'grey' },
    toolbarFieldsColor: { type: String, default: 'primary' },

    hideHeader: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    hideFilter: { type: Boolean, default: false },
    hideMenu: { type: Boolean, default: false },
    hideTableQuickActions: { type: Boolean, default: false },
    hideTableActions: { type: Boolean, default: false },
    hideTableFAB: { type: Boolean, default: false },
    hideSingleActions: { type: Boolean, default: false },
    hideAllActions: { type: Boolean, default: false },
    hideRowGroupClose: { type: Boolean, default: false },
    hideRowGroupExpansion: { type: Boolean, default: false },

    disablePagination: { type: Boolean, default: false },
    disableSorting: { type: Boolean, default: false },

    tableActions: { type: Object, default: () => ({}) },
    singleActions: { type: Object, default: () => ({}) },
    bulkActions: { type: Object, default: () => ({}) },
    actions: { type: Object, default: () => ({}) },

    headers: { type: Array, required: true },
    items: { type: Array, default: () => null },
    datatable: { type: Object, default: () => ({}) },

    multiSort: { type: Boolean, default: false },
    mustSort: { type: Boolean, default: false },

    disallowDense: { type: Boolean, default: false },
    disallowGroups: { type: Boolean, default: false },
    disallowKeepGroupedColumns: { type: Boolean, default: false },

    fetch: { type: Function, default: null },
    query: { type: Object, default: null },
    overrideQuery: { type: Object, default: null },
    itemsMap: { type: Function, default: (item) => item },
  },
  data: () => ({
    loading: {
      active: true,
      firstTime: true,
    },

    dense: localStorage?.getItem('v-query-data-table:dense') === 'true',
    keepGroupedColumns:
      localStorage?.getItem('v-query-data-table:keepGroupedColumns') === 'true',

    fetchedItems: [],
    totalCount: 0,
    resultCount: 0,
    cache: new Map(),
    iQuery: {
      search: '',
      filter: '',
      page: 1,
      itemsPerPage: parseInt(
        localStorage?.getItem('v-query-data-table:itemsPerPage') ?? 10,
        10
      ),
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    },

    values: {
      selected: [],
    },

    filter: {
      drawer: false,
      operator: ',',
      items: {},
      values: {},
      search: {},
      loading: {},
    },
  }),
  computed: {
    queryJSON() {
      return JSON.stringify(this.iQuery)
    },
    oldActions() {
      const { singleActions, bulkActions, tableActions } = this
      const { single, table, bulk } = this.actions
      return {
        singleActions: { ...single, ...singleActions },
        tableActions: { ...table, ...tableActions },
        bulkActions: { ...bulk, ...bulkActions },
      }
    },
    computedHeaders() {
      const { disableSorting, headers } = this
      const actionsDefaults = {
        sortable: false,
        groupable: false,
      }
      return headers
        .map((header) => ({
          ...(header.value === '_actions' ? actionsDefaults : {}),
          ...header,
          ...(disableSorting ? { sortable: false } : {}),
          itemSlot: `item.${header.value}`,
          headerSlot: `header.${header.value}`,
          $custom: {
            template: 'default',
            ...header.$custom,
          },
          $extra: {
            visible: true,
            filterable: header.value !== '_actions',
            filterType: 'select',
            transformItem: null,
            ...header.$extra,
          },
        }))
        .filter((header) => {
          if (header.value !== '_actions') return true
          return !this.hideSingleActions && !this.hideAllActions
        })
    },
    transformableHeaders() {
      return this.computedHeaders
        .filter((item) => item.$extra.transformItem)
        .map((item) => [item.value, item.$extra.transformItem])
    },
    computedItems() {
      const items = this.items || this.fetchedItems
      return items
        .map((item) =>
          this.transformableHeaders.reduce(
            (acc, [key, transform]) => {
              const oldValue = acc[key]
              const getNewValue = () => {
                if (typeof transform === 'function') return transform(oldValue)
                if (typeof transform === 'object')
                  return transform[oldValue] || oldValue
                return oldValue
              }
              return { ...acc, [key]: getNewValue() }
            },
            { $raw: item, ...item }
          )
        )
        .map((item, index, self) => {
          const mapped = this.itemsMap(item, index, self)
          return { $raw: item.$raw, ...mapped }
        })
    },
    options() {
      return {
        ...this.$props,
        ...this.oldActions,
        filter: this.filter,
        loading: this.loading,
        dense: this.dense && !this.disallowDense,
        keepGroupedColumns: this.keepGroupedColumns,
        headers: this.computedHeaders,
        query: this.iQuery,
        clearCache: () => this.clearCache(),
        refresh: () => this.refresh(),
        cleanRefresh: () => this.cleanRefresh(),
        toggleDense: () => this.toggleDense(),
        toggleKeepGroupedColumns: () => this.toggleKeepGroupedColumns(),
        setSearch: (newValue) => this.setSearch(newValue),
        values: this.values,
        slots: {
          others: Object.keys(this.$scopedSlots).filter(
            (key) => !key.startsWith('table.')
          ),
          table: Object.keys(this.$scopedSlots)
            .filter((key) => key.startsWith('table.'))
            .map((key) => key.substring(6)),
        },
        pagination: {
          pagesCount: Math.ceil(this.totalCount / this.iQuery.itemsPerPage),
          resultCount: this.resultCount,
          totalCount: this.totalCount,
        },
        datatable: {
          ...this.$attrs,
          // disableSort: this.disableSort,
          disablePagination: this.disablePagination,
          dense: this.disallowDense ? false : this.dense,
          ...this.datatable,
          items: this.computedItems,
          loading: this.loading.active,
          showSelect: Object.keys(this.oldActions.bulkActions).length >= 1,
          hideDefaultFooter: true,
          headers: this.computedHeaders,
          disabled: this.loading.active,
          // value: this.selected,
          options: {
            ...this.iQuery,
            ...this.datatable.options,
            multiSort: this.multiSort,
            mustSort: this.mustSort,
            ...this.overrideQuery,
          },
        },
      }
    },
  },
  watch: {
    queryJSON: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue === oldValue) return
        this.refresh()
        this.$emit('update:query', JSON.parse(newValue) || {})
      },
    },
    query: {
      deep: true,
      handler(newValue) {
        this.iQuery = JSON.parse(JSON.stringify(newValue)) || {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        }
      },
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    setSearch(newValue) {
      this.search = newValue
    },
    toggleDense() {
      const dense = !this.dense
      localStorage?.setItem('v-query-data-table:dense', dense)
      this.dense = dense
    },
    toggleKeepGroupedColumns() {
      const keepGroupedColumns = !this.keepGroupedColumns
      localStorage?.setItem(
        'v-query-data-table:keepGroupedColumns',
        keepGroupedColumns
      )
      this.keepGroupedColumns = keepGroupedColumns
    },
    clearCache() {
      this.cache = new Map()
    },
    async getItems() {
      const { queryJSON } = this
      const fromCache = this.cache.get(queryJSON)
      if (fromCache) return fromCache
      const response = await this.fetch(JSON.parse(queryJSON))
      this.cache.set(queryJSON, response)
      return response
    },
    cleanRefresh() {
      this.clearCache()
      this.refresh()
    },
    async refresh() {
      this.loading.active = true
      if (typeof this.fetch === 'function') {
        try {
          const response = await this.getItems()

          if (!response.data) throw new Error('Invalid fetch result')

          this.resultCount = response.resultCount ?? response.data.length
          this.totalCount = response.totalCount ?? response.data.length
          this.fetchedItems = response.data
        } catch (e) {
          console.error(e)

          this.fetchedItems = []
          this.resultCount = 0
          this.totalCount = 0
        }
      }
      this.loading.firstTime = false
      this.loading.active = false
    },
  },
}
</script>

<style lang="sass" scoped>
.bulk-actions
  ::v-deep
    .v-expansion-panel
      &::before
        box-shadow: none
</style>
