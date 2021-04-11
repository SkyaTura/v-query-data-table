<template lang="pug">
v-navigation-drawer(
  app
  right
  temporary
  v-model="options.filter.drawer"
  width="400"
)
  v-row.ma-0.flex-column.filterDrawer
    .title.py-4.px-5 Filtros da Tabela
    v-divider
    v-radio-group.px-5(v-model="options.filter.operator")
      p Tipos de filtragem:
      v-radio(label="Resultados exclusivos" value=",")
      v-radio(label="Resultados inclusivos" value=";")
    v-row.ma-0.filterDrawer-wrapper
      v-row.ma-0.pa-3.filterDrawer-content
        slot(name="filter-prepend")
        template(v-for="row in filterableHeaders")
          template(v-if="row.$extra.filterType === 'range'")
            v-range-slider.pt-10.rangeSlider(
              hide-details
              thumb-label="always"
              v-model="options.filter.values[row.value]"
              :label="row.text"
              :max="getFieldMax(row.value)"
              :min="getFieldMin(row.value)"
            )
          template(v-else)
            v-autocomplete.flex-grow-0.my-2(
              filled
              hide-details
              item-text="text"
              item-value="value"
              multiple
              small-chips
              v-model="options.filter.values[row.value]"
              :items="sortFilterItems[row.value]"
              :label="row.text"
              @focus="populateFilter(row.value)"
              :loading="options.filter.loading[row.value]"
            )
              template(v-slot:item="{ item, on, attrs }")
                v-list-item(v-bind="attrs" v-on="on")
                  v-list-item-content
                    v-list-item-title {{ item.text }}
                  v-list-item-action
                    v-list-item-subtitle {{ item.count }} {{ item.count > 1 ? 'itens' : 'item' }}
              template(v-slot:selection="{ item, index }")
                v-chip(v-if="index < 3") {{ index < 2 || options.filter.values[row.value].length <= 3 ? item.text : `e outros ${options.filter.values[row.value].length - 2}` }}
        slot(name="filter-append")
        v-row.mx-0.mt-4(justify="end")
          slot(name="filter-actions-prepend")
          v-btn(text @click="clearFilters") Limpar filtros
          slot(name="filter-actions-append")
</template>

<script>
export default {
  name: 'TableDrawer',
  props: {
    options: { type: Object, required: true },
  },
  data: () => ({
    filtersDrawer: false,
  }),
  computed: {
    filterableHeaders() {
      return this.options.headers.filter(
        (header) => header.$extra.filterable !== false
      )
    },
    sortFilterItems() {
      const { items, values } = this.options.filter
      return Object.entries(items)
        .map(([field, itemValues]) => [
          field,
          itemValues
            .map((item) => ({ ...item, text: item.value }))
            .sort((a, b) => {
              const A = (values[field] || []).includes(a.value)
              const B = (values[field] || []).includes(b.value)
              if (A && !B) return -1
              if (!A && B) return 1
              if (a.value > b.value) return 1
              if (a.value < b.value) return -1
              return 0
            }),
        ])
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    },
  },
  watch: {
    'options.filter.drawer': {
      handler(newValue) {
        if (!newValue) return
        this.options.headers
          .filter((header) => header.$extra.filterType !== 'select')
          .forEach((header) => this.populateFilter(header.value))
      },
    },
    'options.filter': {
      deep: true,
      handler() {
        const { filterableHeaders } = this
        const {
          filter: { values, operator },
          query,
        } = this.options
        query.filter = filterableHeaders
          .map((header) => {
            const headerValues = values[header.value]
            if (!headerValues?.length) return null
            if (header.$extra.filterType === 'range') {
              return `${header.value}(gte:${headerValues[0]});${header.value}(lte:${headerValues[1]})`
            }
            return headerValues
              .map((value) => `${header.value}(${value})`)
              .join(';')
          })
          .filter(Boolean)
          .join(operator)
        /*
Object.entries(values)
          .reduce(
            (acc, [field, items]) => [
              ...acc,
              ...items.map((item) => [field, item], []),
            ],
            []
          )
          .filter((v) => v[1] !== '')
          .map(([field, value]) => `${field}(${value})`)
*/
      },
    },
  },
  methods: {
    clearFilters() {
      // eslint-disable-next-line vue/no-mutating-props
      this.options.filter.values = {}
    },
    async populateFilter(field) {
      const { filter, fetch, items } = this.options
      if (typeof fetch !== 'function') {
        const values = items
          .map((item) => item[field])
          .reduce(
            (acc, value, index, self) =>
              self.indexOf(value) !== index
                ? acc
                : [
                    ...acc,
                    {
                      value,
                      count: self.filter((item) => item === value).length,
                    },
                  ],
            []
          )
        filter.items = {
          ...filter.items,
          [field]: values,
        }
        return
      }
      filter.loading = {
        ...filter.loading,
        [field]: true,
      }
      try {
        const response = await fetch({ getFilterList: field })
        const values = response.data
        filter.items = {
          ...filter.items,
          [field]: values,
        }
      } catch (e) {
        console.error(e)
      }
      filter.loading = {
        ...filter.loading,
        [field]: false,
      }
    },
    getFieldMin(field) {
      const { [field]: values } = this.options.filter.items
      if (!values || !values.length) return 0
      return values.reduce(
        (acc, cur) => Math.min(acc, parseInt(cur.value, 10)),
        Infinity
      )
    },
    getFieldMax(field) {
      const { [field]: values } = this.options.filter.items
      if (!values || !values.length) return 0
      return values.reduce(
        (acc, cur) => Math.max(acc, parseInt(cur.value, 10)),
        -Infinity
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.filterDrawer
  height: 100vh
  width: 100%
  flex-flow: column
  &-parent
    min-width: 350px
    max-width: 100vw
    border-radius: 0px !important
  &-wrapper
    flex: 1 0 0
    overflow-y: auto
    align-items: flex-start
  &-content
    height: auto
    min-height: 75%
    flex-flow: column
    justify-content: flex-start
.rangeSlider
  max-height: 70px
</style>
