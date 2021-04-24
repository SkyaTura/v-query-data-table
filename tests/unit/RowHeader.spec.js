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

  it('header text should be equal to header.value', () => {
    expect.hasAssertions()
    expect(wrapper.find('.customHeader-text').text()).toBe('Teste')
  })

  it('sort icon should exists when header.sortable is true', async () => {
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

  it('sort icon should has sorted class when sortBy contains header.value', async () => {
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

  it('group icon should exists when header.sortable is true', async () => {
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

  it('group icon should has grouped class when groupBy contains header.value', async () => {
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

  it('setGroupBy should be called when group icon is clicked', async () => {
    expect.hasAssertions()

    wrapper.vm.setGroupBy = setGroupByMock
    wrapper.find('.customHeader-actions-group').trigger('click')
    await wrapper.vm.$nextTick()

    expect(setGroupByMock).toHaveBeenCalledWith({
      ...headerProps,
      groupable: true,
    })
  })

  it('getHeaderGroup should return true when groupable is true, and groupBy contains header.value', async () => {
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

  it('getHeaderSort should return desc and sorted true when sortBy is equal to header.value and sortDesc is true', async () => {
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
