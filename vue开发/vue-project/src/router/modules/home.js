// home 模块路由

const HomeRoute = {
  // 注意：返回的格式是一个对象，不是一个数组！！
  path: "/",
  name: "Home",
  component: () => import("../../views/home/index.vue"),
  redirect: "/user",
  children: [
    {
      path: "user",
      name: "User",
      component: () =>
        import(/* webpackChunkName: "user" */ "../../views/user/index.vue"),
      meta: {
        title: "user页面"
      }
    },
    {
      path: "news",
      name: "News",
      component: () =>
        import(/* webpackChunkName: "news" */ "../../views/news/index.vue"),
      meta: {
        title: "new页面"
      }
    }
  ]
};

export default HomeRoute;
