<template lang="pug">
div(v-if="!options.hideHeader")
  TableMenu(v-on="$listeners" :options="options")
  TableDrawer(v-on="$listeners" :options="options")

  v-toolbar(color="transparent" flat)
    v-card-title.align-center.px-0
      slot(name="header.title")
        slot(name="header.title.prepend")
        .text-h4.font-weight-bold {{ options.title }}
        slot(name="header.title.append")
    v-spacer
    v-btn.toolbar-item(
      icon
      v-if="!options.hideFilter && options.fetch"
      :color="options.toolbarFieldsColor"
      @click="options.filter.drawer = true"
      :disabled="options.loading.active"
    )
      v-icon {{ icons.mdiFilter }}
    v-btn#VQueryDataTableToolbarMenu.toolbar-item(
      icon
      v-if="!options.hideMenu"
      :color="options.toolbarFieldsColor"
      :disabled="options.loading.active"
    )
      v-icon {{ icons.mdiDotsHorizontal }}
    v-text-field.shrink.toolbar-item(
      dense
      filled
      flat
      hide-details
      placeholder="Pesquisar..."
      rounded
      solo
      v-if="!options.hideSearch"
      v-model="options.query.search"
      :append-icon="icons.mdiMagnify"
      :color="options.toolbarFieldsColor"
    )
    .shrink.ml-3(
      v-if="!options.hideTableActions && !options.hideTableQuickActions && !options.hideAllActions"
    )
      template(v-for="(action, value) in options.tableActions")
        v-btn(
          v-if="action.quick && condition(action)"
          :color="action.color || 'primary'"
          :key="value"
          @click="$emit(`action-table-${value}`)"
          :disabled="options.loading.active"
        )
          v-icon.mr-2(v-if="action.icon") {{ action.icon }}
          | {{ action.text }}
</template>

<script>
import { mdiFilter, mdiDotsHorizontal, mdiMagnify } from '@mdi/js'
import TableDrawer from './TableDrawer.vue'
import TableMenu from './TableMenu.vue'

export default {
  name: 'TableHeader',
  components: { TableMenu, TableDrawer },
  inheritAttrs: false,
  props: {
    options: { type: Object, required: true },
  },
  data: () => ({
    icons: {
      mdiFilter,
      mdiDotsHorizontal,
      mdiMagnify,
    },
  }),
  methods: {
    condition(action) {
      if (action.condition) return action.condition()
      return true
    },
  },
}
</script>

<style lang="sass" scoped>
.toolbar-item
  margin: 0 4px
  &::v-deep
    .v-input__slot
      background: transparent !important
  &.v-btn
    height: 40px !important
    width: 40px !important
  &.v-btn:after, &.v-input:before
    content: ''
    width: 100%
    height: 100%
    background: var(--x-color)
    position: absolute
    left: 0
    top: 0
    border-radius: 100000px
    z-index: -5
    opacity: .08
</style>
