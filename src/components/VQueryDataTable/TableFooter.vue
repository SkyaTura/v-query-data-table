<template lang="pug">
v-row.mt-5(v-if="!options.disablePagination" justify="center")
  v-col
    v-pagination.pagination(v-model="options.query.page" :length="options.pagination.pagesCount" flat :disabled="options.loading.active")
    .text-center.text-caption.grey--text.text--darken-1 Exibindo de {{ showingFrom }} até {{ showingUntil }} de {{ options.pagination.totalCount }} registros
</template>

<script>
export default {
  name: 'TableFooter',
  props: {
    options: { type: Object, required: true },
  },
  computed: {
    showingFrom() {
      const {
        query: { page, itemsPerPage },
      } = this.options

      return itemsPerPage * (page - 1) + 1
    },
    showingUntil() {
      const {
        pagination: { resultCount },
      } = this.options

      return this.showingFrom + resultCount - 1
    },
  },
}
</script>

<style lang="sass" scoped>
.pagination
  &::v-deep
    *
      user-select: none
    button
      box-shadow: none
      border: 1px solid #acacac
</style>
