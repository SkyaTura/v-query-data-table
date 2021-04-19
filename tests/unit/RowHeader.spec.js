import { shallowMount } from '@vue/test-utils'
import RowHeader from '@/components/VQueryDataTable/RowHeader.vue'
import Vuetify from 'vuetify'

describe('rowHeader.vue', () => {
  let wrapper

  const setGroupByMock = jest.fn()

  const props = {
    disallowGroups: false,
    keepGroupedColumns: false,
    disallowKeepGroupedColumns: false,
    query: {
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
    },
  }

  const headerProps = {
    text: 'Teste',
    value: 'test',
    sortable: false,
    groupable: false,
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(RowHeader, {
      vuetify,
      propsData: {
        options: {
          ...props,
        },
        header: {
          ...headerProps,
        },
      },
    })
  })

  it('verify header text', () => {
    expect.hasAssertions()
    expect(wrapper.find('.customHeader-text').text()).toBe('Teste')
  })

  it('verify sort icon showing condition', async () => {
    expect.hasAssertions()
    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props,
      },
      header: {
        ...headerProps,
        sortable: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeTruthy()
  })

  it('verify the class sorted of span container of sort icon', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          sortBy: ['test'],
        },
      },
      header: {
        ...headerProps,
        sortable: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').classes()).toContain(
      'sorted'
    )
  })

  it('verify group icon showing condition', async () => {
    expect.hasAssertions()
    expect(wrapper.find('.customHeader-actions-group').exists()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props,
      },
      header: {
        ...headerProps,
        groupable: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-group').exists()).toBeTruthy()
  })

  it('verify the class grouped of span container of sort icon', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          groupBy: ['test'],
        },
      },
      header: {
        ...headerProps,
        groupable: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-group').classes()).toContain(
      'grouped'
    )
  })

  it('verify the click on sort icon', async () => {
    expect.hasAssertions()

    wrapper.vm.setGroupBy = setGroupByMock
    wrapper.find('.customHeader-actions-group').trigger('click')
    await wrapper.vm.$nextTick()

    expect(setGroupByMock).toHaveBeenCalledWith({
      ...headerProps,
      groupable: true,
    })
  })

  it('verify the return value from getHeaderGroup', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          groupBy: [],
        },
      },
      header: {
        ...headerProps,
        groupable: true,
      },
    })
    await wrapper.vm.$nextTick()

    const responseExpectToBeFalse = wrapper.vm.getHeaderGroup(headerProps)

    expect(responseExpectToBeFalse).toStrictEqual({ grouped: false })

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          groupBy: ['test'],
        },
      },
      header: {
        ...headerProps,
        groupable: true,
      },
    })
    await wrapper.vm.$nextTick()

    const responseExpectToBeTrue = wrapper.vm.getHeaderGroup(headerProps)

    expect(responseExpectToBeTrue).toStrictEqual({ grouped: true })
  })

  it('verify the return value from getHeaderSort', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          sortBy: [],
          sortDesc: [],
        },
      },
      header: {
        ...headerProps,
        sortable: true,
      },
    })
    await wrapper.vm.$nextTick()

    const responseExpectToBeFalse = wrapper.vm.getHeaderSort(headerProps)

    expect(responseExpectToBeFalse).toStrictEqual({
      desc: false,
      sorted: false,
      index: '',
    })

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          sortBy: ['test'],
          sortDesc: [true],
        },
      },
      header: {
        ...headerProps,
        sortable: true,
      },
    })
    await wrapper.vm.$nextTick()

    const responseExpectToBeTrue = wrapper.vm.getHeaderSort(headerProps)

    expect(responseExpectToBeTrue).toStrictEqual({
      desc: true,
      sorted: true,
      index: 1,
    })
  })
})
