<template lang="pug">
v-card(color="transparent" flat v-if="loading.firstTime && loading.active")
  v-skeleton-loader(type="table")
v-card(color="transparent" flat v-else)
  v-navigation-drawer.filterDrawer-parent(
    app
    right
    temporary
    v-model="showFilterDrawer"
  )
    v-row.ma-0.flex-column.filterDrawer
      .title.py-3.px-5 Filtros da Tabela
      v-divider
      slot(name="filter-header")
      v-row.ma-0.filterDrawer-wrapper
        v-row.ma-0.pa-3.filterDrawer-content
          slot(name="filter-prepend")
          template(v-for="row in computedHeaders")
            v-autocomplete.flex-grow-0.my-2(
              filled
              hide-details
              item-text="text"
              item-value="value"
              multiple
              small-chips
              v-if="row.$extra.filterable !== false"
              v-model="filter.values[row.value]"
              :items="sortFilterItems[row.value]"
              :label="row.text"
              @focus="populateFilter(row.value)"
              :loading="filter.loading[row.value]"
            )
              template(v-slot:item="{ item, on, attrs }")
                v-list-item(v-bind="attrs" v-on="on")
                  v-list-item-content
                    v-list-item-title {{ item.text }}
                  v-list-item-action
                    v-list-item-subtitle {{ item.count }} {{ item.count > 1 ? 'itens' : 'item' }}
              template(v-slot:selection="{ item, index }")
                v-chip(v-if="index < 3") {{ index < 2 || filter.values[row.value].length <= 3 ? item.text : `e outros ${filter.values[row.value].length - 2}` }}
          slot(name="filter-append")
          v-row.mx-0.mt-4(justify="end")
            slot(name="filter-actions-prepend")
            v-btn(text @click="clearFilters") Limpar filtros
            slot(name="filter-actions-append")
  v-dialog(max-width="300px" v-model="goToPageDialog")
    v-card
      v-card-title Ir para a página
      v-card-text
        v-select(
          label="Selecione a página"
          v-model="options.page"
          :items="Array(pageCount < 0 || isNaN(pageCount) ? 0 : pageCount).fill(null).map((item, index) => index + 1)"
          @change="goToPageDialog = false"
        )
      v-card-actions
        v-spacer
        v-btn(color="primary" text @click="goToPageDialog = false") Cancelar

  slot(name="header")
    v-card-title.px-0.pt-10.pb-4.pb-md-8
      v-container.pa-0.ma-0
        v-row.pa-0.ma-0
          v-col.pa-0.ma-0(cols=12 sm=3)
            slot(name="header.title")
              slot(name="header.title.prepend")
              .display-1 {{ title }}
              slot(name="header.title.append")
          v-spacer
          v-col.pa-0.ma-0(cols=12 sm=9)
            v-row.pa-0.ma-0(align="center" justify="end")
              v-col.pa-0.ma-0.my-2.my-sm-0(align="end" cols=12 sm=3)
                slot(name="header.filter")
                  v-btn(
                    icon
                    style="background: #e4f6d5"
                    text
                    @click="showFilterDrawer = true"
                  )
                    v-icon(color="#79b651") filter_alt

                v-menu(bottom left offset-x v-if="!hideMenu")
                  template(v-slot:activator="{ on }")
                    v-btn.ml-2(icon style="background: #e4f6d5" v-on="on")
                      v-icon(color="#79b651") more_vert
                  v-list
                    template(v-if="validActions.table.length && !hideActions")
                      template(v-for="(action, index) in validActions.table")
                        v-divider(v-if="action.divider" :key="action.name")
                        v-subheader(
                          v-else-if="action.subheader"
                          :key="action.name"
                        ) {{ action.text }}
                        v-list-item(
                          v-else
                          :key="action.name"
                          @click="action.handler"
                        )
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
                    template(
                      v-if="!disallowDense || !disallowGroups || pageCount > 1"
                    )
                      v-divider
                      v-subheader Opções de visualização
                      v-list-item(
                        v-if="pageCount > 1"
                        @click="goToPageDialog = true"
                      )
                        v-list-item-avatar.mr-0
                          v-icon find_in_page
                        v-list-item-title Ir para a página
                      v-list-item(
                        v-if="!disallowDense"
                        @click.stop="settings.dense = !settings.dense"
                      )
                        v-switch.my-0(
                          dense
                          hide-details
                          read-only
                          :input-value="settings.dense"
                        )
                        v-list-item-title Listagem densa
                      v-list-item.hidden-sm-and-down(
                        v-if="!disallowGroups"
                        @click.stop="settings.showGroupBy = !settings.showGroupBy"
                      )
                        v-switch.my-0(
                          dense
                          hide-details
                          read-only
                          :input-value="settings.showGroupBy"
                        )
                        v-list-item-title Permitir agrupar
                      v-list-item.hidden-sm-and-down(
                        v-if="!disallowGroups && !disallowKeepGroupedColumns"
                        @click.stop="settings.keepGroupedColumns = !settings.keepGroupedColumns"
                      )
                        v-switch.my-0(
                          dense
                          hide-details
                          read-only
                          :input-value="settings.keepGroupedColumns"
                        )
                        v-list-item-title Manter colunas agrupadas

              v-col.pa-0.ma-0.px-sm-2(align="end" cols=12 md=4 sm=4)
                v-text-field(
                  append-icon="search"
                  background-color="#e4f6d5"
                  clearable
                  color="#8ac165"
                  dense
                  flat
                  hide-details
                  label="Pesquisar"
                  outlined
                  rounded
                  single-line
                  solo
                  v-model="search"
                )

              v-col.pa-0.ma-0.mt-2.mt-sm-0(
                cols=12
                md=3
                sm=4
                v-if="validActions.tableQuick.length && !hideActions"
              )
                template
                  v-btn(
                    style="width: 100%"
                    v-bind="{ color: action.color || 'primary', ...action.options }"
                    v-for="action in validActions.tableQuick"
                    :key="action.name"
                    @click="action.handler"
                  )
                    v-icon {{ action.icon }}
                    span {{ action.text }}
  slot(name="body.top")
  v-expansion-panels.bulk-actions(:value="selected.length ? 0 : -1")
    v-expansion-panel
      v-expansion-panel-content
        slot(name="bulkActions" :items="shownItems" :selected="selected")
          v-card-text.pt-0
            .caption(v-if="selected.length <= 1") Ações para o item selecionado:
            .caption(v-else) Ações em massa para os {{ selected.length }} itens selecionados:
            v-row
              slot(name="bulkActions.prepend")
              v-btn.ml-3(
                small
                v-bind="{ color: action.color || 'primary', ...action.options }"
                v-for="action in validActions.bulk"
                :key="action.name"
                @click="action.handler(selected)"
              )
                v-icon(small v-if="action.icon") {{ action.icon }}
                span {{ action.text }}
              slot(name="bulkActions.append")

  //-template(v-if="loading.active")
    v-skeleton-loader(type="table-thead")
  v-data-table.VQueryDataTable(
    ref="table"
    v-bind="dataTableAttrs"
    v-model="selected"
    :options="computedOptions"
    @update:options="updateOptions"
  )
    template(v-for="header in dataTableAttrs.headers" v-slot:[header.slot]="")
      .customHeader
        span.customHeader-text {{ header.text }}
        span.customHeader-actions
          span.customHeader-actions-sort(
            v-if="header.sortable !== false"
            :class="{ sorted: getHeaderSort(header).sorted }"
          )
            v-badge(
              color="transparent"
              overlap
              :value="getHeaderSort(header).sorted"
            )
              template(v-slot:badge="")
                span.primary--text.darken-1--text {{ getHeaderSort(header).index }}
              v-tooltip(top)
                span Ordenar
                template(v-slot:activator="{ on, attrs }")
                  v-icon.invertable(
                    v-bind="attrs"
                    v-on="on"
                    :class="{ 'invertable-inverted': getHeaderSort(header).desc }"
                  ) arrow_upward
          span.customHeader-actions-group(
            v-if="header.groupable !== false && !disallowGroups && settings.showGroupBy"
            :class="{ grouped: getHeaderGroup(header).grouped }"
            @click.prevent.stop="setGroupBy(header)"
          )
            v-tooltip(top)
              span Agrupar
              template(v-slot:activator="{ on, attrs }")
                v-icon.customHeader-actions-sortIcon(v-bind="attrs" v-on="on") folder_open
    template(v-if="loading.active" v-slot:body="")
      tbody.disable-mouse
        tr
          td(colspan="100%")
            v-skeleton-loader(type="table-tbody")
    template(
      v-for="column in templatedColumns"
      v-slot:[`item.${column.value}`]="props"
    )
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
      v-row.slotGroup-actions.ma-0.text-no-wrap(
        align="center"
        v-if="!hideRowGroupExpansion || !hideRowGroupClose"
      )
        v-spacer
        span.customHeader-actions-sort(
          v-if="groupHeader.sortable !== false"
          :class="{ sorted: groupHeaderSort.sorted }"
        )
          v-tooltip(top)
            span Ordenar grupo
            template(v-slot:activator="{ on, attrs }")
              v-btn(
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="sortGroupHeader"
              )
                v-badge(
                  color="transparent"
                  overlap
                  :value="groupHeaderSort.sorted"
                )
                  template(v-slot:badge="")
                    span.primary--text.darken-1--text {{ groupHeaderSort.index }}
                  v-icon.invertable(
                    size="16"
                    :class="{ 'invertable-inverted': groupHeaderSort.desc }"
                  ) arrow_upward
        v-tooltip(top v-if="!hideRowGroupClose")
          span Desagrupar
          template(v-slot:activator="{ on, attrs }")
            v-btn(icon small v-bind="attrs" v-on="on" @click="props.remove")
              v-icon(small) close
        v-tooltip(top v-if="!hideRowGroupExpansion")
          span {{ props.isOpen ? 'Recolher' : 'Expandir' }}
          template(v-slot:activator="{ on, attrs }")
            v-btn(icon small v-bind="attrs" v-on="on" @click="props.toggle")
              v-icon.invertable(
                :class="{ 'invertable-inverted': props.isOpen }"
              ) expand_more
    template(v-if="!hideActions" v-slot:item._actions="payload")
      template(v-if="$vuetify.breakpoint.smAndUp")
        .text-no-wrap
          template(v-for="(action, index) in validActions.singleQuick")
            v-tooltip(
              top
              v-if="actionCondition(payload)([index, action])"
              :key="action.name"
              :disabled="!action.text"
            )
              template(v-slot:activator="{ on }")
                v-icon(
                  small
                  v-on="on"
                  :class="[index ? 'ml-1' : '', getIconClasses(action)]"
                  @click="action.handler(payload)"
                ) {{ action.icon }}
              span {{ action.text }}
          v-menu(v-if="wrapSingleActions")
            template(v-slot:activator="{ on, attrs }")
              v-btn(icon small v-bind="attrs" v-on="on")
                v-icon more_horiz
            v-list(dense)
              template(v-if="validActions.single.length")
                template(v-for="(action, index) in validActions.single")
                  v-list-item(
                    dense
                    v-if="actionCondition(payload)([index, action])"
                    :key="action.name"
                    @click="action.handler(payload)"
                  )
                    v-list-item-avatar.mr-0
                      v-icon(:class="getIconClasses(action)") {{ action.icon }}
                    v-list-item-title(:class="getIconClasses(action)") {{ action.text }}
      template(v-else)
        template(v-for="action in validActions.single")
          v-btn.ml-3(
            small
            text
            v-bind="{ color: action.color || 'primary', ...action.options }"
            v-if="actionCondition(payload)([index, action])"
            :key="action.name"
            @click="action.handler(payload)"
          )
            v-icon(small v-if="action.icon") {{ action.icon }}
            span {{ action.text }}
    template(v-for="slot in slots" v-slot:[slot]="props")
      slot(v-bind="props" :name="`table.${slot}`")

  v-row.align-center.justify-space-between
    v-col.shrink.text-no-wrap
      template(v-if="!loading.active && serverItemsLength")
        .caption Exibindo de {{ statusBar.startIndex }} até {{ statusBar.endIndex }} de {{ serverItemsLength }} {{ serverItemsLength === 1 ? 'registro' : 'registros' }}
          template(v-if="serverItemsLength < collectionLength") de um total de {{ collectionLength }} {{ collectionLength === 1 ? 'filtrado' : 'filtrados' }}
    v-col
      v-pagination.pagination(
        color="secondary"
        total-visible="7"
        v-model="options.page"
        :length="pageCount"
      )
    v-col.shrink
      v-select.pageSelect(
        label="Itens por página:"
        :items="itemsPerPages"
        :value="options.itemsPerPage"
        @input="changeItemsPerPage"
      )
  slot(name="body.bottom")
</template>

<script lang="ts">
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
    wrapSingleActions: { type: Boolean, default: false },
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
    itemsPerPages: { type: Array, default: () => [5, 10, 25, 50, 100] },
  },
  data: () => ({
    showFilterDrawer: false,
    cache: new Map(),
    goToPageDialog: false,
    goToPageInput: 1,
    serverItemsLength: -1,
    colletionLength: -1,
    filter: {
      items: {},
      values: {},
      search: {},
      loading: {},
    },
    options: {
      page: 1,
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      mustSort: false,
      multiSort: true,
      pageCount: 1,
      itemsPerPage: 10,
    },
    settings: {
      dense: false,
      showGroupBy: true,
      keepGroupedColumns: true,
    },
    selected: [],
    currentItems: [],

    search: '',
    loading: {
      firstTime: true,
      active: true,
    },
  }),
  computed: {
    sortFilterItems() {
      const { transformableHeaders } = this
      const { items, values } = this.filter
      return Object.entries(items)
        .map(([field, itemValues]) => [
          field,
          itemValues
            .map((item) => {
              const value = item.value
              const transformItem = transformableHeaders.find(
                ([itemKey]) => itemKey === field
              )
              if (!transformItem) return { ...item, text: item.value }
              const transform = transformItem[1]
              const getNewValue = () => {
                if (typeof transform === 'function') return transform(value)
                if (typeof transform === 'object')
                  return transform[value] || value
                return value
              }
              return { ...item, text: getNewValue() }
            })
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
      const { transformableHeaders } = this
      const shown = this.items || this.currentItems
      return shown.map((item) =>
        transformableHeaders.reduce((acc, [key, transform]) => {
          const oldValue = acc[key]
          const getNewValue = () => {
            if (typeof transform === 'function') return transform(oldValue)
            if (typeof transform === 'object')
              return transform[oldValue] || oldValue
            return oldValue
          }
          return { ...acc, [key]: getNewValue() }
        }, item)
      )
    },
    transformableHeaders() {
      return this.computedHeaders
        .filter((item) => item.$extra.transformItem)
        .map((item) => [item.value, item.$extra.transformItem])
    },
    slots() {
      return Object.keys(this.$scopedSlots)
        .filter((key) => key.startsWith('table.'))
        .map((key) => key.substring(6))
    },
    dataTableAttrs() {
      const {
        shownHeaders,
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
        headers: shownHeaders,
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
    shownHeaders() {
      return this.computedHeaders.filter((item) => item.$extra.visible)
    },
    computedHeaders() {
      const { headers, hideActions } = this
      const common = {
        align: 'center',
      }
      const defaults = {
        _actions: {
          filterable: false,
          sortable: false,
          groupable: false,
          $extra: {
            visible: true,
            filterable: false,
            transformItem: null,
          },
        },
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

          const newHeader = Object.assign({}, common, headerDefaults, header, {
            slot: `header.${header.value}`,
            $custom: { ...templateOptions, ...$custom },
          })

          const { $extra = {} } = newHeader

          const {
            visible = true,
            filterable = true,
            transformItem = null,
          } = $extra

          return {
            ...newHeader,
            $extra: { visible, filterable, transformItem },
          }
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
      const { wrapSingleActions, actions = {} } = this
      const checkAction = this.actionCondition()
      const single = Object.entries(actions.single || {})
      const table = Object.entries(actions.table || {}).filter(checkAction)
      const bulk = Object.entries(actions.bulk || {}).filter(checkAction)
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
        singleQuick: single
          .filter((item) => item[1].quick || !wrapSingleActions)
          .reduce(actionReducer('single'), []),
        table: table.reduce(actionReducer('table'), []),
        tableQuick: table
          .filter(quickFilter)
          .filter(limitFilter(2))
          .reduce(actionReducer('table'), []),
        bulk: bulk.reduce(actionReducer('bulk'), []),
      }
    },
    groupHeader() {
      const [value] = this.options.groupBy
      return this.headers.find((item) => item.value === value)
    },
    groupHeaderSort() {
      const [value] = this.options.groupBy
      const { sortBy, sortDesc } = this.options
      const sortIndex = sortBy.indexOf(value)
      const desc = sortIndex < 0 ? false : !!sortDesc[sortIndex]
      return {
        desc,
        sorted: sortIndex > -1,
        index: sortIndex < 0 ? '' : sortIndex + 1,
      }
    },
  },
  watch: {
    'filter.values': {
      deep: true,
      handler() {
        const { values } = this.filter
        this.options = {
          ...this.options,
          filter: Object.entries(values)
            .reduce(
              (acc, [field, items]) => [
                ...acc,
                ...items.map((item) => [field, item], []),
              ],
              []
            )
            .filter((v) => v[1] !== '')
            .map(([field, value]) => `${field}(${value})`)
            .join(','),
        }
      },
    },
    settings: {
      deep: true,
      handler: 'setSettings',
    },
    computedOptions: {
      deep: true,
      handler(newValue, oldValue) {
        this.$emit('update:query', newValue)
        this.refresh()
        if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return
        const [groupBy] = newValue.groupBy
        if (groupBy) {
          const sortIndex = newValue.sortBy.indexOf(groupBy)
          const sortDesc = newValue.sortDesc[sortIndex]
          this.options.groupDesc = [sortDesc || false]
        }
      },
    },
    query: {
      deep: true,
      handler(newValue) {
        if (JSON.stringify(newValue) === JSON.stringify(this.options)) return
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
    actionCondition(item) {
      // eslint-disable-next-line no-unused-vars
      return ([index, props]) => {
        if (!('condition' in props)) return true
        const { condition } = props
        if (typeof condition === 'function') return condition(item)
        return !!condition
      }
    },
    async populateFilter(field) {
      const { filter, fetch, items } = this
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
    updateOptions(newValue) {
      // eslint-disable-next-line no-unused-vars
      const { page, itemsPerPage, pageCount, ...options } = newValue
      Object.assign(this.options, options)
    },
    sortGroupHeader() {
      const { sortBy, sortDesc, groupBy } = this.options
      const [value] = groupBy
      const sortIndex = sortBy.indexOf(value)
      // Add if doesn't exists
      if (sortIndex < 0) {
        Object.assign(this.options, {
          sortBy: [...sortBy, value],
          sortDesc: [...sortDesc, false],
        })
        return
      }
      // Remove if is sorted descending
      if (sortDesc[sortIndex]) {
        const removeFilter = (_, index) => index !== sortIndex
        Object.assign(this.options, {
          sortBy: sortBy.filter(removeFilter),
          sortDesc: sortDesc.filter(removeFilter),
        })
        return
      }
      // Descend if is sorted ascending
      Object.assign(this.options, {
        sortDesc: sortDesc.map((desc, index) =>
          index !== sortIndex ? desc : true
        ),
      })
    },
    clearFilters() {
      const { filter } = this
      filter.values = {}
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
    .v-data-table-header
      background: #ededed
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
  .VQueryDataTable.v-data-table--dense &
    padding-top: 3px
    padding-bottom: 3px
  td:not(.slotGroup-default) ~ &
    --color: white
    background: linear-gradient(to left, var(--color), var(--color), var(--color), transparent)
    tr:not(:hover) &
      opacity: 0
      visibility: hidden
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
</style>
