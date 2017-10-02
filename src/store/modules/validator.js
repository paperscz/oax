import * as types from '../types'
import axios from 'axios'

export const state = {
  result: null
}

const jsonCache = {}
const urlCache = {}

export const mutations = {
  [types.VALIDATOR_SET] (state, payload) {
    state.result = payload
  }
}

let lastUrl = null
let lastJson = null

export const actions = {
  [types.VALIDATOR_RUN] ({commit}, {url, json}) {
    if (url && urlCache[url]) {
      commit(types.VALIDATOR_SET, urlCache[url])
      return
    } else if (json && jsonCache[json]) {
      commit(types.VALIDATOR_SET, jsonCache[json])
      return
    }

    commit(types.VALIDATOR_SET, null)

    if (url) {
      lastUrl = url
      lastJson = null

      axios.get('http://online.swagger.io/validator/debug', {params: {url}}).then(res => {
        urlCache[url] = res.data

        if (lastUrl === url) {
          commit(types.VALIDATOR_SET, res.data)
        }
      })
    } else {
      lastUrl = null
      lastJson = json

      axios.post('http://online.swagger.io/validator/debug', {data: json}).then(res => {
        jsonCache[json] = res.data

        if (lastJson === json) {
          commit(types.VALIDATOR_SET, res.data)
        }
      })
    }
  }
}

export const getters = {
  [types.VALIDATOR]: (state) => state.result
}

export default {
  state,
  mutations,
  getters,
  actions
}