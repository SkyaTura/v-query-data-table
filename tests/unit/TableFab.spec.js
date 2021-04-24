import { createLocalVue, mount } from '@vue/test-utils'
import TableFab from '@/components/VQueryDataTable/TableFab.vue'
import Vuetify from 'vuetify'

describe('tableFab.vue', () => {
  let wrapper

  const props = {
    tableActions: {
      add: {
        icon: 'add',
        text: 'Novo item',
        fab: true,
        color: 'primary',
      },
    },
    hideTableFAB: false,
    hideAllActions: false,
    loading: {
      active: false,
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()
    const localVue = createLocalVue()
    localVue.use(Vuetify)
    document.body.setAttribute('data-app', 'true')

    wrapper = mount(TableFab, {
      vuetify,
      localVue,
      propsData: {
        options: {
          ...props,
        },
      },
      stubs: {
        transition: true,
      },
    })
  })

  it('should exists when a tableAction have fab propertie equal true', async () => {
    expect.hasAssertions()
    expect(wrapper.findComponent({ name: 'v-tooltip' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          add: {
            icon: 'add',
            text: 'Novo item',
            fab: false,
            color: 'primary',
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-tooltip' }).exists()).toBeFalsy()
  })

  it('button should exists when hideTableFAB is false', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        hideTableFAB: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-btn' }).isVisible()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-btn' }).isVisible()).toBeTruthy()
  })

  // eslint-disable-next-line jest/no-done-callback
  it('tooltip text should be equal to tableAction text', async (done) => {
    expect.hasAssertions()

    wrapper.findComponent({ name: 'v-btn' }).trigger('mouseenter')
    await wrapper.vm.$nextTick()

    requestAnimationFrame(() => {
      expect(wrapper.find('#tooltipText').text()).toStrictEqual('Novo item')

      done()
    })
  })

  it('should emit action-table-add when button is clicked', async () => {
    expect.hasAssertions()
    expect(wrapper.emitted()).not.toHaveProperty('action-table-add')

    wrapper.findComponent({ name: 'v-btn' }).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-table-add')).toBeTruthy()
  })

  it('icon should be equal to tableAction icon', () => {
    expect.hasAssertions()
    expect(wrapper.findComponent({ name: 'v-icon' }).text()).toStrictEqual(
      'add'
    )
  })

  it('fab should return icon and text of tableActions with fab propertie equal true', () => {
    expect.hasAssertions()

    const actions = {
      add: {
        icon: 'add',
        text: 'Novo item',
        fab: true,
        color: 'primary',
      },
      remove: {
        icon: 'delete',
        text: 'Excluir item',
        fab: true,
        color: 'primary',
      },
    }

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          ...actions,
        },
      },
    })

    expect(wrapper.vm.fab[0]).toStrictEqual('add')
    expect(wrapper.vm.fab[1]).toStrictEqual(actions.add)
  })
})
