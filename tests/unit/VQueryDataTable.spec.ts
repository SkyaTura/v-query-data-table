import { shallowMount, Wrapper } from '@vue/test-utils'
import VQueryDataTable from '@/components/VQueryDataTable/VQueryDataTable.vue'

describe('VQueryDataTable.vue', () => {
  let wrapper: Wrapper<Vue & { [key: string]: any }>

  beforeAll(() => {
    wrapper = shallowMount(VQueryDataTable, {
      propsData: {
        headers: []
      }
    })
  })

  it('show skeleton when app is loading', async () => {
    wrapper.setData({
      loading: {
        active: true,
        firstTime: true,
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-skeleton-loader' }).exists()).toBe(true)
  })

  it('show table when app is not loading', async () => {
    wrapper.setData({
      loading: {
        active: false,
        firstTime: false,
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'v-card' }).classes('VQueryDataTable')).toBe(true)
  })

  it('show description when its not empty', async() => {
    wrapper.setData({
      loading: {
        active: false,
        firstTime: false,
      }
    })
    wrapper.setProps({
      description: 'Teste'
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('p').text()).toBe('Teste')
  })
})
