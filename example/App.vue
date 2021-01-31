<template lang="pug">
v-app#app
  link(rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons")
  v-app-bar(app dark color="blue darken-4")
    .title Vuetify - Query Data Table
    v-spacer
    v-btn(icon @click="$vuetify.theme.dark = !$vuetify.theme.dark") D
  v-main
    v-container(fluid)
      v-container
        v-row
          v-col(cols="12" md="4")
            v-switch(dense hideDetails v-model="datatable.showDebug" label="Exibir debug de variáveis")
            v-switch(dense hideDetails v-model="datatable.hideTableQuickActions" label="Esconder ações rápidas")
            v-switch(dense hideDetails v-model="datatable.hideTableActions" label="Esconder ações da tabela")
            v-switch(dense hideDetails v-model="datatable.hideTableFAB" label="Esconder ação flutuante")
            v-switch(dense hideDetails v-model="datatable.hideSingleActions" label="Esconder ações unitárias")
            v-switch(dense hideDetails v-model="datatable.hideAllActions" label="Esconder todas as ações")
              v-switch(dense hideDetails v-model="datatable.hideMenu" label="Esconder menu")
          v-col(cols="12" md="4")
            v-switch(dense hideDetails v-model="datatable.hideHeader" label="Esconder cabeçalho")
            v-switch(dense hideDetails v-model="datatable.hideFilter" label="Esconder filtro")
            v-switch(dense hideDetails v-model="datatable.hideSearch" label="Esconder busca")
            v-switch(dense hideDetails v-model="datatable.disablePagination" label="Esconder paginação")
            v-switch(dense hideDetails v-model="datatable.disableSort" label="Não permitir ordenação")
            v-switch(dense hideDetails v-model="datatable.multiSort" label="Multipla ordenação")
          v-col(cols="12" md="4")
            v-switch(dense hideDetails v-model="datatable.mustSort" label="Ordenação obrigatória")
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
      hideTableQuickActions: false,
      hideTableActions: false,
      hideTableFAB: false,
      hideSingleActions: false,
      hideAllActions: false,
      hideMenu: false,
      hideSearch: false,
      title: 'Exemplo de Tabela',
      description:
        'Quando necessário, você pode colocar um texto introdutório.',
      disallowGroups: false,
      query: null,
      singleActions: {
        modify: { icon: 'edit', text: 'Editar' },
        remove: { icon: 'delete', text: 'Remover' },
      },
      tableActions: {
        add: {
          icon: 'add',
          text: 'Novo item',
          quick: true,
          fab: true,
          color: 'primary',
        },
        download: {
          icon: 'cloud_download',
          text: 'Exportar',
          handler() {
            console.info('Exportar')
          },
        },
      },
      bulkActions: {
        remove: { icon: 'delete', text: 'Excluir' },
      },
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          value: 'name',
          pickable: false,
          $extra: {
            transformItem: value => value.toUpperCase(),
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
              if (calories > 200) return 'orange'
              return 'green'
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
  &.theme--dark
    background: #121212
</style>
