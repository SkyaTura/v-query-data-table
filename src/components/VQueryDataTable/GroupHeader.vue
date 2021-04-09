<template lang="pug">
td.slotGroup-default(colspan="100%")
  v-row.ma-0.text-no-wrap(align="center")
    slot(name="group.header.content" v-bind="props")
      span(v-if="getGroupHeader(props).value !== undefined")
        span.font-weight-bold {{ getGroupHeader(props).text }}:
        span &nbsp;{{ getGroupHeader(props).value }}
    template(
      v-if="!options.hideRowGroupExpansion || !options.hideRowGroupClose"
    )
      v-spacer
      span.customHeader-actions-sort(
        v-if="groupHeader.sortable !== false"
        :class="{ sorted: groupHeaderSort.sorted }"
      )
        v-tooltip(top)
          span Ordenar grupo
          template(v-slot:activator="{ on, attrs }")
            v-btn(icon small v-bind="attrs" v-on="on" @click="sortGroupHeader")
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
      v-tooltip(top v-if="!options.hideRowGroupClose")
        span Desagrupar
        template(v-slot:activator="{ on, attrs }")
          v-btn(icon small v-bind="attrs" v-on="on" @click="props.remove")
            v-icon(small) close
      v-tooltip(top v-if="!options.hideRowGroupExpansion")
        span {{ props.isOpen ? 'Recolher' : 'Expandir' }}
        template(v-slot:activator="{ on, attrs }")
          v-btn(icon small v-bind="attrs" v-on="on" @click="props.toggle")
            v-icon.invertable(:class="{ 'invertable-inverted': props.isOpen }") expand_more
</template>

<script>
export default {
  name: 'GroupHeader',
  props: {
    options: { type: Object, required: true },
    props: { type: Object, required: true },
  },
  computed: {
    groupHeader() {
      const [value] = this.options.query.groupBy
      return this.options.headers.find((item) => item.value === value)
    },
    groupHeaderSort() {
      const [value] = this.options.query.groupBy
      const { sortBy, sortDesc } = this.options.query
      const sortIndex = sortBy.indexOf(value)
      const desc = sortIndex < 0 ? false : !!sortDesc[sortIndex]
      return {
        desc,
        sorted: sortIndex > -1,
        index: sortIndex < 0 ? '' : sortIndex + 1,
      }
    },
  },
  methods: {
    getGroupHeader(props) {
      const { group, groupBy = [] } = props
      const header =
        this.options.headers.find((item) => item.value === groupBy[0]) || {}
      return {
        text: header.text,
        key: header.text,
        value: group,
      }
    },
    sortGroupHeader() {
      const { sortBy, sortDesc, groupBy } = this.options.query
      const [value] = groupBy
      const sortIndex = sortBy.indexOf(value)
      // Add if doesn't exists
      if (sortIndex < 0) {
        Object.assign(this.options.query, {
          sortBy: [...sortBy, value],
          sortDesc: [...sortDesc, false],
        })
        return
      }
      // Remove if is sorted descending
      if (sortDesc[sortIndex]) {
        const removeFilter = (_, index) => index !== sortIndex
        Object.assign(this.options.query, {
          sortBy: sortBy.filter(removeFilter),
          sortDesc: sortDesc.filter(removeFilter),
        })
        return
      }
      // Descend if is sorted ascending
      Object.assign(this.options.query, {
        sortDesc: sortDesc.map((desc, index) =>
          index !== sortIndex ? desc : true
        ),
      })
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
</style>
