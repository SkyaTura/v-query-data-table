<template lang="pug">
v-app#app
  link(rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons")
  v-app-bar(app dark color="blue darken-4")
    .title Vuetify - Query Data Table
  v-main
    v-container(fluid)
      v-container
        v-switch(dense hideDetails v-model="datatable.hideActions" label="Esconder ações")
        v-switch(dense hideDetails v-model="datatable.hideMenu" label="Esconder menu")
        v-switch(dense hideDetails v-model="datatable.hideSearch" label="Esconder busca")
        v-switch(dense hideDetails v-model="datatable.disallowDense" label="Não permitir listagem densa")
        v-switch(dense hideDetails v-model="datatable.disallowGroups" label="Não permitir agrupar")
        v-switch(dense hideDetails v-model="datatable.disallowKeepGroupedColumns" label="Não permitir manter coluna agrupada" :disabled="datatable.disallowGroups")
        v-switch(dense hideDetails v-model="datatable.hideRowGroupClose" label="Ocultar botão de desagrupar na linha" :disabled="datatable.disallowGroups")
        v-switch(dense hideDetails v-model="datatable.hideRowGroupExpansion" label="Ocultar botão de desagrupar na linha" :disabled="datatable.disallowGroups")
        v-card.mt-4.py-3.px-5.big-corners(flat)
          VQueryDataTable(
            v-bind="datatable"
            :query.sync="datatable.query"
            @action-table-add="newItem"
          )
        v-card.mt-4.py-3.px-5.big-corners(flat)
          v-card-title Exemplo de configuração
          pre(align="left") {{ datatable }}
</template>

<script>
import fakeApi from './api/desserts'

export default {
  name: 'App',
  data: () => ({
    datatable: {
      hideActions: false,
      hideMenu: false,
      hideSearch: false,
      disallowGroups: false,
      query: null,
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
              console.info('Exportar')
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
          pickable: false,
          $extra: {
            transformItem: (value) => value.toUpperCase(),
          },
        },
        {
          text: 'Tipo',
          value: 'kind',
          $extra: {
            visible: false,
            transformItem: {
              hot: 'Quente',
              room_temperature: 'Temperatura Ambiente',
              cold: 'Gelado',
            },
          },
        },
        {
          text: 'Calories',
          align: 'center',
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
        { text: 'Fat (g)', value: 'fat', $extra: { filterable: false } },
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
      console.info('Novo item')
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
