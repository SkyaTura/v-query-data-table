<template lang="pug">
v-chip(v-bind="options") {{ text }}
</template>

<script>
export default {
  name: 'ColumnTemplateChip',
  props: {
    column: { type: Object, required: true },
    props: { type: Object, required: true },
  },
  computed: {
    color() {
      const { column, props } = this
      const { color } = column.$custom
      const { item } = props
      const text = item[column.value]
      if (typeof color === 'function') return color(text, item)
      if (typeof color === 'string') return color
      return undefined
    },
    text() {
      const { column, props } = this
      const { item } = props
      const text = item[column.value]
      const { format } = column.$custom
      if (typeof format === 'function') return format(text, item)
      return text
    },
    options() {
      const { color, column } = this
      // eslint-disable-next-line no-unused-vars
      const { template, format, ...options } = column.$custom
      return { ...options, color }
    },
  },
}
</script>
