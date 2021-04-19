import { shallowMount } from '@vue/test-utils'
import VQueryDataTable from '@/components/VQueryDataTable/VQueryDataTable.vue'

describe('vQueryDataTable.vue', () => {
  it('verify if VQueryDataTable exists', () => {
    expect.hasAssertions()

    const wrapper = shallowMount(VQueryDataTable, {
      propsData: {
        headers: [],
      },
    })

    expect(wrapper.exists()).toBeTruthy()
  })
})
