import { createLocalVue, mount } from '@vue/test-utils'
import { mdiDotsHorizontal } from '@mdi/js'
import SingleActions from '@/components/VQueryDataTable/SingleActions.vue'
import Vuetify from 'vuetify'

describe('singleActions.vue', () => {
  let wrapper

  const optionsProps = {
    hideTableActions: false,
    hideAllActions: false,
    singleActions: {
      modify: {
        icon: 'edit',
        text: 'Editar',
        quick: true,
      },
      remove: {
        icon: 'delete',
        text: 'Remover',
      },
    },
  }
  const payloadProps = {
    value: 'test',
  }

  beforeAll(() => {
    const vuetify = new Vuetify()
    const localVue = createLocalVue()
    localVue.use(Vuetify)
    document.body.setAttribute('data-app', 'true')

    wrapper = mount(SingleActions, {
      localVue,
      vuetify,
      propsData: {
        options: {
          ...optionsProps,
        },
        payload: {
          ...payloadProps,
        },
      },
      data() {
        return {
          icons: {
            mdiDotsHorizontal,
          },
        }
      },
    })
  })

  it('quick actions should exists when quick propertie is false', async () => {
    expect.hasAssertions()
    expect(wrapper.findAllComponents({ name: 'v-btn' }).at(0).text()).toBe(
      'edit'
    )

    wrapper.setProps({
      payload: { ...payloadProps },
      options: {
        ...optionsProps,
        singleActions: {
          modify: {
            icon: 'edit',
            text: 'Editar',
          },
          remove: {
            icon: 'delete',
            text: 'Remover',
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'v-btn' }).at(0).text()).not.toBe(
      'edit'
    )
  })

  it('should emit action-single-modify when quick action edit is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      payload: { ...payloadProps },
      options: { ...optionsProps },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-single-modify')).toBeFalsy()

    wrapper.findComponent({ name: 'v-btn' }).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-single-modify')).toBeTruthy()
  })

  it('actions should not exists when hideTableActions is true', async () => {
    expect.hasAssertions()

    wrapper.findAllComponents({ name: 'v-btn' }).at(1).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-list-item' }).exists()).toBeTruthy()

    wrapper.setProps({
      payload: { ...payloadProps },
      options: {
        ...optionsProps,
        hideTableActions: true,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-list-item' }).exists()).toBeFalsy()
  })

  it('should emit action-single-remove when delete action is clicked', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      payload: { ...payloadProps },
      options: { ...optionsProps },
    })
    await wrapper.vm.$nextTick()

    wrapper.findAllComponents({ name: 'v-btn' }).at(1).trigger('click')
    await wrapper.vm.$nextTick()

    const listItems = wrapper.findAllComponents({ name: 'v-list-item' })
    const removeItem = listItems.at(1)

    expect(wrapper.emitted('action-single-remove')).toBeFalsy()

    removeItem.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('action-single-remove')).toBeTruthy()
  })
})
