<template lang="pug">
v-app#app
  link(
    href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons"
    rel="stylesheet"
  )
  v-app-bar(app color="blue darken-4" dark)
    .title Vuetify - Query Data Table
    v-spacer
    v-btn(icon @click="$vuetify.theme.dark = !$vuetify.theme.dark") D
  v-main
    v-container(fluid)
      v-container
        v-row
          v-col(cols="12" md="4")
            v-switch(
              dense
              hideDetails
              label="Exibir debug de variáveis"
              v-model="datatable.showDebug"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder ações rápidas"
              v-model="datatable.hideTableQuickActions"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder ações da tabela"
              v-model="datatable.hideTableActions"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder ação flutuante"
              v-model="datatable.hideTableFAB"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder ações unitárias"
              v-model="datatable.hideSingleActions"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder todas as ações"
              v-model="datatable.hideAllActions"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder menu"
              v-model="datatable.hideMenu"
            )
          v-col(cols="12" md="4")
            v-switch(
              dense
              hideDetails
              label="Esconder cabeçalho"
              v-model="datatable.hideHeader"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder filtro"
              v-model="datatable.hideFilter"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder busca"
              v-model="datatable.hideSearch"
            )
            v-switch(
              dense
              hideDetails
              label="Esconder paginação"
              v-model="datatable.disablePagination"
            )
            v-switch(
              dense
              hideDetails
              label="Não permitir ordenação"
              v-model="datatable.disableSort"
            )
            v-switch(
              dense
              hideDetails
              label="Multipla ordenação"
              v-model="datatable.multiSort"
            )
          v-col(cols="12" md="4")
            v-switch(
              dense
              hideDetails
              label="Ordenação obrigatória"
              v-model="datatable.mustSort"
            )
            v-switch(
              dense
              hideDetails
              label="Não permitir listagem densa"
              v-model="datatable.disallowDense"
            )
            v-switch(
              dense
              hideDetails
              label="Não permitir agrupar"
              v-model="datatable.disallowGroups"
            )
            v-switch(
              dense
              hideDetails
              label="Não permitir manter coluna agrupada"
              v-model="datatable.disallowKeepGroupedColumns"
              :disabled="datatable.disallowGroups"
            )
            v-switch(
              dense
              hideDetails
              label="Ocultar botão de desagrupar na linha"
              v-model="datatable.hideRowGroupClose"
              :disabled="datatable.disallowGroups"
            )
            v-switch(
              dense
              hideDetails
              label="Ocultar botão de desagrupar na linha"
              v-model="datatable.hideRowGroupExpansion"
              :disabled="datatable.disallowGroups"
            )
        v-card.mt-4.py-3.px-5.big-corners(flat)
          VQueryDataTable(
            item-key="name"
            v-bind="datatable"
            :query.sync="datatable.query"
            @action-bulk-remove="newItem"
            @action-single-remove="newItem"
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
        modify: { icon: 'edit', text: 'Editar', quick: true },
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
        { text: 'Ações', value: '_actions' },
        {
          text: 'Avatar',
          align: 'center',
          value: 'avatar',
          sortable: false,
          groupable: false,
          $custom: {
            template: 'avatar',
          },
          $extra: {
            filterable: false,
          },
        },
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          groupable: false,
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
          $extra: {
            filterType: 'range',
          },
          $custom: {
            template: 'chips',
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
