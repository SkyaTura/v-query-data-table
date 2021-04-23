import { shallowMount } from '@vue/test-utils'
import CellChip from '@/components/VQueryDataTable/CellChip.vue'
import Vuetify from 'vuetify'

describe('cellChip.vue', () => {
  let wrapper

  const properties = {
    header: {
      value: 'name',
    },
    item: {
      name: 'Teste Nome',
    },
    value: 'Teste Nome',
  }

  const optionsProps = {}

  const headerProps = {
    value: 'Nome',
    text: 'name',
    $custom: {
      template: 'chips',
    },
  }

  beforeAll(() => {
    const vuetify = new Vuetify()

    wrapper = shallowMount(CellChip, {
      vuetify,
      propsData: {
        options: {
          ...optionsProps,
        },
        props: {
          ...properties,
        },
        header: {
          ...headerProps,
        },
      },
    })
  })

  it('text of chip should be igual to props.value', () => {
    expect.hasAssertions()
    expect(wrapper.findComponent({ name: 'v-chip' }).text()).toBe(
      properties.value
    )
  })

  it('computed color should be equal to color set on $custom even with color is a function', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.color).toBeUndefined()

    wrapper.setProps({
      options: { ...optionsProps },
      props: { ...properties },
      header: {
        ...headerProps,
        $custom: {
          template: 'chips',
          color: () => {
            return 'green'
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.color).toBe('green')

    wrapper.setProps({
      options: { ...optionsProps },
      props: { ...properties },
      header: {
        ...headerProps,
        $custom: {
          template: 'chips',
          color: 'blue',
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.color).toBe('blue')
  })

  it('computed text should return value set on props.value, and change according to $custom.format', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.text).toBe(properties.value)

    wrapper.setProps({
      options: { ...optionsProps },
      props: { ...properties },
      header: {
        ...headerProps,
        $custom: {
          template: 'chips',
          format: (value, _) => {
            return value.toUpperCase()
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.text).toBe('TESTE NOME')
  })

  it('computed attrs should return the value set on $custom.color or undefined', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.attrs).toStrictEqual({ small: true, color: undefined })

    wrapper.setProps({
      options: { ...optionsProps },
      props: { ...properties },
      header: {
        ...headerProps,
        $custom: {
          template: 'chips',
          color: 'blue',
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.attrs).toStrictEqual({ small: true, color: 'blue' })
  })
})
