// login 模块 ----注意：我们只需要把 login 模块的数据和数据操作方法暴露出去，不需要重新创建 vuex对象
export default {
  state: {
    count_login: 500
  },
  mutations: {
    add_count_login(state, num) {
      state.count_login += num;
    }
  },
  actions: {
    add_count_login_action(context, num) {
      context.commit("add_count_login", num);
    }
  }
};
