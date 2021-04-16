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

  it('verify return value of filterableHeaders', () => {
    expect(wrapper.vm.filterableHeaders).toEqual([
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
        text: "Carbs (g)",
        value: "carbs",
        $extra: {}
      },
    ])
  })

  it('verify return value of sortFilterItems', async () => {
    wrapper.setProps({
      options: {
        ...props,
        filter: {
          ...props.filter,
          items: {
            kind: [
              { count: 1, value: 'room_temperature' },
              { count: 2, value: 'cold' },
              { count: 3, value: 'hot' },
            ]
          },
          values: {
            kind: ['room_temperature', 'cold']
          },
        }
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.sortFilterItems).toEqual({
      kind: [
        { count: 2, value: 'cold', text: 'cold' },
        { count: 1, value: 'room_temperature', text: 'room_temperature' },
        { count: 3, value: 'hot', text: 'hot' },
      ]
    })
  })

  it('verify return value of autocomplete', () => {
    const response = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' }, 
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
      })
    expect(response).toEqual('Gelado')

    const response2 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' }, 
      {
        text: "Tipo",
        value: "kind",
        $extra: {
          visible: false,
          transformItem: {
            hot: "Quente",
            room_temperature: "Temperatura Ambiente",
            cold: () => 'Gelado'.toUpperCase()
          }
        }
      })
    expect(response2).toEqual('GELADO')

    const response3 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' }, 
      {
        text: "Tipo",
        value: "kind",
        $extra: {
          visible: false,
          transformItem: () => 'Teste'
        }
      })
    expect(response3).toEqual('Teste')

    const response4 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' }, 
      {
        text: "Tipo",
        value: "kind",
        $extra: {
          visible: false,
        }
      })
    expect(response4).toEqual('cold')
  })

  it('verify return value of getFieldMin', async () => {
    expect(wrapper.vm.getFieldMin('calories')).toEqual(0)

    wrapper.setProps({
      options: {
        ...props,
        filter: {
          ...props.filter,
          items: {
            calories: [
              { count: 1, value: 200 },
              { count: 2, value: 400 },
              { count: 3, value: 300 },
            ]
          }
        }
      }
    })
    await wrapper.vm.$nextTick()

    const response = wrapper.vm.getFieldMin('calories')
    expect(response).toEqual(200)
  })

  it('verify return value of getFieldMax', async () => {
    const response = wrapper.vm.getFieldMax('calories')
    expect(response).toEqual(400)

    wrapper.setProps({
      options: { ...props }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getFieldMax('calories')).toEqual(0)
  })
})