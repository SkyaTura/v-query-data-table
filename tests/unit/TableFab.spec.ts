import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import TableFab from '@/components/VQueryDataTable/TableFab.vue'
import Vuetify from 'vuetify'

describe('TableFab.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    tableActions: {
      add: {
        icon: 'add',
        text: 'Novo item',
        fab: true,
        color: 'primary'
      },
    },
    hideTableFAB: false,
    hideAllActions: false,
    loading: {
      active: false,
    }
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
          ...props
        }
      },
      stubs: {
        transition: true,
      },
    })
  })

  it('verify its showing condition', async () => {
    expect(wrapper.findComponent({ name: 'v-tooltip' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          add: {
            icon: 'add',
            text: 'Novo item',
            fab: false,
            color: 'primary'
          }
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-tooltip' }).exists()).toBeFalsy()
  })

  it("verify the button's condition of exhibition", async () => {
    wrapper.setProps({
      options: {
        ...props,
        hideTableFAB: true
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'v-btn' }).isVisible()).toBeFalsy()

    wrapper.setProps({
      options: {
        ...props
      }
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent({ name: 'v-btn' }).isVisible()).toBeTruthy()
  })

  it('verify the text on tooltip', async (done) => {
    wrapper.findComponent({ name: 'v-btn' }).trigger('mouseenter')
    await wrapper.vm.$nextTick()

    requestAnimationFrame(() => {
      expect(wrapper.find('#tooltipText').text()).toEqual('Novo item')
      done()
    })
  })

  it('verify the emitted function on button click', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('action-table-add')

    wrapper.findComponent({ name: 'v-btn' }).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-table-add')).toBeTruthy()
  })

  it('verify the showed icon', () => {
    expect(wrapper.findComponent({ name: 'v-icon' }).text()).toEqual('add')
  })

  it('verify the return of fab', () => {
    const actions = {
      add: {
        icon: 'add',
        text: 'Novo item',
        fab: true,
        color: 'primary'
      },
      remove: {
        icon: 'delete',
        text: 'Excluir item',
        fab: true,
        color: 'primary'
      }
    }

    wrapper.setProps({
      options: {
        ...props,
        tableActions: {
          ...actions
        }
      }
    })
    
    expect(wrapper.vm.fab[0]).toEqual('add')
    expect(wrapper.vm.fab[1]).toEqual(actions.add)
  })
})