import { createLocalVue, mount } from '@vue/test-utils'
import GroupHeader from '@/components/VQueryDataTable/GroupHeader.vue'
import Vuetify from 'vuetify'

describe('groupHeader.vue', () => {
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

  it('span should be equal to text of header which is grouped', () => {
    expect.hasAssertions()
    expect(wrapper.findAll('span').at(0).text()).toBe('Teste:\u00A01')
  })

  it('icons should exists when hideRowGroupExpansion and hideRowGroupClose are false', async () => {
    expect.hasAssertions()

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

  it('sort icon should exists when header which is sorted has property sortable true', async () => {
    expect.hasAssertions()

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

  it('sort icon should have sorted class when header is sorted', async () => {
    expect.hasAssertions()
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

  it('sort icon should have invertable-inverted class when sortDesc is true', async () => {
    expect.hasAssertions()
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

  it('remove function should be called when button is clicked', async () => {
    expect.hasAssertions()

    wrapper.findAllComponents({ name: 'v-btn' }).at(1).trigger('click')
    await wrapper.vm.$nextTick()

    expect(removeMock).toHaveBeenCalledTimes(1)
  })

  it('close icon should exists when hideRowGroupExpansion is false', async () => {
    expect.hasAssertions()
    expect(wrapper.findAllComponents({ name: 'v-tooltip' })).toHaveLength(3)

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

    expect(wrapper.findAllComponents({ name: 'v-tooltip' })).toHaveLength(2)
  })

  // eslint-disable-next-line jest/no-done-callback
  it('tooltip on close icon should be Recolher when isOpen is true', async (done) => {
    expect.hasAssertions()

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

      expect(spans.at(spans.length - 2).text()).toStrictEqual('Recolher')

      done()
    })
  })

  // eslint-disable-next-line jest/no-done-callback
  it('tooltip on close icon should be Expandir when isOpen is false', async (done) => {
    expect.hasAssertions()

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

      expect(spans.at(spans.length - 2).text()).toStrictEqual('Expandir')

      done()
    })
  })

  it('toggle function should be called when button is clicked', async () => {
    expect.hasAssertions()

    wrapper.findAllComponents({ name: 'v-btn' }).at(2).trigger('click')
    await wrapper.vm.$nextTick()

    expect(toggleMock).toHaveBeenCalledTimes(1)
  })

  it('expand icon should have invertable-inverted class when isOpen is true', async () => {
    expect.hasAssertions()
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

  it('computed groupHeader should return the values of header which is grouped', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.groupHeader).toStrictEqual({
      text: 'Teste',
      value: 'test',
      sortable: true,
    })
  })

  it('groupHeaderSort should return the desc: false, sorted: false, and empty index to default props config', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.groupHeaderSort).toStrictEqual({
      desc: false,
      sorted: false,
      index: '',
    })
  })

  it('computed getGroupHeader should return text: Teste, key: Teste, value: 1 to default props config', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
      },
      props: {
        ...groupProps,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getGroupHeader(groupProps)).toStrictEqual({
      text: 'Teste',
      key: 'Teste',
      value: 1,
    })
  })

  it('query should change to certain values when sortGroupHeader is called', async () => {
    expect.hasAssertions()

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

    expect(wrapper.vm.$props.options.query).toStrictEqual({
      sortBy: ['test'],
      sortDesc: [false],
      groupBy: ['test'],
      groupDesc: [],
    })

    wrapper.vm.sortGroupHeader()

    expect(wrapper.vm.$props.options.query).toStrictEqual({
      sortBy: ['test'],
      sortDesc: [true],
      groupBy: ['test'],
      groupDesc: [],
    })

    wrapper.vm.sortGroupHeader()

    expect(wrapper.vm.$props.options.query).toStrictEqual({
      sortBy: [],
      sortDesc: [],
      groupBy: ['test'],
      groupDesc: [],
    })
  })
})
