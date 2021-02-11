<template lang="pug">
v-expansion-panels.bulk-actions(:value="options.selected.length ? 0 : -1")
  v-expansion-panel
    v-expansion-panel-content
      slot(name="bulkActions" v-bind="options")
        v-card-text.pt-0.px-0
          .caption(v-if="options.selected.length <= 1") Ações para o item selecionado:
          .caption(v-else) Ações em massa para os {{ options.selected.length }} itens selecionados:
          v-row.my-0
            slot(name="bulkActions.prepend" v-bind="options")
            v-btn.ml-3(
              small
              v-bind="{ color: action.color || 'primary', ...action.options }"
              v-for="(action, value) in options.bulkActions"
              :key="value"
              @click="$emit(`action-bulk-${value}`, options.selected)"
            )
              v-icon(small v-if="action.icon") {{ action.icon }}
              span {{ action.text }}
            slot(name="bulkActions.append" v-bind="options")
</template>

<script>
export default {
  name: 'BulkActions',
  props: {
    options: { type: Object, required: true },
  },
}
</script>
