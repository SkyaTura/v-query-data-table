import { shallowMount } from '@vue/test-utils'
import TableMenu from '@/components/VQueryDataTable/TableMenu.vue'
import Vuetify from 'vuetify'

describe('tableMenu.vue', () => {
  let wrapper

  const cleanRefreshMock = jest.fn()
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
        color: 'primary',
      },
    },
    fetch: true,
    cleanRefresh: cleanRefreshMock,
    disallowDense: false,
    toggleDense: toggleDenseMock,
    disallowGroups: false,
    disallowKeepGroupedColumns: false,
    toggleKeepGroupedColumns: toggleKeepGroupedColumnsMock,
    datatable: {
      dense: false,
    },
    disablePagination: false,
    query: {
      itemsPerPage: 10,
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(TableMenu, {
      vuetify,
      propsData: {
        options: {
          ...props,
        },
      },
    })
  })

  it('verify table actions showing condition', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(0).text()).toBe('addNovo item')

    wrapper.setProps({
      options: {
        ...props,
        hideTableActions: true,
      },
    })
    await wrapper.vm.$nextTick()

    const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItems.at(0).text()).not.toBe('addNovo item')
  })

  it('verify the emitted function when bulk action is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()).not.toHaveProperty('action-table-add')

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const tableActionAdd = listItems.at(0)
    tableActionAdd.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-table-add')).toBeTruthy()
  })

  it('verify showing condition of refresh item', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(1).text()).toBe('refreshAtualizar')

    wrapper.setProps({
      options: {
        ...props,
        fetch: false,
      },
    })
    await wrapper.vm.$nextTick()

    const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItems.at(1).text()).not.toBe('refreshAtualizar')
  })

  it('verify if function is called when refresh is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const refreshItem = listItems.at(1)
    refreshItem.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(cleanRefreshMock).toHaveBeenCalled()
  })

  it('verify showing condition of toggle dense item', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(2).text()).toBe('unfold_lessListagem densa')

    wrapper.setProps({
      options: {
        ...props,
        disallowDense: true,
      },
    })
    await wrapper.vm.$nextTick()

    const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItems.at(2).text()).not.toBe('unfold_lessListagem densa')
  })

  it('verify if function is called when toggle dense item is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const denseItem = listItems.at(2)
    denseItem.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(toggleDenseMock).toHaveBeenCalled()
  })

  it('verify the text on toggle dense item', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(2).text()).toBe('unfold_lessListagem densa')

    wrapper.setProps({
      options: {
        ...props,
        datatable: {
          dense: true,
        },
      },
    })
    await wrapper.vm.$nextTick()

    const newListItem = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItem.at(2).text()).toBe('unfold_moreListagem normal')
  })

  it('verify showing condition of group item', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(3).text()).toBe('folderManter colunas agrupadas')

    wrapper.setProps({
      options: {
        ...props,
        disallowGroups: true,
        disallowKeepGroupedColumns: true,
      },
    })
    await wrapper.vm.$nextTick()

    const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItems.at(3).text()).not.toBe('folderManter colunas agrupadas')
  })

  it('verify if function is called when group item is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const groupItem = listItems.at(3)
    groupItem.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(toggleKeepGroupedColumnsMock).toHaveBeenCalled()
  })

  it('verify showing condition of pagination item', async () => {
    expect.hasAssertions()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(listItems.at(listItems.length - 1).text()).toBe('100')

    wrapper.setProps({
      options: {
        ...props,
        disablePagination: true,
      },
    })
    await wrapper.vm.$nextTick()

    const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })

    expect(newListItems.at(newListItems.length - 1).text()).toBe(
      'folderManter colunas agrupadas'
    )
  })

  // eslint-disable-next-line jest/no-done-callback
  it('verify the parameter on setItemsPerPage', async (done) => {
    expect.hasAssertions()

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const paginationItem = listItems.at(listItems.length - 1)

    paginationItem.trigger('mouseenter')
    await wrapper.vm.$nextTick()

    requestAnimationFrame(async () => {
      const newListItems = wrapper.findAllComponents({ name: 'v-list-item' })
      newListItems.at(listItems.length - 1).vm.$emit('click')
      await wrapper.vm.$nextTick()

      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'v-query-data-table:itemsPerPage',
        100
      )

      done()
    })
  })
})
