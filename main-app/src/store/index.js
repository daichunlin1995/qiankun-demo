import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    num: 1,
    message: [],
    content:''
}
const mutations = {
    addNum(state, data) {
        console.log(data)
        state.num = data
    },
    changeMessage(state,data){
        state.message = data
    },
    chan(state,data){
        state.content = data
    }
}
const getters = {
    changeNum(state) {
        return state.num + 1
    }
}
const actions = {
    addNum({ commit }, data) {
        commit('addNum', data)
    },
    changeMessage({ commit }, data) {
        commit('changeMessage', data)
    },
    changeContent({ commit }, data) {
        commit('chan', data)
    }

}
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})