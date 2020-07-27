<template lang="pug">
v-card(flat color="transparent" v-if="loading.firstTime && loading.active")
  v-skeleton-loader(type="table")
v-card(flat color="transparent" v-else)
  v-dialog(v-model="goToPageDialog" max-width="300px")
    v-card
      v-card-title Ir para a página
      v-card-text
        v-select(
          label="Selecione a página"
          :items="Array(pageCount < 0 || isNaN(pageCount) ? 0 : pageCount).fill(null).map((item, index) => index + 1)"
          v-model="options.page"
          @change="goToPageDialog = false"
        )
      v-card-actions
        v-spacer
        v-btn(text color="primary" @click="goToPageDialog = false") Cancelar
  slot(name="header")
    v-card-title.align-center.pr-0
      slot(name="header.title")
        slot(name="header.title.prepend")
        .display-1 {{ title }}
        slot(name="header.title.append")
      v-spacer
      slot(name="header.search")
        v-col.py-0(
          cols="12"
          sm="5"
          md="4"
          :order="$vuetify.breakpoint.xsOnly ? 1 : 0"
          v-if="!hideSearch"
        )
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
      slot(name="header.actions")
        v-row.shrink.pa-0.hidden-sm-and-down
          template(v-if="validActions.quick.length && !hideActions")
            v-btn.ml-3(
              v-for="action in validActions.quick"
              :key="action.name"
              @click="action.handler"
              v-bind="{ color: action.color || 'primary', ...action.options }"
            )
              v-icon {{ action.icon }}
              span {{ action.text }}
        v-menu(bottom left offset-x v-if="!hideMenu")
          template(v-slot:activator="{ on }")
            v-btn.ml-5(icon v-on="on")
              v-icon more_vert
          v-list
            template(v-if="validActions.table.length && !hideActions")
              template(v-for="(action, index) in validActions.table")
                v-divider(:key="action.name" v-if="action.divider")
                v-subheader(:key="action.name" v-else-if="action.subheader") {{ action.text }}
                v-list-item(:key="action.name" v-else @click="action.handler")
                  v-list-item-avatar.mr-0
                    v-icon {{ action.icon }}
                  v-list-item-title {{ action.text }}
              v-divider
            v-list-item(@click="clearCache")
              v-list-item-avatar.mr-0
                v-icon refresh
              v-list-item-title Atualizar
            //- TODO: Adicionar layout de impressão
              v-list-item.hidden-sm-and-down(@click="")
                v-list-item-avatar.mr-0
                  v-icon print
                v-list-item-title Imprimir
            template(v-if="!disallowDense || !disallowGroups || pageCount > 1")
              v-divider
              v-subheader Opções de visualização
              v-list-item(v-if="pageCount > 1" @click="goToPageDialog = true")
                v-list-item-avatar.mr-0
                  v-icon find_in_page
                v-list-item-title Ir para a página
              v-list-item(v-if="!disallowDense" @click.stop="settings.dense = !settings.dense")
                v-switch.my-0(hide-details dense read-only :input-value="settings.dense")
                v-list-item-title Listagem densa
              v-list-item.hidden-sm-and-down(v-if="!disallowGroups" @click.stop="settings.showGroupBy = !settings.showGroupBy")
                v-switch.my-0(hide-details dense read-only :input-value="settings.showGroupBy")
                v-list-item-title Permitir agrupar
              v-list-item.hidden-sm-and-down(v-if="!disallowGroups && !disallowKeepGroupedColumns" @click.stop="settings.keepGroupedColumns = !settings.keepGroupedColumns")
                v-switch.my-0(hide-details dense read-only :input-value="settings.keepGroupedColumns")
                v-list-item-title Manter colunas agrupadas
  slot(name="body.top")
  v-expansion-panels.bulk-actions(:value="selected.length ? 0 : -1")
    v-expansion-panel
      v-expansion-panel-content
        slot(name="bulkActions" :selected="selected" :items="shownItems")
          v-card-text.pt-0
            .caption(v-if="selected.length <= 1") Ações para o item selecionado:
            .caption(v-else) Ações em massa para os {{ selected.length }} itens selecionados:
            v-row
              slot(name="bulkActions.prepend")
              v-btn.ml-3(
                small
                v-for="action in validActions.bulk"
                :key="action.name"
                @click="action.handler(selected)"
                v-bind="{ color: action.color || 'primary', ...action.options }"
              )
                v-icon(small v-if="action.icon") {{ action.icon }}
                span {{ action.text }}
              slot(name="bulkActions.append")

  //-template(v-if="loading.active")
    v-skeleton-loader(type="table-thead")
  v-data-table.VQueryDataTable(
    v-bind="dataTableAttrs"
    v-model="selected"
    ref="table"
    :options="computedOptions"
    @update:options="options = $event"
  )
    template(v-for="header in dataTableAttrs.headers" v-slot:[header.slot]="")
      .customHeader
        span.customHeader-text {{ header.text }}
        span.customHeader-actions
          span.customHeader-actions-sort(v-if="header.sortable !== false" :class="{ sorted: getHeaderSort(header).sorted }")
            v-badge(
              overlap
              color="transparent"
              :value="getHeaderSort(header).sorted"
            )
              template(v-slot:badge="")
                span.primary--text.darken-1--text {{ getHeaderSort(header).index }}
              v-tooltip(top)
                span Ordenar
                template(v-slot:activator="{ on, attrs }")
                  v-icon.invertable(v-bind="attrs" v-on="on" :class="{ 'invertable-inverted': getHeaderSort(header).desc }") arrow_upward
          span.customHeader-actions-group(
            :class="{ grouped: getHeaderGroup(header).grouped }"
            v-if="header.groupable !== false && !disallowGroups"
            @click.prevent.stop="setGroupBy(header)"
          )
            v-tooltip(top)
              span Agrupar
              template(v-slot:activator="{ on, attrs }")
                v-icon.customHeader-actions-sortIcon(v-bind="attrs" v-on="on") folder_open
    template(v-slot:body="" v-if="loading.active")
      tbody.disable-mouse
        tr
          td(colspan="100%")
            v-skeleton-loader(type="table-tbody")
    template(v-for="column in templatedColumns" v-slot:[`item.${column.value}`]="props")
      template(v-if="column.$custom.template === 'chips'")
        ColumnTemplateChip(v-bind="{ column, props }")
    template(v-slot:group.header="props")
      slot(name="group.header" v-bind="props")
        td.slotGroup-default(colspan="100%")
          v-row.ma-0.text-no-wrap(align="center")
            slot(name="group.header.content" v-bind="props")
              span(v-if="getGroupHeader(props).value !== undefined")
                span.font-weight-bold {{ getGroupHeader(props).text }}:
                span &nbsp;{{ getGroupHeader(props).value }}
      v-row.slotGroup-actions.ma-0.text-no-wrap(align="center" v-if="!hideRowGroupExpansion || !hideRowGroupClose")
        v-spacer
        v-tooltip(top v-if="!hideRowGroupClose")
          span Desagrupar
          template(v-slot:activator="{ on, attrs }")
            v-btn(
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="props.remove"
            )
              v-icon(small) close
        v-tooltip(top v-if="!hideRowGroupExpansion")
          span {{ props.isOpen ? 'Recolher' : 'Expandir' }}
          template(v-slot:activator="{ on, attrs }")
            v-btn(
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="props.toggle"
            )
              v-icon.invertable(:class="{ 'invertable-inverted': props.isOpen }") expand_more
    template(v-slot:item._actions="payload" v-if="!hideActions")
      template(v-if="$vuetify.breakpoint.smAndUp")
        .text-no-wrap
          v-tooltip(
            top
            v-for="(action, index) in validActions.single"
            :disabled="!action.text"
            :key="action.name"
          )
            template(v-slot:activator="{ on }")
              v-icon(
                small
                v-on="on"
                :class="[index ? 'ml-1' : '', getIconClasses(action)]"
                @click="action.handler(payload)"
              ) {{ action.icon }}
            span {{ action.text }}
      template(v-else)
        v-btn.ml-3(
          small
          text
          v-for="action in validActions.single"
          :key="action.name"
          @click="action.handler(payload)"
          v-bind="{ color: action.color || 'primary', ...action.options }"
        )
          v-icon(small v-if="action.icon") {{ action.icon }}
          span {{ action.text }}
    template(v-for="slot in slots" v-slot:[slot]="props")
      slot(:name="`table.${slot}`" v-bind="props")

  v-row.align-center.justify-space-between
    v-col.shrink.text-no-wrap
      template(v-if="!loading.active && serverItemsLength")
        .caption Exibindo de {{ statusBar.startIndex }} até {{ statusBar.endIndex }} de {{ serverItemsLength }} {{ serverItemsLength === 1 ? 'registro' : 'registros' }}
          template(v-if="serverItemsLength < collectionLength")  de um total de {{ collectionLength }} {{ collectionLength === 1 ? 'filtrado' : 'filtrados' }}
    v-col
      v-pagination.pagination(
        color="secondary"
        :length="pageCount"
        v-model="options.page"
        total-visible="7"
      )
    v-col.shrink
      v-select.pageSelect(
        label="Itens por página:"
        :value="options.itemsPerPage"
        :items="itemsPerPages"
        @input="changeItemsPerPage"
      )
  slot(name="body.bottom")

</template>

<script>
import ColumnTemplateChip from './ColumnTemplateChip.vue'

export default {
  name: 'VQueryDatatable',
  components: { ColumnTemplateChip },
  inheritAttrs: false,
  props: {
    title: { type: String, default: '' },
    coloredActionIcons: { type: Boolean, default: false },
    dataTableOptions: { type: Object, default: () => ({}) },
    disallowDense: { type: Boolean, default: false },
    disallowGroups: { type: Boolean, default: false },
    hideRowGroupClose: { type: Boolean, default: false },
    hideRowGroupExpansion: { type: Boolean, default: false },
    disallowKeepGroupedColumns: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
    hideMenu: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    actions: { type: Object, default: () => ({}) },
    headers: { type: Array, required: true },
    fetch: { type: Function, default: null },
    color: { type: String, default: 'primary' },
    items: { type: Array, default: () => null },
    noCaching: { type: Boolean, default: false },
    query: { type: Object, default: () => ({}) },
    overrideQuery: { type: Object, default: () => ({}) },
  },
  data: () => ({
    cache: new Map(),
    goToPageDialog: false,
    goToPageInput: 1,
    serverItemsLength: -1,
    colletionLength: -1,
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      mustSort: false,
      multiSort: true,
      pageCount: 1,
    },
    settings: {
      dense: false,
      showGroupBy: true,
      keepGroupedColumns: true,
    },
    selected: [],
    currentItems: [],
    itemsPerPages: [5, 10, 25, 50, 100],
    search: '',
    loading: {
      firstTime: true,
      active: true,
    },
  }),
  computed: {
    computedOptions() {
      const { options, overrideQuery } = this
      return { ...options, ...overrideQuery }
    },
    alignedHeaders() {
      return this.computedHeaders.filter((header) => header.align)
    },
    statusBar() {
      const { shownItems, options } = this
      const { page, itemsPerPage } = options
      const itemsLength = shownItems.length
      const startIndex = (page - 1) * itemsPerPage + 1
      const endIndex = startIndex + itemsLength - 1
      return { startIndex, endIndex }
    },
    shownItems() {
      return this.items || this.currentItems
    },
    slots() {
      return Object.keys(this.$scopedSlots)
        .filter((key) => key.startsWith('table.'))
        .map((key) => key.substring(6))
    },
    dataTableAttrs() {
      const {
        computedHeaders,
        dataTableOptions,
        shownItems: items,
        loading,
        search,
        settings,
        serverItemsLength,
        validActions,
        hideActions,
        disallowDense,
        disallowGroups,
      } = this
      const defaults = {
        multiSort: true,
        showSelect: !hideActions && !!validActions.bulk.length,
        itemKey: 'name',
        dense: !disallowDense && settings.dense,
        showGroupBy: !disallowGroups && settings.showGroupBy,
      }
      const overrides = {
        items,
        hideDefaultFooter: true,
        headers: computedHeaders,
        loading: loading.active,
        class: {
          ...(dataTableOptions.class || {}),
          'VQueryDataTable-groupable': settings.showGroupBy,
          'VQueryDataTable-selectable': true,
        },
      }
      if (serverItemsLength < 0) {
        overrides.search = search
      }
      return Object.assign(
        {},
        defaults,
        this.$attrs,
        dataTableOptions,
        overrides
      )
    },
    computedHeaders() {
      const { headers, hideActions } = this
      const common = {
        align: 'center',
      }
      const defaults = {
        _actions: { filterable: false, sortable: false, groupable: false },
      }
      const templateDefaults = {
        chips: { small: true },
      }
      return headers
        .map((header) => {
          const { $custom = {} } = header
          const { template } = $custom
          const headerDefaults = defaults[header.value] || {}
          const templateOptions = templateDefaults[template] || {}
          return Object.assign({}, common, headerDefaults, header, {
            slot: `header.${header.value}`,
            $custom: { ...templateOptions, ...$custom },
          })
        })
        .filter((item) => item.value !== '_actions' || !hideActions)
    },
    pageCount() {
      const { shownItems, options, serverItemsLength } = this
      const { itemsPerPage } = options
      if (serverItemsLength < 0) {
        return Math.ceil(shownItems.length / itemsPerPage)
      }
      return Math.ceil(serverItemsLength / itemsPerPage)
    },
    templatedColumns() {
      const { computedHeaders } = this
      const knownTemplates = ['chips']
      return computedHeaders.filter((header) =>
        knownTemplates.includes(header.$custom.template)
      )
    },
    validActions() {
      const { actions = {} } = this
      const single = Object.entries(actions.single || {})
      const table = Object.entries(actions.table || {})
      const bulk = Object.entries(actions.bulk || {})
      const actionReducer = (type) => (acc, [name, options]) => {
        const handler =
          typeof options.handler === 'function'
            ? options.handler
            : (payload) => this.$emit(`action-${type}-${name}`, payload)
        const action = { ...options, name, handler }
        return [...acc, action]
      }
      const quickFilter = ([, options]) =>
        options.quick && !options.divider && !options.subheader
      const limitFilter = (max) => (item, index) => index < max
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
  watch: {
    settings: {
      deep: true,
      handler: 'setSettings',
    },
    options: {
      deep: true,
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return
        const [groupBy] = newValue.groupBy
        if (groupBy) {
          const sortIndex = newValue.sortBy.indexOf(groupBy)
          const sortDesc = newValue.sortDesc[sortIndex]
          newValue.groupDesc = [sortDesc || false]
        }
        this.$emit('update:query', newValue)
        this.refresh()
      },
    },
    query: {
      deep: true,
      handler(newValue) {
        this.options = newValue
      },
    },
    search() {
      if (this.serverItemsLength < 0) return
      this.refresh()
    },
    'settings.keepGroupedColumns': {
      handler() {
        this.onGroup(this.options)
      },
    },
    disallowKeepGroupedColumns: {
      handler() {
        this.onGroup(this.options)
      },
    },
  },
  mounted() {
    this.refresh(true)
    this.loadSettings()
  },
  methods: {
    onGroup({ groupBy }) {
      const run = () => {
        const { table } = this.$refs
        if (!table) return
        const { keepGroupedColumns } = this.settings
        table.internalGroupBy =
          keepGroupedColumns && !this.disallowKeepGroupedColumns
            ? []
            : groupBy || []
      }
      run()
      this.$nextTick(run)
    },
    setGroupBy({ value }) {
      const groupBy = this.options.groupBy[0] === value ? [] : [value]
      Object.assign(this.options, {
        groupBy,
        groupDesc: groupBy.length ? [value] : [],
      })
      this.onGroup({ groupBy })
    },
    getHeaderSort({ value }) {
      const { sortBy, sortDesc } = this.options
      const sortIndex = sortBy.indexOf(value)
      const desc = sortIndex < 0 ? false : !!sortDesc[sortIndex]
      return {
        desc,
        sorted: sortIndex > -1,
        index: sortIndex < 0 ? '' : sortIndex + 1,
      }
    },
    getHeaderGroup({ value }) {
      const { groupBy } = this.options
      return { grouped: groupBy.includes(value) }
    },
    getIconClasses(action) {
      if (!this.coloredActionIcons || !action.color) return ''
      return action.color
        .split(' ')
        .map((v) => `${v}--text`)
        .join(' ')
    },
    goToPage() {},
    changeItemsPerPage(itemsPerPage) {
      Object.assign(this.options, { itemsPerPage, page: 1 })
    },
    toggleSelection() {
      const { shownItems: items } = this
      if (this.selected.length === this.pagination.itemsPerPage) {
        this.selected = []
        return
      }
      this.selected = [...items]
    },
    getGroupHeader(props) {
      const { group, groupBy = [] } = props
      const header =
        this.headers.find((item) => item.value === groupBy[0]) || {}
      return {
        text: header.text,
        key: header.text,
        value: group,
      }
    },
    loadSettings() {
      const localSettings = localStorage.getItem('VQueryDataTable.settings')
      if (!localSettings) return
      this.settings = Object.assign(
        {},
        this.settings,
        JSON.parse(localSettings)
      )
    },
    setSettings() {
      localStorage.setItem(
        'VQueryDataTable.settings',
        JSON.stringify(this.settings)
      )
    },
    setLoading(active) {
      const { firstTime } = this.loading
      this.loading = {
        active,
        firstTime: firstTime && active,
      }
    },
    async cachedFetch(payload, skipCache) {
      const { cache } = this
      if (!skipCache) {
        const cached = cache.get(JSON.stringify(payload))
        if (cached) {
          return cached
        }
      }
      return this.apiFetch(payload)
    },
    async apiFetch(payload) {
      const { noCaching, serverItemsLength, collectionLength } = this
      const response = await this.fetch(payload)
      const { resultCount, totalCount = -1 } = response
      const dbHasChange =
        totalCount !== collectionLength ||
        (totalCount === -1 && serverItemsLength !== resultCount)
      if (!noCaching && dbHasChange) {
        this.cache = new Map()
      }
      this.collectionLength = totalCount
      return response
    },
    async refresh(skipCache) {
      const { cache, noCaching, options, search, fetch, items } = this
      const payload = { ...options, search }
      this.setLoading(true)
      if (typeof fetch === 'function') {
        const response = await this.cachedFetch(payload, skipCache || noCaching)
        if (!noCaching) {
          cache.set(JSON.stringify(payload), response)
        }
        this.currentItems = response.data
        this.serverItemsLength = response.totalCount
        this.$emit('update:items', response.items)
      } else {
        this.currentItems = items || []
        this.serverItemsLength = this.currentItems.length
        this.collectionLength = this.currentItems.length
      }
      this.setLoading(false)
      this.onGroup(options)
    },
    clearCache() {
      this.cache = new Map()
      return this.refresh()
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
      &-content__wrap
        padding: 0px !important
.pagination
  width: auto !important
.pageSelect
  min-width: 95px
.invertable
  transition: .5s transform
  transform: rotate(0deg)
  &-inverted
    transform: rotate(-180deg)
.VQueryDataTable
  ::v-deep
    .v-row-group__header
      position: relative
      transform: scale(1)
    &.v-data-table--dense
      .v-data-table__mobile-row
        min-height: 22px
    .customHeader
      position: relative
      ~ *
        visibility: hidden !important
        position: absolute
      &-actions
        position: absolute
        white-space: nowrap
        margin:
          top: -2px
          left: 2px
        > *
          margin-right: 3px
          cursor: pointer
        i
          font-size: 18px
        &-sort
          transition: .3s all
          opacity: 1
        &-sort:not(.sorted), &-group:not(.grouped)
          opacity: .5
        &-group
          opacity: 1
          transition: .3s opacity
    .customHeader:not(:hover)
      .customHeader-actions
        &-sort:not(.sorted), &-group:not(.grouped)
          opacity: 0
          visibility: hidden
          display: none
  &-selectable
    ::v-deep
      td:first-child
        .v-data-table__mobile-row__header
          display: none
  //- &-groupable
    ::v-deep
      .v-data-table-header
        tr
          th
            &:not(.sortable) span:last-child
              display: none
            span:last-child
              vertical-align: inherit
              font-size: 0px
              visible: hidden
              width: 0px
              margin-left: 2px
              &::before
                content: 'dynamic_feed'
                font:
                  family: 'Material Icons'
                  size: 18px
                color: rgba(0, 0, 0, 0.38)
                visible: visible
                opacity: 0
                transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1) opacity
            &:hover span:last-child::before
                opacity: 1
.disable-mouse
  pointer-events: none
.slotGroup
  position: relative
.slotGroup-actions
  position: absolute
  right: 0
  top: 0
  height: calc(100% + 1px)
  padding: 10px 8px
    left: 60px
  margin-top: -1px !important
  transition: .3s all
  z-index: 10
  td:not(.slotGroup-default) ~ &
    --color: white
    background: linear-gradient(to left, var(--color), var(--color), var(--color), transparent)
    tr:not(:hover) &
      opacity: 0
      visibility: hidden
</style>
