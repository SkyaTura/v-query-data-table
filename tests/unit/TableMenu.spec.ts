import { shallowMount, Wrapper } from '@vue/test-utils'
import TableMenu from '@/components/VQueryDataTable/TableMenu.vue'
import Vuetify from 'vuetify'

describe('TableMenu.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const cleanFreshMock = jest.fn()
  const toggleDenseMock = jest.fn()
  const toggleKeepGroupedColumnsMock = jest.fn()

  const props = {
    dense: false,
    hideTableActions: false,
    hideAllActions: false,
    tableActions: {
      add: {
        icon: 'add',
        text: 'Novo item',
        color: 'primary'
      }
    },
    fetch: true,
    cleanFresh: cleanFreshMock,
    disallowDense: false,
    toggleDense: toggleDenseMock,
    disallowGroups: false,
    disallowKeepGroupedColumns: false,
    toggleKeepGroupedColumns: toggleKeepGroupedColumnsMock,
    datatable: {
      dense: false
    },
    disablePagination: false,
    query: {
      itemsPerPage: 10
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(TableMenu, {
      vuetify,
      propsData: {
        options: {
          ...props
        }
      },
    })
  })

  it('verify its showing condition', async () => {
    expect(wrapper.findComponent({ name: 'v-menu' }).exists()).toBeTruthy()
  })
})