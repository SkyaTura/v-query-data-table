import { shallowMount, Wrapper } from '@vue/test-utils'
import TableFooter from '@/components/VQueryDataTable/TableFooter.vue'
import Vuetify from 'vuetify'

describe('TableFooter.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    disablePagination: false,
    query: {
      page: 1,
      itemsPerPage: 10
    },
    pagination: {
      pagesCount: 1,
      resultCount: 10,
      totalCount: 10,
    },
    loading: {
      active: false
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(TableFooter, {
      vuetify,
      propsData: {
        options: {
          ...props
        }
      },
    })
  })

  it('verify its showing condition', async () => {
    expect(wrapper.findComponent({ name: 'v-pagination' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        disablePagination: true
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-pagination' }).exists()).toBeFalsy()
  })

  it('verify the return value of showingFrom', async () => {
    wrapper.setProps({
      options: {
        ...props,
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showingFrom).toBe(1)
  })

  it('verify the return value of showingUntil', () => {
    expect(wrapper.vm.showingUntil).toBe(10)
  })

  it('verify its text', () => {
    expect(wrapper.find('.text-center').text()).toBe('Exibindo de 1 até 10 de 10 registros')
  })
})