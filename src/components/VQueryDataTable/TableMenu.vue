<template lang="pug">
v-menu(
  offset-y,
  activator="#VQueryDataTableToolbarMenu",
  :dense="options.dense"
)
  v-list
    template(
      v-for="action in options.tableActions",
      v-if="!options.hideTableActions && !options.hideAllActions"
    )
      v-list-item(
        :key="action.value",
        :color="action.color",
        @click="$emit(`action-table-${action.value}`)"
      )
        v-list-item-icon
          v-icon {{ action.icon }}
        v-list-item-content
          v-list-item-title {{ action.text }}
    v-divider
    v-list-item(@click="options.cleanRefresh()")
      v-list-item-icon
        v-icon refresh
      v-list-item-content
        v-list-item-title Atualizar
    v-list-item(v-if="!options.disallowDense", @click="options.toggleDense()")
      v-list-item-icon
        v-icon {{ options.datatable.dense ? 'unfold_more' : 'unfold_less' }}
      v-list-item-content
        v-list-item-title Listagem {{ options.datatable.dense ? 'normal' : 'densa' }}
    v-menu(offset-x, open-on-hover)
      template(#activator="{ attrs, on }")
        v-list-item(v-bind="attrs", v-on="on")
          v-list-item-icon
            v-icon toc
          v-list-item-content
            v-list-item-title Itens por página...
      v-list
        v-list-item-group(v-model="options.query.itemsPerPage")
          template(v-for="itemsPerPage in [5, 10, 25, 50, 100]")
            v-list-item(
              :key="itemsPerPage",
              :value="itemsPerPage",
              @click="setItemsPerPage(itemsPerPage)"
            )
              v-list-item-content
                v-list-item-title {{ itemsPerPage }}
</template>

<script>
export default {
  name: 'TableMenu',
  inheritAttrs: false,
  props: {
    options: { type: Object, required: true },
  },
  methods: {
    setItemsPerPage(itemsPerPage) {
      localStorage?.setItem('v-query-data-table:itemsPerPage', itemsPerPage)
    },
  },
}
</script>
