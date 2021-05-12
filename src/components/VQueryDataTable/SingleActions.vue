<template lang="pug">
.singleActions
  template(v-for="(action, value) in options.singleActions")
    v-btn(
      icon
      v-if="action.quick && condition(action)"
      :color="action.color"
      :key="value"
      @click="emit(value, payload)"
    )
      v-icon {{ action.icon }}
  v-menu(offset-y)
    template(#activator="{ attrs, on }")
      v-btn(color="primary" icon v-bind="attrs" v-on="on")
        v-icon {{ icons.mdiDotsHorizontal }}
    v-list
      template(
        v-for="(action, value) in options.singleActions"
        v-if="!options.hideTableActions && !options.hideAllActions && condition(action)"
      )
        v-list-item(:key="value" @click="emit(value, payload)")
          v-list-item-icon
            v-icon(:color="action.color") {{ action.icon }}
          v-list-item-content
            v-list-item-title {{ action.text }}
</template>

<script>
import { mdiDotsHorizontal } from '@mdi/js'
import conditionMixin from '../../conditionMixin'

export default {
  name: 'SingleActions',
  mixins: [conditionMixin],
  props: {
    options: { type: Object, required: true },
    payload: { type: Object, required: true },
  },
  data: () => ({
    icons: { mdiDotsHorizontal },
  }),
  methods: {
    emit(value, payload) {
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$emit(
        `action-single-${value}`,
        payload
      )
    },
  },
}
</script>
