import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// 项目启动时，加载自适应配置
(function() {
  var rem = document.createElement("script");
  rem.src = "./rem.js";
  document.body.appendChild(rem);
})();

console.log("process.env", process.env);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
