import { createLocalVue, mount } from '@vue/test-utils'
import TableDrawer from '@/components/VQueryDataTable/TableDrawer.vue'
import Vuetify from 'vuetify'

describe('tableDrawer.vue', () => {
  let wrapper

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
        text: 'Ações',
        value: '_actions',
        $extra: { filterable: false },
      },
      {
        text: 'Dessert (100g serving)',
        value: 'name',
        $extra: {},
      },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          transformItem: {
            hot: 'Quente',
            room_temperature: 'Temperatura Ambiente',
            cold: 'Gelado',
          },
        },
      },
      {
        text: 'Calories',
        value: 'calories',
        $extra: {
          filterType: 'range',
        },
      },
      {
        text: 'Fat (g)',
        value: 'fat',
        $extra: { filterable: false },
      },
      {
        text: 'Carbs (g)',
        value: 'carbs',
        $extra: {},
      },
    ],
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

  it('filter.operator should change value when radio button is clicked', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.options.filter.operator).toStrictEqual(',')

    const radios = wrapper.findAllComponents({ name: 'v-radio' })
    const radio1 = radios.at(0)
    const radio2 = radios.at(1)

    await radio2.vm.$emit('change')

    expect(wrapper.vm.options.filter.operator).toStrictEqual(';')

    await radio1.vm.$emit('change')

    expect(wrapper.vm.options.filter.operator).toStrictEqual(',')
  })

  it('v-range-slider should exists if a header have filterType equal to range', async () => {
    expect.hasAssertions()
    expect(
      wrapper.findComponent({ name: 'v-range-slider' }).exists()
    ).toBeTruthy()

    wrapper.setProps({
      options: {
        ...props,
        headers: [
          {
            text: 'Ações',
            value: '_actions',
            $extra: { filterable: false },
          },
          {
            text: 'Dessert (100g serving)',
            value: 'name',
            $extra: {},
          },
          {
            text: 'Tipo',
            value: 'kind',
            $extra: {
              visible: false,
              transformItem: {
                hot: 'Quente',
                room_temperature: 'Temperatura Ambiente',
                cold: 'Gelado',
              },
            },
          },
        ],
      },
    })
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findComponent({ name: 'v-range-slider' }).exists()
    ).toBeFalsy()
  })

  it('should have 3 v-autocomplete to default props config', async () => {
    expect.hasAssertions()

    wrapper.setProps({ options: { ...props } })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAllComponents({ name: 'v-autocomplete' })).toHaveLength(
      3
    )
  })

  it('filter.values should be empty when clear filter button is clicked', async () => {
    expect.hasAssertions()

    wrapper.vm.options.filter.values = { name: 'ice cream' }

    wrapper.findComponent({ name: 'v-btn' }).trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.filter.values).toStrictEqual({})
  })

  it('verify return value of filterableHeaders', () => {
    expect.hasAssertions()
    expect(wrapper.vm.filterableHeaders).toStrictEqual([
      {
        text: 'Dessert (100g serving)',
        value: 'name',
        $extra: {},
      },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          transformItem: {
            hot: 'Quente',
            room_temperature: 'Temperatura Ambiente',
            cold: 'Gelado',
          },
        },
      },
      {
        text: 'Calories',
        value: 'calories',
        $extra: {
          filterType: 'range',
        },
      },
      {
        text: 'Carbs (g)',
        value: 'carbs',
        $extra: {},
      },
    ])
  })

  it('sortFilterItems should return on alphabetical order the values wich is filtered', async () => {
    expect.hasAssertions()

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
            ],
          },
          values: {
            kind: ['room_temperature', 'cold'],
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.sortFilterItems).toStrictEqual({
      kind: [
        { count: 2, value: 'cold', text: 'cold' },
        { count: 1, value: 'room_temperature', text: 'room_temperature' },
        { count: 3, value: 'hot', text: 'hot' },
      ],
    })
  })

  it('autocompleteItem should return value according to transformItem or text', () => {
    expect.hasAssertions()

    const response = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          transformItem: {
            hot: 'Quente',
            room_temperature: 'Temperatura Ambiente',
            cold: 'Gelado',
          },
        },
      }
    )

    expect(response).toStrictEqual('Gelado')

    const response2 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          transformItem: {
            hot: 'Quente',
            room_temperature: 'Temperatura Ambiente',
            cold: () => 'Gelado'.toUpperCase(),
          },
        },
      }
    )

    expect(response2).toStrictEqual('GELADO')

    const response3 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
          transformItem: () => 'Teste',
        },
      }
    )

    expect(response3).toStrictEqual('Teste')

    const response4 = wrapper.vm.autocompleteItem(
      { count: 2, value: 'cold', text: 'cold' },
      {
        text: 'Tipo',
        value: 'kind',
        $extra: {
          visible: false,
        },
      }
    )

    expect(response4).toStrictEqual('cold')
  })

  it('getFieldMin should return the min value of selected item', async () => {
    expect.hasAssertions()
    expect(wrapper.vm.getFieldMin('calories')).toStrictEqual(0)

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
            ],
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    const response = wrapper.vm.getFieldMin('calories')

    expect(response).toStrictEqual(200)
  })

  it('getFieldMax should return the max value of seleted item', async () => {
    expect.hasAssertions()

    const response = wrapper.vm.getFieldMax('calories')

    expect(response).toStrictEqual(400)

    wrapper.setProps({
      options: { ...props },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getFieldMax('calories')).toStrictEqual(0)
  })

  it('options.filter should return a string according to values filtered', async () => {
    expect.hasAssertions()

    wrapper.setProps({
      options: {
        ...props,
        filter: {
          ...props.filter,
          values: {
            kind: ['cold'],
            name: ['cupcake'],
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.query.filter).toStrictEqual(
      'name(cupcake),kind(cold)'
    )

    wrapper.setProps({
      options: {
        ...props,
        filter: {
          ...props.filter,
          operator: ';',
          values: {
            kind: ['cold'],
            name: ['cupcake'],
          },
        },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.options.query.filter).toStrictEqual(
      'name(cupcake);kind(cold)'
    )
  })
})
