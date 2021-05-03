# v-query-data-table
> [Live Demo](https://v-query-data-table.emiolo.com.br/)

## Why is this in portuguese?
This component was created for internal usage at emiolo.com
I intend to internationalize it someday, but I don't have time now. If you want to use it or need help, let me know creating an issue and I may give more attention for this.

## Introdução
Esse componente é um agregado de funções que normalmente são aplicadas em uma tabela do tipo DataTables.

Ele foi desenvolvido para facilitar e simplificar a quantidade de código necessária para a implementação de todas as suas funções.

## Instalação

### Requisitos obrigatórios

Instalar os seguintes componentes:

* Vuetify 2.x
* Vue 2.x

### Instalação do pacote
```shell
npm install --save v-query-data-table
```

### Utilização local
`component.vue`
```vue
<script>
import VQueryDataTable from 'v-query-data-table'

export default {
  components: { VQueryDataTable },
}
</script>
```

### Utilização global
`main.js`
```javascript
import Vue from 'vue'
import VQueryDataTable from 'v-query-data-table'

Vue.use(VQueryDataTable)
```

### Utilização com o Nuxt.js
`nuxt.config.js`
```javascript
module.exports = {
  // ...
  modules: [
    'v-query-data-table/nuxt',
  ],
  // ...
}
```

### Utilização em HTML puro
```html
<script type="text/javascript" src="https://unpkg.com/v-query-data-table@2.x/lib/bundle.umd.js"></script>
```

## Desenvolvimento

Para executar o projeto em modo de exemplo para desenvolvimento local, clone o projeto no seu computador e rode o comando abaixo
```shell
npm install
npm run serve
```

## Documentação
### Propriedades da tabela
Além de todas as propriedades definidas na [v-data-table do vuetify](https://vuetifyjs.com/en/api/v-data-table/), há ainda: 
- [actions](#actions)
- [bulkActions](#bulkActions)
- [datatable](#datatable)
- [description](#datatable)
- [disablePagination](#disablePagination)
- [disableSorting](#disableSorting)
- [disallowDense](#disallowDense)
- [disallowGroups](#disallowGroups)
- [disallowKeepGroupedColumns](#disallowKeepGroupedColumns)
- [fetch](#fetch)
- [headers](#headers)
- [hideAllActions](#hideAllActions)
- [hideFilter](#hideFilter)
- [hideHeader](#hideHeader)
- [hideMenu](#hideMenu)
- [hideRowGroupClose](#hideRowGroupClose)
- [hideRowGroupExpansion](#hideRowGroupExpansion)
- [hideSearch](#hideSearch)
- [hideSingleActions](#hideSingleActions)
- [hideTableActions](#hideTableActions)
- [hideTableFAB](#hideTableFAB)
- [hideTableQuickActions](#hideTableQuickActions)
- [items](#items)
- [itemsMap](#itemsMap)
- [multiSort](#multiSort)
- [mustSort](#mustSort)
- [overrideQuery](#overrideQuery)
- [query](#query)
- [showDebug](#showDebug)
- [singleActions](#singleActions)
- [tableActions](#tableActions)
- [title](#title)
- [toolbarFieldsBackground](#toolbarFieldsBackground)
- [toolbarFieldsColor](#toolbarFieldsColor)

#### actions
Fazer

#### bulkActions
Tipo: `Object`
Default: `{}`
Descrição: Define as ações em massa para os itens da tabela
Exemplo:
```javascript
bulkActions: {
    remove: {
        icon: 'delete',
        text: 'Remover itens',
    },
    download: {
        icon: 'download',
        text: 'Baixar itens'
    }
}
```

#### datatable

#### description
Tipo: `string`
Default: `''`
Descrição: Texto de descrição da tabela

#### disablePagination
Tipo: `boolean`
Default: `false`
Descrição: Desabilita a paginação dos itens da tabela retirando o elemento de layout responsável por essa funcionalidade

#### disableSorting
Tipo: `boolean`
Default: `false`
Descrição: Desabilita a ordenação dos itens

#### disallowDense
Tipo: `boolean`
Default: `false`
Descrição: Desabilita amostragem das linhas da tabela de forma densa

#### disallowGroups
Tipo: `boolean`
Default: `false`
Descrição: Desabilita agrupamento de itens

#### disallowKeepGroupedColumns
Não sei o que faz

#### fetch
Tipo: `Function`
Default: `null`
Descrição: Função responsável por buscar os itens da tabela. Envia para a função um parâmetro informando os filtros para realizar a busca dos dados
Exemplo:
```javascript
<v-query-data-table :fetch="fetchItems" />
<script>
export default {
    methods: {
        async fetchItems(payload) {
            const response = await this.axios.get('/itens', {
                params: payload
            })
            
            return response
        }
    }
}
</script>
```

#### headers
Tipo: `array`
Default: Não possui, é uma propriedade obrigatória
Descrição: Define os cabeçalhos da tabela
Exemplo:
```javascript
headers: [
    { text: 'Ações', value: '_actions' }, //Define a coluna paras as ações de cada item
    {
        text: 'Avatar',
        value: 'avatar',
        align: 'center', //Aceita todos as propriedades definidas para os headers do v-data-table do vuetify, acesse: https://vuetifyjs.com/en/api/v-data-table/#props
        $custom: {
            template: 'avatar'
        },
        $extra: {
            filterable: false
        }
    },
    {
        text: 'Dessert (100g serving)',
        align: 'left',
        groupable: false,
        value: 'name',
        $extra: {
            transformItem: (value) => value.toUpperCase(),
        },
    },
    {
        text: 'Tipo',
        value: 'kind',
        $extra: {
            transformItem: {
              hot: 'Quente', //Do lado esquerdo o valor do item, do lado direito sua tranformação
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
]
```
##### $custom
Define algumas customizações que serão utilizadas nos dados de uma coluna. É uma propriedade não obrigatória, assim como as propriedades definidas em seu interior
```javascript
$custom: {
    template: 'chips' | 'avatar', //Caso presente, define como o dado será mostrado, como v-chip, ou v-avatar. O valor default é texto
    dark: Boolean, //Aplica o estilo dark dos componentes vuetify
    color: String | Function, //Caso seja um campo do tipo template chip, define a cor do v-chip
}
```
##### $extra
Define algumas informações extras sobre a coluna. É uma propriedade não obrigatória, assim como as propriedades definidas em seu interior
```javascript
$extra: {
    filterable: Boolean, //Define se a coluna permite ser filtrada
    trasformItem: Function | Object, //Transforma o valor recebido
    filterType: 'autocomplete' | 'range', //Define como a coluna é filtrada
}
```

#### hideAllActions
Tipo: `boolean`
Default: `false`
Descrição: Esconde todas as ações que podem ser feitas nos itens e/ou na tabela

#### hideFilter
Tipo: `boolean`
Default: `false`
Descrição: Desabilita os filtros da tabela escondendo o ícone usado para acessar o menu de filtragem

#### hideHeader
Tipo: `boolean`
Default: `false`
Descrição: Esconde cabeçalho da tabela. O cabeçalho da tabela consiste do título da tabela, do ícone de filtragem, do ícone de menu, do input de busca, e dos botões de ações rápidas da tabela

#### hideMenu
Tipo: `boolean`
Default: `false`
Descrição: Esconde o ícone de menu da tabela (ícone de reticências)

#### hideRowGroupClose
Tipo: `boolean`
Default: `false`
Descrição: Esconde o botão que realiza o desagrupamento das linhas da tabela que foram agrupadas

#### hideRowGroupExpansion
Tipo: `boolean`
Default: `false`
Descrição: Esconde o botão que permite expandir ou recolher a listagem do itens agrupadas

#### hideSearch
Tipo: `boolean`
Default: `false`
Descrição: Esconde o input de busca da tabela

#### hideSingleActions
Tipo: `boolean`
Default: `false`
Descrição: Esconde as ações unitárias para todas as linha da tabela

#### hideTableActions
Tipo: `boolean`
Default: `false`
Descrição: Esconde as ações da tabela

#### hideTableFAB
Tipo: `boolean`
Default: `false`
Descrição: Esconde ação flutuante. A ação flutuante se localiza, de forma absoluta, no canto inferior direito da tela

#### hideTableQuickActions
Tipo: `boolean`
Default: `false`
Descrição: Esconde as ações rápidas da tabela. Ações rápidas da tabela se localizam no cabeçalho da tabela

#### items

#### itemsMap
Não sei o que faz

#### multiSort
Tipo: `boolean`
Default: `false`
Descrição: Caso valor seja true, habilita o ordenamento de mais de uma coluna ao mesmo tempo

#### mustSort
Tipo: `boolean`
Default: `false`
Descrição: Caso valor seja true, torna o ordenamento obrigatório. Uma vez que uma coluna é ordenada, não é mais possível desordená-la, o usuário só poderá alterar entre o ordenamento crescente ou decrescente

#### overrideQuery
Não sei o que faz

#### query

#### showDebug
Tipo: `boolean`
Default: `false`
Descrição: Habilita a visibilidade do debug da tabela. O debug mostra todos os valores inerentes a tabela

#### singleActions

#### tableActions

#### title
Tipo: `string`
Default: `''`
Descrição: Texto título da tabela

#### toolbarFieldsBackground
Tipo: `string`
Default: `grey`
Descrição: Define a cor de fundo dos ícones do cabeçalho da tabela, e do input de busca

#### toolbarFieldsColor
Tipo: `string`
Default: `primary`
Descrição: Define a cor dos ícones do cabeçalho da tabela, e do input de busca. O valor default aponta para a cor definida como primary no sistema
