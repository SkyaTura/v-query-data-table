<template lang="pug">
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
      v-if="header.groupable !== false && !options.disallowGroups"
      :class="{ grouped: getHeaderGroup(header).grouped }"
      @click.prevent.stop="setGroupBy(header)"
    )
      v-tooltip(top)
        span Agrupar
        template(v-slot:activator="{ on, attrs }")
          v-icon.customHeader-actions-sortIcon(v-bind="attrs" v-on="on") folder_open
</template>

<script>
export default {
  name: 'RowHeader',
  props: {
    options: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {},
  methods: {
    getHeaderGroup({ value }) {
      const { groupBy } = this.options.query
      return { grouped: groupBy.includes(value) }
    },
    getHeaderSort({ value }) {
      const { sortBy, sortDesc } = this.options.query
      const sortIndex = sortBy.indexOf(value)
      const desc = sortIndex < 0 ? false : !!sortDesc[sortIndex]
      return {
        desc,
        sorted: sortIndex > -1,
        index: sortIndex < 0 ? '' : sortIndex + 1,
      }
    },
    setGroupBy({ value }) {
      const groupBy = this.options.query.groupBy[0] === value ? [] : [value]
      Object.assign(this.options.query, {
        groupBy,
        groupDesc: groupBy.length ? [value] : [],
      })
      this.onGroup({ groupBy })
    },
    onGroup({ groupBy }) {
      const run = (u) => {
        const { table } = this.$refs
        if (!table) return
        const { keepGroupedColumns, disallowKeepGroupedColumns } = this.options
        table.internalGroupBy =
          keepGroupedColumns && !disallowKeepGroupedColumns ? [] : groupBy || []
      }
      run()
      this.$nextTick(run)
    },
  },
}
</script>

<style lang="sass" scoped>
.invertable
  transition: .5s transform
  transform: rotate(0deg)
  &-inverted
    transform: rotate(-180deg)
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
</style>
