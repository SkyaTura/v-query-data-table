<template lang="pug">
v-avatar.avatar(v-bind="attrs")
  v-img(:src="image")
</template>

<script>
export default {
  name: 'CellAvatar',
  props: {
    options: { type: Object, required: true },
    props: { type: Object, required: true },
    header: { type: Object, required: true },
  },
  computed: {
    image() {
      const { header, props } = this
      const { item, value } = props
      const { format } = header.$custom
      if (typeof format === 'function') return format(value, item)
      return value
    },
    attrs() {
      const { header } = this
      // eslint-disable-next-line no-unused-vars
      const { template, format, ...options } = header.$custom
      return {
        size: this.options.dense ? 32 : 48,
        ...options,
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.avatar
  transition: all .3s
</style>
