<template lang="pug">
v-tooltip(left v-if="fab")
  span#tooltipText {{ fab[1].text }}
  template(#activator="{ attrs, on }")
    v-fab-transition
      v-btn(
        bottom
        fab
        fixed
        right
        v-bind="attrs"
        v-if="!options.hideTableFAB && !options.hideAllActions && condition(fab[1])"
        v-on="on"
        :color="fab ? fab[1].color : ''"
        @click="$emit(`action-table-${fab[0]}`)"
        :disabled="options.loading.active"
      )
        v-icon {{ fab[1].icon }}
</template>

<script>
import conditionMixin from '../../conditionMixin'

export default {
  name: 'TableFab',
  mixins: [conditionMixin],
  props: {
    options: { type: Object, required: true },
  },
  computed: {
    fab() {
      return Object.entries(this.options.tableActions).find(
        ([value, item]) => item.fab
      )
    },
  },
}
</script>
