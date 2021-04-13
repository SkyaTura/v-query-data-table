import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import TableDrawer from '@/components/VQueryDataTable/TableDrawer.vue'
import Vuetify from 'vuetify'

describe('TableDrawer.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  const props = {
    fetch: {},
    items: {},
    query: {
      filter: '',
    },
    filter: {
      drawer: true,
      operator: ',',
      items: {},
      values: {},
      loading: {},
    },
    headers: [
      {
        text: "Ações",
        value: "_actions",
        $extra: { filterable: false }
      },
      {
        text: "Dessert (100g serving)",
        value: "name",
        $extra: {}
      },
      {
        text: "Tipo",
        value: "kind",
        $extra: {
          visible: false,
          transformItem: {
            hot: "Quente",
            room_temperature: "Temperatura Ambiente",
            cold: "Gelado"
          }
        }
      },
      {
        text: "Calories",
        value: "calories",
        $extra: {
          filterType: "range"
        },
      },
      {
        text: "Fat (g)",
        value: "fat",
        $extra: { filterable: false }
      },
      {
        text: "Carbs (g)",
        value: "carbs",
        $extra: {}
      },
    ]
  }

  beforeAll(() => {
    const vuetify = new Vuetify()
    const localVue = createLocalVue()
    localVue.use(Vuetify)
    document.body.setAttribute('data-app', 'true')

    wrapper = mount(TableDrawer, {
      vuetify,
      localVue,
      propsData: {
        options: { ...props },
      },
    })
  })

  it('verify filter operator value', async () => {
    expect(wrapper.vm.options.filter.operator).toEqual(',')

    const radios = wrapper.findAllComponents({ name: 'v-radio' })
    const radio1 = radios.at(0)
    const radio2 = radios.at(1)

    await radio2.vm.$emit('change')
    expect(wrapper.vm.options.filter.operator).toEqual(';')

    await radio1.vm.$emit('change')
    expect(wrapper.vm.options.filter.operator).toEqual(',')
  })

  it('verify showing condition of range slider', async () => {
    expect(wrapper.findComponent({ name: 'v-range-slider' }).exists()).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        headers: [
          {
            text: "Ações",
            value: "_actions",
            $extra: { filterable: false }
          },
          {
            text: "Dessert (100g serving)",
            value: "name",
            $extra: {}
          },
          {
            text: "Tipo",
            value: "kind",
            $extra: {
              visible: false,
              transformItem: {
                hot: "Quente",
                room_temperature: "Temperatura Ambiente",
                cold: "Gelado"
              }
            }
          },
        ]
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-range-slider' }).exists()).toBeFalsy()
  })

  it('verify showing condition of autocompletes', async () => {
    wrapper.setProps({ options: { ...props } })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findAllComponents({ name: 'v-autocomplete' }).length).toBe(3)
  })

  it('verify click on clear filters', async () => {
    wrapper.vm.options.filter.values = { name: 'ice cream' }

    wrapper.findComponent({ name: 'v-btn' }).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.filter.values).toEqual({})
  })
})