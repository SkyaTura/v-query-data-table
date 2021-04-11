import { shallowMount, Wrapper } from '@vue/test-utils'
import CellAvatar from '@/components/VQueryDataTable/CellAvatar.vue'
import Vuetify from 'vuetify'

describe('CellAvatar.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const properties = {
    header: {
      value: 'avatar'
    },
    item: {
      avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
      name: 'Teste Nome'
    },
    value: 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
  }

  const optionsProps = {
    dense: false
  }

  const headerProps = {
    value: 'avatar',
    text: 'Avatar',
    $custom: {
      template: 'avatar'
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(CellAvatar, {
      vuetify,
      propsData: {
        options: {
          ...optionsProps,
        },
        props: {
          ...properties
        },
        header: {
          ...headerProps,
        }
      },
    })
  })

  it('verify showing of image', () => {
    expect(wrapper.findComponent({ name: 'v-img' }).attributes('src')).toBe(properties.value)
  })

  it('verify return of computed image', async () => {
    expect(wrapper.vm.image).toBe(properties.value)

    wrapper.setProps({
      options: { ...optionsProps },
      props: { ...properties },
      header: { 
        ...headerProps,
        $custom: {
          template: 'avatar',
          format: () => {
            return 'https://cdn.vuetifyjs.com/images/lists/2.jpg'
          }
        },
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.image).toBe('https://cdn.vuetifyjs.com/images/lists/2.jpg')
  })

  it('verify return of computed attrs', async () => {
    expect(wrapper.vm.attrs).toEqual({ size: 48 })

    wrapper.setProps({
      props: { ...properties },
      header: { ...headerProps },
      options: {
        ...optionsProps,
        dense: true
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.attrs).toEqual({ size: 32 })
  })
})