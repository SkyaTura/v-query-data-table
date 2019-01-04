import merge from 'lodash.merge'
import pick from 'lodash.get'

export const namespaced = true

export const state = () => ({
  list: {},
})

export const getters = {
  getTable: state => key => state.list[key],
}

export const mutations = {
  TABLE_CREATE(state, { key, options }) {
    if (state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: options,
    }
  },
  TABLE_UPDATE(state, { key, options }) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: merge(state.list[key], options),
    }
  },
  TABLE_REMOVE(state, key) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: undefined,
    }
  },
  TABLE_SET_PAGINATION(state, { key, pagination }) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: merge(state.list[key], {
        query: { pagination },
      }),
    }
  },
  TABLE_SET_SEARCH(state, { key, searchString }) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: merge(state.list[key], {
        query: {
          searchString,
          pagination: { page: 1 },
        },
      }),
    }
  },
  TABLE_SET_LOADING(state, { key, loading }) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: merge(state.list[key], { loading }),
    }
  },
}

export const actions = {
  async fetch({ commit, getters }, { key }) {
    const table = getters.getTable(key)
    const { request, query, responseFields, responseTransform } = table
    const paramsToken = {
      post: 'data',
      get: 'params',
    }
    const queryPayload = {
      ...query.pagination,
      searchString: query.searchString,
    }
    const { data } = await this.$axios({
      ...request.options,
      url: request.endpoint,
      [request.queryType || paramsToken[request.options.method]]: queryPayload,
    })
    const transformedData = responseTransform ? responseTransform(data) : data
    const dataset = {
      items: pick(transformedData, responseFields.items),
      totalItems: pick(transformedData, responseFields.totalItems),
    }
    commit('TABLE_UPDATE', { key, options: { dataset } })
    return dataset
  },

  async query({ commit, dispatch }, { key }) {
    commit('TABLE_SET_LOADING', { key, loading: true })
    try {
      await dispatch('fetch', { key })
    } catch (e) {
      commit('TABLE_UPDATE', {
        key,
        dataset: { items: [], totalItems: 0 },
      })
    }
    commit('TABLE_SET_LOADING', { key, loading: false })
  },

  paginate({ commit, dispatch }, payload) {
    commit('TABLE_SET_PAGINATION', payload)
    return dispatch('query', payload)
  },

  search({ commit, dispatch }, payload) {
    commit('TABLE_SET_SEARCH', payload)
    return dispatch('query', payload)
  },

  config({ commit, dispatch }, payload) {
    commit('TABLE_UPDATE', payload)
    return payload.quiet || dispatch('query', payload)
  },

  prepare({ commit, getters, dispatch }, payload) {
    return dispatch(
      getters.getTable(payload.key) ? 'config' : 'createTable',
      payload
    )
  },
  createTable({ commit, getters, dispatch }, payload) {
    const { key, options } = payload
    if (getters.getTable(key)) return false
    const table = {
      active: true,
      loading: false,
      headers: [],
      dataset: {
        items: [],
        totalItems: 0,
      },
      query: {
        pagination: {
          descending: false,
          page: 1,
          rowsPerPage: 5,
          sortBy: '',
        },
        searchString: '',
      },
      request: {
        endpoint: '',
        options: {
          method: 'get',
        },
      },
      responseFields: {
        items: 'items',
        totalItems: 'totalItems',
      },
      dataTableProps: {
        rowsPerPageItems: [5, 10, 25, 50, 100],
        rowsPerPageText: 'Itens por página:',
      },
    }
    commit('TABLE_CREATE', {
      key,
      options: merge(table, options),
    })
    return payload.quiet || dispatch('query', payload)
  },
}
