<template>
  <v-text-field
    v-model="searchString"
    single-line
    hide-details
    append-icon="search"
    label="Buscar"
  >
    <slot/>
  </v-text-field>
</template>

<script>
import debounce from 'debounce'

export default {
  name: 'SearchField',
  props: {
    value: { type: String, required: true },
    debounce: { type: Number, default: 500 },
  },
  data: () => ({
    searchString: '',
  }),
  watch: {
    value: 'syncValue',
    searchString() {
      this.debouncedEmit()
    },
  },
  created() {
    this.syncValue()
    this.debouncedEmit = debounce(this.emitValue, this.debounce)
  },
  methods: {
    emitValue() {
      const { searchString, value } = this
      if (searchString === value) return
      this.$emit('input', searchString)
    },
    syncValue() {
      const { searchString, value } = this
      if (searchString === value) return
      this.searchString = value
    },
  },
}
</script>
