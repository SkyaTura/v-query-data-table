<template lang="pug">
v-navigation-drawer(app right temporary v-model="filtersDrawer")
  v-list
    v-list-item
      v-list-item-content
        v-list-item-title Foo
</template>

<script>
export default {
  name: 'TableDrawer',
  data: () => ({
    filtersDrawer: false,
  }),
  methods: {
    open() {
      this.filtersDrawer = true
    },
  },
}
</script>
