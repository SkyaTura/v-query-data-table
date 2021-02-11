<template lang="pug">
v-data-table.VQueryDataTable(
  ref="table"
  v-bind="options.datatable"
  v-on="$listeners"
  @update:options="$emit('update:query', $event)"
)
  template(#[header.headerSlot]="" v-for="header in options.headers")
    RowHeader(:header="header" :options="options")

  template(#group.header="props")
    GroupHeader(:options="options" :props="props")

  template(#[header.itemSlot]="props" v-for="header in options.headers")
    CellValue(:header="header" :options="options" :props="props")

  template(#no-data)
    .text-center.py-10
      template(v-if="options.query.search")
        v-icon.primary--text(size="72") search_off
        .primary--text.text-h5.font-weight-bold {{ options.query.search }}
        div Não foram encontrados resultados para o termo pesquisado.
      template(v-else)
        v-icon.primary--text(size="72") view_list
        .primary--text.text-h5.font-weight-bold Não há itens cadastrados
        div Para exibir informações aqui, você deve cadastrar um novo item.
</template>

<script>
import RowHeader from './RowHeader.vue'
import GroupHeader from './GroupHeader.vue'
import CellValue from './CellValue.vue'

export default {
  name: 'DataTable',
  components: { RowHeader, GroupHeader, CellValue },
  inheritAttrs: false,
  props: {
    options: { type: Object, required: true },
  },
}
</script>

<style lang="sass" scoped>
.VQueryDataTable
  ::v-deep
    .customHeader + i
      display: none
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
