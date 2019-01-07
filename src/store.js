import merge from 'lodash.merge'
import pick from 'lodash.get'

export const namespaced = true

export const state = () => ({
  model: {
    active: true,
    loading: false,
    headers: [],
    dataset: {
      items: [],
      totalItems: 0,
    },
    query: {
      pagination: {
        descending: null,
        page: 1,
        rowsPerPage: 5,
        sortBy: null,
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
  },
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
  TABLE_UPDATE_DATASET(state, { key, dataset }) {
    if (!state.list[key]) return false
    state.list = {
      ...state.list,
      [key]: {
        ...state.list[key],
        dataset,
      },
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
    const { request, query, responseFields } = table
    const paramsToken = {
      post: 'data',
      get: 'params',
    }
    const payload = {
      ...request.options,
      url: request.endpoint,
      [request.queryType || paramsToken[request.options.method]]: {
        ...query.pagination,
        search: query.searchString,
      },
    }

    const { data } = await this.$axios(payload)
    const dataset = {
      items: pick(data, responseFields.items),
      totalItems: pick(data, responseFields.totalItems),
    }
    return dataset
  },

  async query({ commit, dispatch, getters }, { key }) {
    const table = getters.getTable(key)
    const { request } = table
    commit('TABLE_SET_LOADING', { key, loading: true })
    try {
      const response =
        typeof request.customHandler === 'function'
          ? request.customHandler(table)
          : dispatch('fetch', { key })
      const dataset = await response
      commit('TABLE_UPDATE_DATASET', { key, dataset })
    } catch (e) {
      console.error(e)
      commit('TABLE_UPDATE_DATASET', {
        key,
        dataset: { items: [], totalItems: 0 },
      })
    }
    commit('TABLE_SET_LOADING', { key, loading: false })
  },

  paginate({ commit, dispatch, getters }, payload) {
    const table = getters.getTable(payload.key)
    const props = ['descending', 'page', 'rowsPerPage', 'sortBy']
    const isDifferent = !props.every(
      prop => table.query.pagination[prop] === payload.pagination[prop]
    )
    commit('TABLE_SET_PAGINATION', payload)
    if (!isDifferent) return false
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
  createTable({ commit, getters, dispatch, state }, payload) {
    const { key, options } = payload
    if (getters.getTable(key)) return false
    commit('TABLE_CREATE', {
      key,
      options: merge(state.model, options),
    })
    return payload.quiet || dispatch('query', payload)
  },
}
