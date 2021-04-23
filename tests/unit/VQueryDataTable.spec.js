import { shallowMount } from '@vue/test-utils'
import VQueryDataTable from '@/components/VQueryDataTable/VQueryDataTable.vue'

describe('vQueryDataTable.vue', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallowMount(VQueryDataTable, {
      propsData: {
        headers: [],
      },
    })
  })

  it('show skeleton when app is loading', async () => {
    expect.hasAssertions()

    wrapper.setData({
      loading: {
        active: true,
        firstTime: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-skeleton-loader' }).exists()).toBe(
      true
    )
  })

  it('show table when app is not loading', async () => {
    expect.hasAssertions()

    wrapper.setData({
      loading: {
        active: false,
        firstTime: false,
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findComponent({ name: 'v-card' }).classes('VQueryDataTable')
    ).toBe(true)
  })

  it('show description when its not empty', async () => {
    expect.hasAssertions()

    wrapper.setData({
      loading: {
        active: false,
        firstTime: false,
      },
    })
    wrapper.setProps({
      description: 'Teste',
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('p').text()).toBe('Teste')
  })

  it('verify showing condition of debug', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      showDebug: true,
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-h6').text()).toBe('Debug')
  })

  it('verify return of computed queryJSON, and the watch on queryJSON', async () => {
    expect.hasAssertions()

    expect(wrapper.emitted()).not.toHaveProperty('update:query')

    wrapper.setData({
      iQuery: {
        search: 'Teste search',
        filter: 'Teste filter',
        page: 1,
        itemsPerPage: 10,
        sortBy: ['test'],
        sortDesc: [true],
        groupBy: ['name'],
        groupDesc: [true],
        multiSort: false,
        mustSort: false,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.iQuery).toStrictEqual({
      search: 'Teste search',
      filter: 'Teste filter',
      page: 1,
      itemsPerPage: 10,
      sortBy: ['test'],
      sortDesc: [true],
      groupBy: ['name'],
      groupDesc: [true],
      multiSort: false,
      mustSort: false,
    })

    expect(wrapper.emitted()).toHaveProperty('update:query')
  })

  it('verify return of computed oldActions', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      singleActions: { modify: { icon: 'edit', text: 'Editar', quick: true } },
      bulkActions: { remove: { icon: 'delete', text: 'Excluir' } },
      tableActions: {
        add: {
          icon: 'add',
          text: 'Novo item',
        },
      },
      actions: {
        single: { view: { icon: 'view', text: 'Visualizar' } },
        bulk: { delete: { icon: 'delete', text: 'Excluir' } },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.oldActions).toStrictEqual({
      singleActions: {
        view: { icon: 'view', text: 'Visualizar' },
        modify: { icon: 'edit', text: 'Editar', quick: true },
      },
      tableActions: {
        add: {
          icon: 'add',
          text: 'Novo item',
        },
      },
      bulkActions: {
        delete: { icon: 'delete', text: 'Excluir' },
        remove: { icon: 'delete', text: 'Excluir' },
      },
    })
  })

  it('verify return of computed computedHeaders', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      headers: [
        { text: 'Ações', value: '_actions' },
        {
          text: 'Avatar',
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
          text: 'Tipo',
          value: 'kind',
          $extra: {
            visible: false,
            transformItem: {
              hot: 'Quente',
              cold: 'Gelado',
            },
          },
        },
        {
          text: 'Calories',
          value: 'calories',
          $extra: {
            filterType: 'range',
          },
          $custom: {
            template: 'chips',
            dark: true,
          },
        },
        { text: 'Fat (g)', value: 'fat', $extra: { filterable: false } },
      ],
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.computedHeaders).toStrictEqual([
      {
        sortable: false,
        groupable: false,
        text: 'Ações',
        value: '_actions',
        itemSlot: 'item._actions',
        headerSlot: 'header._actions',
        $custom: { template: 'default' },
        $extra: {
          visible: true,
          filterable: false,
          filterType: 'select',
          transformItem: null,
        },
      },
      {
        text: 'Avatar',
        value: 'avatar',
        sortable: false,
        groupable: false,
        $custom: { template: 'avatar' },
        $extra: {
          visible: true,
          filterable: false,
          filterType: 'select',
          transformItem: null,
        },
        itemSlot: 'item.avatar',
        headerSlot: 'header.avatar',
      },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          filterable: true,
          filterType: 'select',
          transformItem: {
            cold: 'Gelado',
            hot: 'Quente',
          },
        },
        itemSlot: 'item.kind',
        headerSlot: 'header.kind',
        $custom: { template: 'default' },
      },
      {
        text: 'Calories',
        value: 'calories',
        $extra: {
          visible: true,
          filterable: true,
          filterType: 'range',
          transformItem: null,
        },
        $custom: { template: 'chips', dark: true },
        itemSlot: 'item.calories',
        headerSlot: 'header.calories',
      },
      {
        text: 'Fat (g)',
        value: 'fat',
        $extra: {
          visible: true,
          filterable: false,
          filterType: 'select',
          transformItem: null,
        },
        itemSlot: 'item.fat',
        headerSlot: 'header.fat',
        $custom: { template: 'default' },
      },
    ])
  })

  it('verify return of computed transformableHeaders', () => {
    expect.hasAssertions()
    expect(wrapper.vm.transformableHeaders).toStrictEqual([
      [
        'kind',
        {
          cold: 'Gelado',
          hot: 'Quente',
        },
      ],
    ])
  })

  it('verify return of computed computedItems', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      items: [
        {
          calories: 200,
          fat: 6,
          kind: 'cold',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        {
          calories: 200,
          fat: 9,
          kind: 'hot',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        },
      ],
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.computedItems).toStrictEqual([
      {
        $raw: {
          calories: 200,
          fat: 6,
          kind: 'cold',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        },
        calories: 200,
        fat: 6,
        kind: 'Gelado',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      },
      {
        $raw: {
          calories: 200,
          fat: 9,
          kind: 'hot',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        },
        calories: 200,
        fat: 9,
        kind: 'Quente',
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      },
    ])
  })

  it('verify the value of iQuery on query change', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      query: {
        page: 2,
        itemsPerPage: 15,
        sortBy: [],
        sortDesc: [],
        groupBy: ['test'],
        groupDesc: [true],
        multiSort: false,
        mustSort: false,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.iQuery).toStrictEqual({
      page: 2,
      itemsPerPage: 15,
      sortBy: [],
      sortDesc: [],
      groupBy: ['test'],
      groupDesc: [true],
      multiSort: false,
      mustSort: false,
    })
  })

  it('verify value of search on setSearch', () => {
    expect.hasAssertions()

    wrapper.vm.setSearch('Teste')

    expect(wrapper.vm.search).toStrictEqual('Teste')
  })

  it('verify value of dense, and localStorage on toggleDense', () => {
    expect.hasAssertions()

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation()

    expect(wrapper.vm.dense).toStrictEqual(false)

    wrapper.vm.toggleDense()

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'v-query-data-table:dense',
      true
    )
    expect(wrapper.vm.dense).toStrictEqual(true)
  })

  it('verify value of keepGroupedColumns, and localStorage on toggleKeepGroupedColumns', () => {
    expect.hasAssertions()

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation()

    expect(wrapper.vm.keepGroupedColumns).toStrictEqual(false)

    wrapper.vm.toggleKeepGroupedColumns()

    expect(Storage.prototype.setItem).toHaveBeenCalledWith(
      'v-query-data-table:keepGroupedColumns',
      true
    )
    expect(wrapper.vm.keepGroupedColumns).toStrictEqual(true)
  })

  it('verify value of cache on clearCache', () => {
    expect.hasAssertions()

    wrapper.vm.cache.set('Teste', 'Valor do teste')

    wrapper.vm.clearCache()

    expect(wrapper.vm.cache.size).toStrictEqual(0)
  })
})
