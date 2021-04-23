import { shallowMount } from '@vue/test-utils'
import { mdiFilter, mdiDotsHorizontal, mdiMagnify } from '@mdi/js'
import TableHeader from '@/components/VQueryDataTable/TableHeader.vue'
import Vuetify from 'vuetify'

describe('tableHeader.vue', () => {
  let wrapper

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
      search: '',
    },
    tableActions: {
      add: {
        icon: 'add',
        text: 'Novo item',
        quick: true,
        color: 'primary',
      },
      delete: {
        icon: 'delete',
        text: 'Excluir',
        color: 'red',
      },
    },
    filter: {
      drawer: false,
    },
    fetch: true,
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(TableHeader, {
      vuetify,
      propsData: {
        options: {
          ...props,
        },
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

  it('icons should be equal as defined on data', () => {
    expect.hasAssertions()
    expect(wrapper.vm.icons).toStrictEqual({
      mdiFilter,
      mdiDotsHorizontal,
      mdiMagnify,
    })
  })

  it('v-toolbar should exists when hideHeader is false', async () => {
    expect.hasAssertions()
    expect(wrapper.findComponent({ name: 'v-toolbar' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        hideHeader: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-toolbar' }).exists()).toBeFalsy()
  })

  it('header text should be equal as define on props.title', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        title: 'Teste',
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.text-h4.font-weight-bold').text()).toBe('Teste')
  })

  it('query.search should be equal to v-text-field', () => {
    expect.hasAssertions()
    expect(wrapper.vm.options.query.search).toBe('')

    wrapper.findComponent({ name: 'v-text-field' }).vm.$emit('input', 'Teste')

    expect(wrapper.vm.options.query.search).toBe('Teste')
  })

  it('three dots button should exists when hideFilter or hideMenu is false', async () => {
    expect.hasAssertions()
    expect(wrapper.findAll('.toolbar-item')).toHaveLength(3)

    wrapper.setProps({
      options: {
        ...props,
        hideFilter: true,
        hideMenu: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.toolbar-item')).toHaveLength(1)
  })

  it('v-text-field shoud exists when hideSearch is false', async () => {
    expect.hasAssertions()
    expect(
      wrapper.findComponent({ name: 'v-text-field' }).exists()
    ).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        hideSearch: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-text-field' }).exists()).toBeFalsy()
  })

  it('should show the proper number of quick actions define by quick propertie', async () => {
    expect.hasAssertions()
    expect(wrapper.findAll('.shrink.ml-3 v-btn-stub')).toHaveLength(1)

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          add: {
            icon: 'add',
            text: 'Novo item',
            quick: true,
            color: 'primary',
          },
          delete: {
            icon: 'delete',
            text: 'Excluir',
            quick: true,
            color: 'red',
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.shrink.ml-3 v-btn-stub')).toHaveLength(2)
  })

  it('quick actions should exists when hideTableQuickActions is false', async () => {
    expect.hasAssertions()
    expect(wrapper.find('.shrink.ml-3').exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        hideTableQuickActions: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.shrink.ml-3').exists()).toBeFalsy()
  })

  it('filter.drawer should be true when button is clicked', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.options.filter.drawer).toBeFalsy()

    wrapper.findAll('.toolbar-item').at(0).vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.filter.drawer).toBeTruthy()
  })

  it('action-table-[] should be emit when button is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          add: {
            icon: 'add',
            text: 'Novo item',
            quick: true,
            color: 'primary',
          },
          delete: {
            icon: 'delete',
            text: 'Excluir',
            quick: true,
            color: 'red',
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).not.toHaveProperty('action-table-add')
    expect(wrapper.emitted()).not.toHaveProperty('action-table-delete')

    const container = wrapper.findAllComponents({ name: 'v-btn' })
    const addButton = container.at(container.length - 2) // Get the next-to-last button
    const deleteButton = container.at(container.length - 1) // Get the last button

    addButton.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('action-table-add')

    deleteButton.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).toHaveProperty('action-table-delete')
  })
})
