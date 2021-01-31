<template lang="pug">
div(v-if="!options.hideHeader")
  TableMenu(:options="options" v-on="$listeners")
  TableDrawer(ref="tableDrawer" :options="options" v-on="$listeners")

  v-toolbar(flat color="transparent")
    v-card-title.align-center.px-0
      slot(name="header.title")
        slot(name="header.title.prepend")
        .text-h4.font-weight-bold {{ options.title }}
        slot(name="header.title.append")
    v-spacer
    v-btn.toolbar-item(
      icon,
      @click="$refs.tableDrawer.open()",
      v-if="!options.hideFilter"
      :disabled="options.loading.active"
      :color="options.toolbarFieldsColor"
    )
      v-icon {{ icons.mdiFilter }}
    v-btn#VQueryDataTableToolbarMenu.toolbar-item(
      icon,
      v-if="!options.hideMenu"
      :color="options.toolbarFieldsColor"
      :disabled="options.loading.active"
    )
      v-icon {{ icons.mdiDotsHorizontal }}
    v-text-field.shrink.toolbar-item(
      solo,
      flat,
      filled,
      v-if="!options.hideSearch"
      placeholder="Pesquisar...",
      rounded,
      :color="options.toolbarFieldsColor",
      :disabled="options.loading.active"
      dense,
      hide-details,
      :append-icon="icons.mdiMagnify"
    )
    .shrink.ml-3(v-if="!options.hideTableQuickActions && !options.hideAllActions")
      template(v-for="(action, value) in options.tableActions")
        v-btn(:key="value" :color="action.color" v-if="action.quick" @click="$emit(`action-table-${value}`)" :disabled="options.loading.active")
          v-icon.mr-2(v-if="action.icon") {{ action.icon }}
          | {{ action.text }}
</template>

<script>
import { mdiFilter, mdiDotsHorizontal, mdiMagnify } from '@mdi/js'
import TableDrawer from './TableDrawer'
import TableMenu from './TableMenu'

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
