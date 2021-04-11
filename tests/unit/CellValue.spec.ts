import { shallowMount, Wrapper } from '@vue/test-utils'
import CellValue from '@/components/VQueryDataTable/CellValue.vue'
import Vuetify from 'vuetify'

describe('CellValue.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const properties = {
    value: 'Teste'
  }
  const headerProps = {
    value: 'test',
    $custom: {
      template: ''
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(CellValue, {
      vuetify,
      propsData: {
        options: {},
        props: {
          ...properties
        },
        header: {
          ...headerProps,
        }
      },
    })
  })

  it('verify showing condition of SingleActions', async () => {
    wrapper.setProps({
      props: {
        ...properties
      },
      header: {
        ...headerProps,
        value: '_actions'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'SingleActions' }).exists()).toBeTruthy()
  })

  it('verify showing condition of CellAvatar', async () => {
    wrapper.setProps({
      props: {
        ...properties
      },
      header: {
        ...headerProps,
        $custom: {
          template: 'avatar'
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'CellAvatar' }).exists()).toBeTruthy()
  })

  it('verify showing condition of CellChip', async () => {
    wrapper.setProps({
      props: {
        ...properties
      },
      header: {
        ...headerProps,
        $custom: {
          template: 'chips'
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'CellChip' }).exists()).toBeTruthy()
  })

  it('verify showing condition of default text', async () => {
    wrapper.setProps({
      props: {
        ...properties
      },
      header: {
        ...headerProps,
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toEqual('<td>Teste</td>')
  })
})