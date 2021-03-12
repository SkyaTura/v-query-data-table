import { shallowMount } from '@vue/test-utils'
import VQueryDataTable from '@/components/VQueryDataTable/VQueryDataTable.vue'

describe('VQueryDataTable.vue', () => {
  it('verify if VQueryDataTable exists', () => {
    const wrapper = shallowMount(VQueryDataTable, {
      propsData: {
        headers: []
      }
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})
