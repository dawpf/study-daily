import Loadable from 'react-loadable'
import React from 'react'

import NotFound from '../pages/notFound'


function Loading () {
  return <div>Loading</div>
}


const Home = Loadable({
  loading: Loading,
  loader: () => import('../pages/home')
});
const Login = Loadable({
  loading: Loading,
  loader: () => import('../pages/login')
});
const User = Loadable({
  loading: Loading,
  loader: () => import('../pages/user')
});
const News = Loadable({
  loading:Loading,
  loader:()=>import('../pages/news')
})

const routes = [
  {
    path: '/login',
    exact: false,
    component: Login
  },
  {
    path: '/',
    exact: false,
    component: Home,
    children: [
      {
        path: '/user',
        exact: true,
        component: User
      },
      {
        path: '/news',
        exact: true,
        component: News
      }
    ]
  },
  {
    path: '*',
    exact: false,
    component: NotFound
  }
]

export default routes;
