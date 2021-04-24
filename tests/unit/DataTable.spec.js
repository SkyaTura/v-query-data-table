import { shallowMount } from '@vue/test-utils'
import DataTable from '@/components/VQueryDataTable/DataTable.vue'
import Vuetify from 'vuetify'

describe('dataTable.vue', () => {
  let wrapper

  const props = {
    datatable: {
      disablePagination: false,
      dense: true,
      items: [{ name: 'Teste 1' }, { name: 'Teste 2' }],
    },
    headers: [
      {
        text: 'Ações',
        value: '_actions',
      },
      {
        text: 'Teste',
        value: 'name',
      },
    ],
    values: {
      selected: [],
    },
    query: {
      search: '',
    },
    slots: {
      table: [],
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(DataTable, {
      vuetify,
      propsData: {
        options: {
          ...props,
        },
      },
    })
  })

  it('message should be equal to query.search when datatable.items is empty', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        datatable: {
          ...props.datatable,
          items: [],
        },
        query: {
          search: 'some text',
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-h5').text()).toBe('some text')
  })

  it('message should be equal to an icon view_list when query.search and datatable.items are empty', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        datatable: {
          ...props.datatable,
          items: [],
        },
        query: {
          search: '',
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.primary--text').text()).toBe('view_list')
  })
})
