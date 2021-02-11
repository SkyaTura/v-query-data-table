<template lang="pug">
v-chip(v-bind="attrs") {{ text }}
</template>

<script>
export default {
  name: 'CellChip',
  props: {
    options: { type: Object, required: true },
    props: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    color() {
      const { header, props } = this
      const { color } = header.$custom
      const { item } = props
      const text = props.value
      if (typeof color === 'function') return color(text, item)
      if (typeof color === 'string') return color
      return undefined
    },
    text() {
      const { header, props } = this
      const { item, value } = props
      const { format } = header.$custom
      if (typeof format === 'function') return format(value, item)
      return value
    },
    attrs() {
      const { color, header } = this
      // eslint-disable-next-line no-unused-vars
      const { template, format, ...options } = header.$custom
      return {
        small: true,
        ...options,
        color,
      }
    },
  },
}
</script>
