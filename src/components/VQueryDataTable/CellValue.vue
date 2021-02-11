<template lang="pug">
SingleActions(
  v-bind="{ options, payload: props }"
  v-if="header.value === '_actions'"
)

CellAvatar(
  v-bind="{ options, header, props }"
  v-else-if="header.$custom.template === 'avatar'"
)

CellChip(
  v-bind="{ options, header, props }"
  v-else-if="header.$custom.template === 'chips'"
)

td(v-else) {{ props.value }}
</template>

<script>
import SingleActions from './SingleActions.vue'
import CellChip from './CellChip.vue'
import CellAvatar from './CellAvatar.vue'

export default {
  name: 'CellValue',
  components: { SingleActions, CellChip, CellAvatar },
  props: {
    options: { type: Object, required: true },
    props: { type: Object, required: true },
    header: { type: Object, required: true },
  },
}
</script>
