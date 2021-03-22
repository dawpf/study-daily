import Service from '../utils/service'
import request from '../utils/request'

/**
 * 获取登陆页面的数据
 */
export function getLoginData(params) {
  return request.get(Service.login_get,params)
}

/**
 * 传递登录页面的数据
 */
export function postLoginData(params) {
  return request.post(Service.login_post,{params})
}

/**
 * 传递登录页面的数据
 */
export function postUuLoginData(params) {
  return request.post(Service.login_uu,params)
}