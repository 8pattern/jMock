import Vue from 'vue'
import Vuex from 'vuex'
import config from './config'

import { MutationEvents, ActionEvents } from './constant'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mockData: {
      '/test': {
        config: {
          isOpen: false,
        },
        methods: {
          GET: {
            isOpen: false,
            type: 'String',
            content: 'Hello world',
          },
          POST: {
            isOpen: true,
            type: 'JSON',
            content: JSON.stringify({ a: 1 }),
          },
        },
      },
      '/test2': {
        config: {
          isOpen: true,
        },
        methods: {
          GET: {
            isOpen: false,
            type: 'String',
            content: 'Hello world',
          },
        },
      },
    },
    currentMockItemUrl: '',
    currentMockItemMethod: '',
    dialogVisible: false,
  },
  getters: {
    mockConfig(state) {
      const { mockData } = state
      const mockConfig = {}
      Object.keys(mockData).forEach((url) => {
        mockConfig[url] = mockData[url].config || {}
      })
      return mockConfig
    },
    mockMethods(state) {
      const { mockData } = state
      const mockMethods = {}
      Object.keys(mockData).forEach((url) => {
        mockMethods[url] = mockData[url].methods || {}
      })
      return mockMethods
    },
    mockList(state, getters) {
      const { mockMethods } = getters
      return Object.keys(mockMethods)
        .sort((url1, url2) => url1 > url2 ? 1 : -1)
        .map((url) => ({
          url,
          methods: Object.keys(mockMethods[url]).sort((method1, method2) => method1 > method2 ? 1 : -1),
        }))
    },
    mockData(state, getters) {
      const { currentMockItemUrl } = state
      const { mockMethods } = getters
      return mockMethods[currentMockItemUrl] || {}
    },
    selectedMockContent(state, getters) {
      const { currentMockItemMethod } = state
      const { mockData } = getters
      return mockData[currentMockItemMethod] || {}
    }
  },
  mutations: {
    [MutationEvents.UPDATE_MOCK_DATA](state, mockData) {
      state.mockData = mockData
    },
    [MutationEvents.TOGGLE_MOCK_ITEM_STATUS](state, { url }) {
      const { mockData } = state
      if (url && mockData[url]) {
        const currentStatus = mockData[url].config.isOpen
        mockData[url].config.isOpen = !currentStatus
      }
    },
    [MutationEvents.CHANGE_SELECTED_URL](state, url) {
      state.currentMockItemUrl = url
    },
    [MutationEvents.CHANGE_SELECTED_METHOD](state, method) {
      state.currentMockItemMethod = method
    },
    [MutationEvents.CHANGE_DIALOG_STATUS](state, status) {
      state.dialogVisible = status || false
    },
  },
  actions: {
    [ActionEvents.TOGGLE_MOCK_ITEM_STATUS]({ commit }, { url } = {}) {
      commit(MutationEvents.TOGGLE_MOCK_ITEM_STATUS, { url })
    },
    [ActionEvents.CHANGE_SELECTED_URL]({ commit }, { url } = {}) {
      commit(MutationEvents.CHANGE_SELECTED_URL, url)
    },
    [ActionEvents.RENAME_MOCK_URL]({ commit }, { oldUrl, newUrl } = {}) {

    },
    [ActionEvents.OPEN_DIALOG]({ commit }, { url, method }) {
      commit(MutationEvents.CHANGE_SELECTED_URL, url)
      commit(MutationEvents.CHANGE_SELECTED_METHOD, method)
      commit(MutationEvents.CHANGE_DIALOG_STATUS, true)
    },
    [ActionEvents.CLOSE_DIALOG]({ commit }) {
      commit(MutationEvents.CHANGE_DIALOG_STATUS, false)
    },
  },
  modules: {
    config,
  }
})

export { MutationEvents, ActionEvents } from './constant'
