# addRoutes

`vue` 后台权限管理 [官方文档](https://router.vuejs.org/zh/api/#router-getmatchedcomponents)

需求：不同用户登陆后台，针对用户角色添加不同的权限

思路：在路由全局前置守卫中，从后台获取用户最新的权限列表，使用 `addRoutes` 方法，动态更新用户权限

```javascript
// src/permission.js

import router from './router'

import { getToken } from '@/utils/auth' // get token from cookie

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
            
          // 获取用户信息
          const userInfo = await store.dispatch('user/getInfo')
          const { role_id } = userInfo
          // 根据角色生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', role_id)

          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)

          // hack 方法，确保addRoutes是完整的
          // replace设为true
          next({ ...to, replace: true })

        } catch (error) {
          // 删除token-提示错误-重定向到登录页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  ...
})

```

对路由进行二次处理，加入 `Layout` 组件，不同项目不同的处理方式，最终返回 `vue-router` 能正确解析的格式

```javascript
// store/modules/permission.js

import { constantRoutes } from '@/router'
import Layout from '@/layout'

// 获取用户权限的路由接口
import { getRoutes, getQueryPermission } from '@/api/role'

const componentsMap = { // 定义好的路径
    '/': () =>
        import('@/views/dashboard'),
    '/setting/menu': () =>
        import('@/views/setting/menu'),
    '/setting/user': () =>
        import('@/views/setting/user'),
    '/setting/role': () =>
        import('@/views/setting/role'),
    // ...
}

/**
 * 递归处理后端返回路由，最后返回 vue-router 能正确解析的格式
 * @param routes 后端返回的路由表
 * @param isFilterBtn 是否过滤掉按钮
 * @param isParent 是否是最外层的节点
 * @returns {[]}
 */
function filterRouters(routes, isFilterBtn, isParent = true) {
    const res = []

    routes.forEach(route => {
        const tmp = {
            ...route
        }
        const router = generateRouter(tmp, isParent)

        // 过滤按钮类型菜单
        if (isFilterBtn) {
            if (tmp.menu_type !== 3) {
                if (router.children) {
                    router.children = filterRouters(router.children, isFilterBtn, false)
                }

                res.push(router)
            }
        } else {
            if (router.children) {
                router.children = filterRouters(router.children, isFilterBtn, false)
            }

            res.push(router)
        }
    })

    return res
}

/**
 * 替换后端返回路由表中字段
 * @param item
 * @param isParent 是否是最外层的节点
 * @returns {{path: *, component: (*), hidden: *, meta: *, name: *}}
 */
function generateRouter(item, isParent) {
    let hidden = false

    // 将后端返回的 roles 字符串类型转换为数组类型（暂时干掉了这个字段，后端只返回有权限的菜单，前端不判断）
    if (item.meta && item.meta.roles) {
        item.meta.roles = [item.meta.roles]
    }
    item.meta.noCache = item.is_cache !== 1

    if (item.is_visible === 1) {
        hidden = false
    } else {
        hidden = true
    }

    const meta = Object.assign({}, item.meta)
    delete meta.icon // 暂时删掉 icon
    const router = {
        menu_type: item.menu_type,
        menu_id: item.menu_id,
        path: item.path,
        name: item.cache_name,
        title_name: item.name,
        hidden: hidden,
        meta: meta,
        component: isParent ? Layout : componentsMap[item.path]
    }

    if (item.children && item.children.length) router.children = item.children
    return router
}

const state = {
    routes: [], // 当前角色权限的菜单
    addRoutes: [],
    allRoutes: [], // 所有的菜单
    assessedBtnRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    SET_ALL_ROUTES: (state, routes) => {
        state.allRoutes = routes
    },
    SET_ASSESSED_BTN_ROUTES: (state, routes) => {
        state.assessedBtnRoutes = routes
    }
}

const actions = {
    generateRoutes({
        commit,
        dispatch
    }, role_id) {
        return new Promise(resolve => {
            let accessedRoutes
            let allRoutes
            let accessedBtnRoutes
            // 如果是 admin 角色，拥有所有权限 asyncRoutes

            // 本地路由 asyncRoutes 过滤对应权限
            // if (roles.includes('admin')) {
            //   accessedRoutes = asyncRoutes || []
            // } else {
            //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            // }
            // commit('SET_ROUTES', accessedRoutes)
            // resolve(accessedRoutes)

            // 服务端路由
            getRoutes().then(response => {
                const {
                    data
                } = response

                // 服务端未做路由权限，全部返回，filterAsyncRoutes 过滤对应权限
                // 如果是 admin 角色，拥有所有权限 asyncRoutes
                // if (roles.includes('admin')) {
                //   accessedRoutes = convertRouter(data) || []
                // } else {
                //   accessedRoutes = filterAsyncRoutes(convertRouter(data), roles)
                // }

                // TODO  add 404 router
                // 服务端做了路由权限，返回当前角色下的路由 直接用服务端返回路由，整理下格式就可以
                // let lastRoutes = filterRouters(data) || []
                // accessedRoutes = lastRoutes.push({ path: '*', redirect: '/404', hidden: true })
                getQueryPermission({
                    role_id
                }).then(response => {
                    // 只有权限的路由（无按钮）
                    accessedRoutes = filterRouters(data, response.data, true) || []

                    // console.log(accessedRoutes, '---accessedRoutes')

                    // 全部路由
                    allRoutes = filterRouters(data, false) || []

                    // 只有权限的路由（有按钮）
                    accessedBtnRoutes = filterRouters(data, response.data, false) || []
                    commit('SET_ROUTES', accessedRoutes)
                    commit('SET_ALL_ROUTES', allRoutes)
                    commit('SET_ASSESSED_BTN_ROUTES', accessedBtnRoutes)
                    resolve(accessedRoutes)
                })
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
```



main.js 文件中引入权限管理文件

```javascript
import Vue from 'vue'

import App from './App'
import store from './store'
import router from './router'

import './permission' // 权限控制

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

```

这样，我们在每一次登录及刷新页面的时候，都会从后台获取最新的用户信息，实时权限列表更新

