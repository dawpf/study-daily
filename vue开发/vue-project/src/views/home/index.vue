<template>
  <div class="home_container">
    <div>这是home主页面 {{ msg }}</div>
    <router-view />

    <div style="margin-top:50px">
      <button class="btn" @click="goPage('User')">跳转到user</button>
      <button class="btn" @click="goPage('News')">跳转到News</button>
    </div>
    <div style="margin-top:20px">
      <button class="btn" @click="goPage('Login')">跳转到login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "home页面的数据"
    };
  },
  methods: {
    goPage(val) {
      this.$router.push({ name: val, query: { id: "1" } });
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  background-color: yellow;
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
