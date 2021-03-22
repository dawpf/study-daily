import request from "../utils/request";
import Service from "../utils/service";

/**
 * 获取login页面的数据
 */
export function getLoginData(params) {
  return request.get(Service.login_data, params);
}

/**
 * 获取login页面的数据
 */
export function postUuLoginData(params) {
  return request.post(Service.login_uu, params);
}
