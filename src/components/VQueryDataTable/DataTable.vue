<template lang="pug">
v-data-table.VQueryDataTable(
  :headers="options.headers",
  show-select
  hide-default-footer
  :disabled="options.loading.active"
  :value="value"
  v-bind="options.datatable"
  v-on="$listeners"
  @update:options="$emit('update:query', $event)"
)
</template>

<script>
export default {
  name: 'DataTable',
  inheritAttrs: false,
  props: {
    value: { type: Array, required: true },
    options: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
}
</script>

<style lang="sass" scoped>
.VQueryDataTable
  ::v-deep
    .v-data-table-header
      background: #ededed
      th
        border-bottom: 0px !important
        span
          color: #888
  &.theme--dark
    ::v-deep
      .v-data-table-header
        background: #616161
        th
          span
            color: #fafafa
</style>
