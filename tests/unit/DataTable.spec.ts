import { shallowMount, Wrapper } from '@vue/test-utils'
import DataTable from '@/components/VQueryDataTable/DataTable.vue'
import Vuetify from 'vuetify'

describe('DataTable.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    datatable: {
      disablePagination: false,
      dense: true,
      items: [
        { name: 'Teste 1' },
        { name: 'Teste 2' },
      ],
    },
    headers: [
      {
        text: 'Ações',
        value: '_actions'
      },
      {
        text: 'Teste',
        value: 'name'
      }
    ],
    values: {
      selected: [],
    },
    query: {
      search: "",
    },
    slots: {
      table: []
    }
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(DataTable, {
      vuetify,
      propsData: {
        options: {
          ...props
        }
      },
    })
  })

  it('verify message when search return no data', async () => {
    wrapper.setProps({
      options: {
        ...props,
        datatable: {
          ...props.datatable,
          items: []
        },
        query: {
          search: 'some text'
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-h5').text()).toBe('some text')
  })

  it('verify message when its has no data', async () => {
    wrapper.setProps({
      options: {
        ...props,
        datatable: {
          ...props.datatable,
          items: []
        },
        query: {
          search: ''
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.primary--text').text()).toBe('view_list')
  })

  it('verify emitted function on update options', async () => {
    
  })
})