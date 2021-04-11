import { mount, Wrapper } from '@vue/test-utils'
import BulkActions from '@/components/VQueryDataTable/BulkActions.vue'
import Vuetify from 'vuetify'

describe('BulkActions.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    values: {
      selected: [1, 2],
    },
    bulkActions: {
      remove: {
        icon: "delete",
        text: "Excluir"
      }
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = mount(BulkActions, {
      vuetify,
      propsData: {
        options: {
          ...props
        }
      },
    })
  })

  it('verify its showing condition', async () => {
    expect(wrapper.find('[aria-expanded=true]').exists()).toBeTruthy()

    const vuetify = new Vuetify()
    const component = mount(BulkActions, {
      vuetify,
      propsData: {
        options: {
          ...props,
          values:{
            selected: []
          }
        }
      }
    })

    expect(component.find('[aria-expanded=false]').exists()).toBeTruthy()
  })

  it('verify the message for selected items', async () => {
    expect(wrapper.find('.caption').text()).toBe("Ações em massa para os 2 itens selecionados:")

    wrapper.setProps({
      options: {
        ...props,
        values: {
          selected: [1, 2, 3]
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.caption').text()).toBe("Ações em massa para os 3 itens selecionados:")
  })

  it('verify the message for a selected item', async () => {
    wrapper.setProps({
      options: {
        ...props,
        values: {
          selected: [1]
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.caption').text()).toBe("Ações para o item selecionado:")
  })

  it('verify the showing of bulk actions buttons', async () => {
    expect(wrapper.findAllComponents({ name: 'v-btn' }).length).toBe(1)

    wrapper.setProps({
      options: {
        ...props,
        bulkActions: {
          remove: {
            icon: "delete",
            text: "Excluir"
          },
          edit: {
            icon: "edit",
            text: "Editar"
          }
        },
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'v-btn' }).length).toBe(2)
  })

  it('verify the emitted function when bulk action is clicked', async () => {
    expect(wrapper.emitted()).not.toHaveProperty('action-bulk-remove')

    const btns = wrapper.findAllComponents({ name: 'v-btn' })
    const deleteButton = btns.at(0)

    deleteButton.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('action-bulk-remove')).toBeTruthy()
    expect(wrapper.emitted('action-bulk-remove')).toEqual([[props.values.selected]])
  })

  it('verify the exhibition of button icon', async () => {
    wrapper.setProps({
      options: {
        ...props,
        bulkActions: {
          remove: {
            icon: "delete",
            text: "Excluir"
          },
        },
      }
    })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findAllComponents({ name: 'v-icon' }).length).toBe(1)

    wrapper.setProps({
      options: {
        ...props,
        bulkActions: {
          remove: {
            text: "Excluir"
          },
        },
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'v-icon' }).length).toBe(0)
  })
})