import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import routes from './route'
// import Loadable from "react-loadable"

// import NotFound from "../pages/notFound"
// function loading () {
//   return (
//     <div>loading....</div>
//   )
// }

// const Home = Loadable({
//   loading: loading,
//   loader: () => import('../pages/home')
// })
// const Login = Loadable({
//   loading: loading,
//   loader: () => import('../pages/login')
// })
// const Board = Loadable({
//   loading: loading,
//   loader: () => import('../pages/board')
// })

class MyRouter extends React.Component {
  render () {
    return (

      <Router>
        <Switch>


          {
            routes.map((router, key) => {
              if (undefined !== router.children && router.children.length) {
                return (<Route key={key} path={router.path} exact={router.exact} component={(props) => {
                  return (<router.component>
                    {
                      router.children.map((children, key2) => {
                        return <Route path={children.path} key={key2} exact={children.exact} {...props} component={children.component} />
                      })
                    }
                  </router.component>)

                }} />)
              } else {
                return (<Route key={key} path={router.path} exact={router.exact} component={router.component} />)
              }

            })
          }



          {/* <Route path='/' component={(props) => {
            return (
              <Home>
                <Route path='/home/board' exact component={Board}></Route>
              </Home>
            )
          }} />

          <Route path='/login' component={Login} />
          <Route path="*" component={NotFound} /> */}


        </Switch>

        {/* 
        <li><Link to='/'>home页面</Link></li>
        <li><Link to='/login'>login页面</Link></li> */}

      </Router>
    )
  }
}

export default MyRouter