import { createLocalVue, mount } from '@vue/test-utils'
import GroupHeader from '@/components/VQueryDataTable/GroupHeader.vue'
import Vuetify from 'vuetify'

describe('RowHeader.vue', () => {
  let wrapper

  const props = {
    hideRowGroupExpansion: false,
    hideRowGroupClose: false,
    query: {
      sortBy: [],
      sortDesc: [],
      groupBy: ['test'],
      groupDesc: [],
    },
    headers: [
      {
        text: 'Ações',
        value: '_actions',
      },
      {
        text: 'Teste',
        value: 'test',
        sortable: true,
      },
      {
        text: 'Teste 2',
        value: 'test2',
        sortable: true,
      },
    ],
  }

  const removeMock = jest.fn()
  const toggleMock = jest.fn()

  const groupProps = {
    group: 1,
    groupBy: ['test'],
    isOpen: true,
    remove: removeMock,
    toggle: toggleMock,
  }

  beforeAll(() => {
    const vuetify = new Vuetify()
    const localVue = createLocalVue()
    localVue.use(Vuetify)
    document.body.setAttribute('data-app', 'true')

    wrapper = mount(GroupHeader, {
      vuetify,
      localVue,
      propsData: {
        options: {
          ...props,
        },
        props: {
          ...groupProps,
        },
      },
    })
  })

  it('verify group header text', () => {
    expect(wrapper.findAll('span').at(0).text()).toBe('Teste:\u00A01')
  })

  it('verify showing condition of icons', async () => {
    wrapper.setProps({
      options: {
        ...props,
        hideRowGroupExpansion: true,
        hideRowGroupClose: true,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeTruthy()
  })

  it('verify showing condition of sort icon', async () => {
    wrapper.setProps({
      options: {
        ...props,
        headers: [
          {
            text: 'Ações',
            value: '_actions',
          },
          {
            text: 'Teste',
            value: 'test',
            sortable: false,
          },
          {
            text: 'Teste 2',
            value: 'test2',
            sortable: true,
          },
        ],
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').exists()).toBeTruthy()
  })

  it('verify class of sort icon', async () => {
    expect(wrapper.find('.customHeader-actions-sort').classes()).not.toContain(
      'sorted'
    )

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          sortBy: ['test'],
        },
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.customHeader-actions-sort').classes()).toContain(
      'sorted'
    )
  })

  it('verify class of sort icon', async () => {
    expect(
      wrapper.findAllComponents({ name: 'v-icon' }).at(0).classes()
    ).not.toContain('invertable-inverted')

    wrapper.setProps({
      options: {
        ...props,
        query: {
          ...props.query,
          sortBy: ['test'],
          sortDesc: [true],
        },
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findAllComponents({ name: 'v-icon' }).at(0).classes()
    ).toContain('invertable-inverted')
  })

  it('verify click on close icon', async () => {
    wrapper.findAllComponents({ name: 'v-btn' }).at(1).trigger('click')
    await wrapper.vm.$nextTick()

    expect(removeMock).toHaveBeenCalled()
  })

  it('verify click on close icon', async () => {
    expect(wrapper.findAllComponents({ name: 'v-tooltip' }).length).toBe(3)

    wrapper.setProps({
      options: {
        ...props,
        hideRowGroupExpansion: true,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'v-tooltip' }).length).toBe(2)
  })

  it('verify click on close icon', async (done) => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    wrapper.findAllComponents({ name: 'v-btn' }).at(2).trigger('mouseenter')
    await wrapper.vm.$nextTick()

    requestAnimationFrame(() => {
      const spans = wrapper.findAll('span')
      expect(spans.at(spans.length - 2).text()).toEqual('Recolher')
      done()
    })
  })

  it('verify click on close icon when isOpen is false', async (done) => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
        isOpen: false,
      },
    })
    await wrapper.vm.$nextTick()

    wrapper.findAllComponents({ name: 'v-btn' }).at(2).trigger('mouseenter')
    await wrapper.vm.$nextTick()

    requestAnimationFrame(() => {
      const spans = wrapper.findAll('span')
      expect(spans.at(spans.length - 2).text()).toEqual('Expandir')
      done()
    })
  })

  it('verify click on expand icon', async () => {
    wrapper.findAllComponents({ name: 'v-btn' }).at(2).trigger('click')
    await wrapper.vm.$nextTick()

    expect(toggleMock).toHaveBeenCalled()
  })

  it('verify class of expand icon', async () => {
    expect(
      wrapper.findAllComponents({ name: 'v-icon' }).at(2).classes()
    ).not.toContain('invertable-inverted')

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
        isOpen: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findAllComponents({ name: 'v-icon' }).at(2).classes()
    ).toContain('invertable-inverted')
  })

  it('verify the return value from groupHeader', async () => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.groupHeader).toEqual({
      text: 'Teste',
      value: 'test',
      sortable: true,
    })
  })

  it('verify the return value from groupHeaderSort', async () => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.groupHeaderSort).toEqual({
      desc: false,
      sorted: false,
      index: '',
    })
  })

  it('verify the return value from getGroupHeader', async () => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getGroupHeader(groupProps)).toEqual({
      text: 'Teste',
      key: 'Teste',
      value: 1,
    })
  })

  it('verify the result of sortGroupHeader', async () => {
    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    wrapper.vm.sortGroupHeader()
    expect(wrapper.vm.$props.options.query).toEqual({
      sortBy: ['test'],
      sortDesc: [false],
      groupBy: ['test'],
      groupDesc: [],
    })

    wrapper.vm.sortGroupHeader()
    expect(wrapper.vm.$props.options.query).toEqual({
      sortBy: ['test'],
      sortDesc: [true],
      groupBy: ['test'],
      groupDesc: [],
    })

    wrapper.vm.sortGroupHeader()
    expect(wrapper.vm.$props.options.query).toEqual({
      sortBy: [],
      sortDesc: [],
      groupBy: ['test'],
      groupDesc: [],
    })
  })
})
