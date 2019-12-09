<template lang="pug">
v-card(flat color="transparent" v-if="loading.firstTime && loading.active")
  v-skeleton-loader(type="table")
v-card(flat color="transparent" v-else)
  v-card-title.align-center
    .display-1 Titulo
    v-spacer
    v-col(cols="12" sm="5" md="4" :order="$vuetify.breakpoint.xsOnly ? 1 : 0")
      v-text-field(
        label="Buscar"
        v-model="search"
        append-icon="search"
        clearable
        dense
        flat
        hide-details
        outlined
        rounded
        solo
        single-line
      )
    v-row.shrink.pa-0.hidden-sm-and-down
      template(v-if="validActions.quick.length")
        v-btn.ml-3(v-for="action in validActions.quick" :key="action.name" @click="action.handler" v-bind="action.options || { color: 'primary' }")
          v-icon {{ action.icon }}
          span {{ action.text }}
    v-menu(bottom left offset-x)
      template(v-slot:activator="{ on }")
        v-btn.ml-5(icon v-on="on")
          v-icon more_vert
      v-list
        template(v-if="validActions.table.length")
          v-list-item(v-for="action in validActions.table" :key="action.name" @click="action.handler")
            v-list-item-avatar.mr-0
              v-icon {{ action.icon }}
            v-list-item-title {{ action.text }}
          v-divider
        v-list-item(@click="refresh")
          v-list-item-avatar.mr-0
            v-icon refresh
          v-list-item-title Atualizar
        v-list-item.hidden-sm-and-down(@click="")
          v-list-item-avatar.mr-0
            v-icon print
          v-list-item-title Imprimir
        v-list-item(@click="")
          v-list-item-avatar.mr-0
            v-icon settings_applications
          v-list-item-title Opções de visualização
  v-data-table(
    multi-sort
    show-select
    v-model="selected"
    :loading="loading.active"
    :headers="headers"
    :items="items"
    :search="search"
    :page.sync="pagination.page"
    itemKey="name"
    :itemsPerPage="pagination.itemsPerPage"
    hide-default-footer
    show-group-by
    @page-count="pagination.pageCount = $event"
  )
  v-row.align-center.justify-space-between
    v-col
      .caption Exibindo X de Y itens.
    v-col
      v-pagination.pagination(
        v-model="pagination.page"
        :length="pagination.pageCount"
        color="secondary"
      )
    v-col(cols="2")
      v-select(label="Itens por página:" v-model="pagination.itemsPerPage" :items="itemsPerPages")

</template>

<script>
export default {
  name: 'VQueryDataTable',
  props: {
    actions: { type: Object, default: () => ({}) },
    api: { type: Object, default: () => null },
    headers: { type: Array, required: true },
    fetch: { type: Function, required: true },
  },
  data: () => ({
    selected: [],
    itemsPerPages: [5, 10, 25, 50, 100],
    pagination: {
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
    },
    items: [],
    search: '',
    loading: {
      firstTime: true,
      active: true,
    },
  }),
  computed: {
    validActions() {
      const { actions = {} } = this
      const single = Object.entries(actions.single || {})
      const table = Object.entries(actions.table || {})
      const bulk = Object.entries(actions.bulk || {})
      const actionReducer = type => (acc, [name, options]) => {
        const handler =
          typeof options.handler === 'function'
            ? options.handler
            : payload => this.$emit(`action-${type}-${name}`, payload)
        const action = { ...options, name, handler }
        console.log(action)
        return [...acc, action]
      }
      const quickFilter = ([, options]) => options.quick
      const limitFilter = max => (item, index) => index < max
      console.log(single, table, bulk)
      return {
        single: single.reduce(actionReducer('single'), []),
        table: table.reduce(actionReducer('table'), []),
        quick: table
          .filter(quickFilter)
          .filter(limitFilter(2))
          .reduce(actionReducer('table'), []),
        bulk: bulk.reduce(actionReducer('bulk'), []),
      }
    },
  },
  mounted() {
    this.refresh()
  },
  methods: {
    setLoading(active) {
      const { firstTime } = this.loading
      this.loading = {
        active,
        firstTime: firstTime && active,
      }
    },
    async refresh() {
      this.setLoading(true)
      this.items = await this.fetch()
      this.setLoading(false)
    },
  },
}
</script>

<style lang="sass" scoped>
.pagination
  width: auto !important
</style>
