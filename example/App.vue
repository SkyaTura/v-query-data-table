<template lang="pug">
v-app#app
  v-app-bar(app dark color="blue darken-4")
    .title Vuetify - Query Data Table
  v-content
    v-container(fluid)
      v-container
        v-switch(dense hideDetails v-model="datatable.hideActions" label="Esconder ações")
        v-switch(dense hideDetails v-model="datatable.hideMenu" label="Esconder menu")
        v-switch(dense hideDetails v-model="datatable.hideSearch" label="Esconder busca")
        v-switch(dense hideDetails v-model="datatable.disallowDense" label="Não permitir listagem densa")
        v-switch(dense hideDetails v-model="datatable.disallowGroups" label="Não permitir agrupar")
        v-card.mt-4.py-3.px-5.big-corners(flat)
          VQueryDataTable(
            v-bind="datatable"
            @action-table-add="newItem"
          )
</template>

<script>
import fakeApi from './api/desserts'

export default {
  name: 'app',
  data: () => ({
    query: null,
    datatable: {
      hideActions: false,
      hideMenu: false,
      actions: {
        single: {
          modify: { icon: 'edit', text: 'Editar' },
          remove: { icon: 'delete', text: 'Remover' },
        },
        table: {
          add: { icon: 'add', text: 'Novo', quick: true },
          download: {
            icon: 'cloud_download',
            text: 'Exportar',
            handler() {
              console.log('Exportar')
            },
          },
        },
        bulk: {
          remove: { icon: 'delete', text: 'Excluir' },
        },
      },
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          value: 'name',
        },
        {
          text: 'Calories',
          align: 'center',
          filterable: true,
          value: 'calories',
          $custom: {
            template: 'chips',
            // format: v => (v ? 'Ativo' : 'Inativo'),
            dark: true,
            color(value) {
              const calories = parseInt(value, 10)
              if (calories > 400) return 'red'
              else if (calories > 200) return 'orange'
              else return 'green'
            },
          },
        },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
        { text: 'Ações', value: '_actions' },
      ],
      fetch: fakeApi,
    },
  }),
  methods: {
    newItem() {
      console.log('Novo item')
    },
  },
}
</script>

<style lang="sass" scoped>
.big-corners
  border-radius: 16px !important
#app
  background: #F2F6F9
</style>
