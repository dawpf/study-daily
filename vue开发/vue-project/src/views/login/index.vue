<template>
  <div class="login_container">
    这是login页面
    <div>直接获取count:{{ this.$store.state.login.count_login }}</div>
    <div>使用计算属性获取count:{{ count_login }}</div>

    <div style="margin-top:10px">
      <button class="btn" @click="add">累加按钮</button>
    </div>
    <div style="margin-top:50px">
      <button class="btn" @click="goPage('Home')">跳转到home</button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getLoginData, postUuLoginData } from "../../api/login";
export default {
  data() {
    return {
      msg: "login页面的数据"
    };
  },
  computed: {
    ...mapState({
      count_login: state => state.login.count_login // 使用计算属性时加上模块
    })
  },
  created() {
    // getLoginData();

    // 反向代理测试
    const payLoad = {
      appId: "",
      channel_id: 4,
      marketChannel: "",
      osType: "1",
      packageName: "",
      phoneModel: "",
      product: "2",
      sign: "c8cd9b3d6b6b9428ce6a6684955d7701",
      sysVer: "",
      time: "1604565004",
      token: "",
      udid: "",
      ver: "3.1.0"
    };
    postUuLoginData(payLoad);
  },
  methods: {
    goPage(val) {
      this.$router.push({ name: val, query: { id: "1" } });
    },
    add() {
      // 两种写法都可以
      this.$store.commit("add_count_login", 10); // 写法不变
      // this.$store.dispatch("add_count_login_action", 20); // 写法不变
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: red;
  padding: 20px;
  .btn {
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #000;
  }
}
</style>
