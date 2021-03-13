import { mount, shallowMount, Wrapper } from '@vue/test-utils'
import { mdiFilter, mdiDotsHorizontal, mdiMagnify } from '@mdi/js'
import TableHeader from '@/components/VQueryDataTable/TableHeader.vue'
import Vuetify from 'vuetify'

describe('TableHeader.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    hideHeader: false,
    hideMenu: false,
    hideSearch: false,
    hideTableActions: false,
    hideTableQuickActions: false,
    hideAllActions: false,
    title: '',
    hideFilter: false,
    toolbarFieldsColor: 'primary',
    loading: {
      active: false,
    },
    query: {
      search: ''
    },
    tableActions: {
      add: {
        icon: 'add',
        text: 'Novo item',
        quick: true,
        color: 'primary'
      },
      delete: {
        icon: 'delete',
        text: 'Excluir',
        color: 'red'
      }
    }
  }

  beforeAll(() => {
    wrapper = shallowMount(TableHeader, {
      propsData: {
        options: {
          ...props
        }
      },
      data() {
        return {
          icons: {
            mdiFilter,
            mdiDotsHorizontal,
            mdiMagnify,
          },
        }
      },
    })
  })

  it('verify initial data', () => {
    expect(wrapper.vm.icons).toEqual({
      mdiFilter,
      mdiDotsHorizontal,
      mdiMagnify,
    })
  })

  it('verify its showing condition', async () => {
    expect(wrapper.findComponent({ name: 'v-toolbar' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        hideHeader: true,
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-toolbar' }).exists()).toBeFalsy()
  })

  it('verify its title', async () => {
    wrapper.setProps({
      options: {
        ...props,
        title: 'Teste',
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-h4.font-weight-bold').text()).toBe('Teste')
  })

  it('verify value of search input', async () => {
    expect(wrapper.vm.options.query.search).toBe('')

    wrapper.findComponent({ name: 'v-text-field' }).vm.$emit('input', 'Teste')
    expect(wrapper.vm.options.query.search).toBe('Teste')
  })

  it('verify showing condition of filter and three dots button', async () => {
    expect(wrapper.findAll('.toolbar-item')).toHaveLength(3)

    wrapper.setProps({
      options:{
        ...props,
        hideFilter: true,
        hideMenu: true
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.toolbar-item')).toHaveLength(1)
  })

  it('verify showing condition of search input', async () => {
    expect(wrapper.findComponent({ name: 'v-text-field' }).exists()).toBeTruthy()

    wrapper.setProps({
      options:{
        ...props,
        hideSearch: true
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-text-field' }).exists()).toBeFalsy()
  })

  it('verify exhibition of multiples quick actions', async () => {
    expect(wrapper.findAll('.shrink.ml-3 v-btn-stub')).toHaveLength(1)

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          add: {
            icon: 'add',
            text: 'Novo item',
            quick: true,
            color: 'primary'
          },
          delete: {
            icon: 'delete',
            text: 'Excluir',
            quick: true,
            color: 'red'
          }
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.shrink.ml-3 v-btn-stub')).toHaveLength(2)
  })

  it('verify showing condition of quick actions', async () => {
    expect(wrapper.find('.shrink.ml-3').exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        hideTableQuickActions: true
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.shrink.ml-3').exists()).toBeFalsy()
  })

  it('verify the click on filter button', async () => {
    const vuetify = new Vuetify()

    const component = mount(TableHeader, {
      vuetify,
      propsData: {
        options: {
          ...props,
          dense: false,
          datatable: {
            dense: false
          }
        }
      },
      data() {
        return {
          icons: {
            mdiFilter,
            mdiDotsHorizontal,
            mdiMagnify,
          },
        }
      },
    })

    expect(component.findComponent({ ref: 'tableDrawer' }).classes('v-navigation-drawer--close')).toBeTruthy()
    await component.findAll('.toolbar-item').at(0).trigger('click')
    expect(component.findComponent({ ref: 'tableDrawer' }).classes('v-navigation-drawer--open')).toBeTruthy()
  })

  it('verify the emitted function when quick action is clicked', async () => {
    const vuetify = new Vuetify()

    const component = mount(TableHeader, {
      vuetify,
      propsData: {
        options: {
          ...props,
          dense: false,
          datatable: {
            dense: false
          },
          tableActions: {
            add: {
              icon: 'add',
              text: 'Novo item',
              quick: true,
              color: 'primary'
            },
            delete: {
              icon: 'delete',
              text: 'Excluir',
              quick: true,
              color: 'red'
            }
          }
        }
      },
      data() {
        return {
          icons: {
            mdiFilter,
            mdiDotsHorizontal,
            mdiMagnify,
          },
        }
      },
    })

    expect(component.emitted()).not.toHaveProperty('action-table-add')
    expect(component.emitted()).not.toHaveProperty('action-table-delete')

    const container = component.find('.shrink.ml-3')
    const addButton = container.findAll('.v-btn').at(0)
    const deleteButton = container.findAll('.v-btn').at(1)

    addButton.trigger('click')
    await component.vm.$nextTick()
    expect(component.emitted()).toHaveProperty('action-table-add')

    deleteButton.trigger('click')
    await component.vm.$nextTick()
    expect(component.emitted()).toHaveProperty('action-table-delete')
  })
})
