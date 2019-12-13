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

[Em breve]
