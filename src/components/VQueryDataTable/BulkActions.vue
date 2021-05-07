<template lang="pug">
v-expansion-panels.bulk-actions(
  :value="options.values.selected.length ? 0 : -1"
)
  v-expansion-panel
    v-expansion-panel-content
      slot(name="bulkActions" v-bind="options")
        v-card-text.pt-0.px-0
          .caption(v-if="options.values.selected.length <= 1") Ações para o item selecionado:
          .caption(v-else) Ações em massa para os {{ options.values.selected.length }} itens selecionados:
          v-row.my-0
            slot(name="bulkActions.prepend" v-bind="options")
            template(
              v-for="(action, value) in options.bulkActions"
              v-if="condition(action)"
            )
              v-btn.ml-3(
                small
                v-bind="{ color: action.color || 'primary', ...action.options }"
                :key="value"
                @click="emit(value, options.values.selected)"
              )
                v-icon(small v-if="action.icon") {{ action.icon }}
                span {{ action.text }}
            slot(name="bulkActions.append" v-bind="options")
</template>

<script>
import conditionMixin from '../../conditionMixin'

export default {
  name: 'BulkActions',
  mixins: [conditionMixin],
  props: {
    options: { type: Object, required: true },
  },
  methods: {
    emit(value, selected) {
      this.$parent.$parent.$emit(`action-bulk-${value}`, selected)
    },
  },
}
</script>
