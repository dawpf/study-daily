import Vue from "vue";
import Vuex from "vuex";

import login from "./modules/login"; // 引入login模块

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { login } // 配置login模块
});
