# axios 自定义添加请求头

**axios 封装**

```javascript
import Vue from 'vue'
import axios from 'axios'

axios.defaults.timeout = 5000;
axios.defaults.baseURL = process.env.VUE_API_ROOT; 

// 请求拦截
axios.interceptors.request.use((config) => {
  let userToken = window.localStorage.getItem('token');
  if (userToken) {
    config.headers.common['Authorization'] = userToken;
  }
  return config;
}, (error) => {
  console.log('错误的传参')
  return Promise.reject(error);
});

// 响应拦截
axios.interceptors.response.use((res) => {
  //对响应数据做些事
  if (!res.data.success) {
    return Promise.resolve(res);
  }
  return res;
}, (error) => {
  console.log('网络异常')
  return Promise.reject(error);
});

function post(url, params, config) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        if (response.data.code === '4005') {
          window.localStorage.clear();
          location.reload()
        }
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function get(url, param) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: param
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default { post, get }

```

如果需要自定义添加请求头（例如 POST 请求）

**解决方法：修改 POST 请求**

```javascript
// 修改后的 POST 请求
function post(url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, config)
      .then(response => {
        if (response.data.code === '4005') {
          window.localStorage.clear();
          location.reload()
        }
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}
```

**注意：添加请求头时需要后台配合，否则请求会报错**

```java
package com.filter;

import com.enums.ColorEnum;
import com.utils.printColorUtil;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Order(1)  //设置优先级 
@WebFilter(filterName = "CoreFilter", value = {"/*"})
public class CoreFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        printColorUtil.println("跨域过滤器启动了", ColorEnum.BLUE.getCode(), ColorEnum.WHITE.getCode());
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        // 设置服务器会接收来自 任意域名的请求
        response.setHeader("Access-Control-Allow-Origin", "*");
        // 设置允许携带cookie
        response.setHeader("Access-Control-Allow-Credentials", "true");
        // 设置允许访问的方法
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, GET");
        // 设置预检请求(options)可以保存的时间,即在这个时间内不再发起预检请求
        response.setHeader("Access-Control-Max-Age", "3600");
        // 设置服务器支持的所有头信息字段,这里的Authorization是自定义的
        response.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
        // 设置允许前端发送的请求头
        response.setHeader("Access-Control-Request-Headers", "Authorization");
        // 暴露头信息(这句话非常重要，我就是加了这句话才好使的),在响应头夹带信息给前端也要加这句话才好使
        response.setHeader("Access-Control-Expose-Headers", "Authorization");
        if ("OPTIONS".equals(request.getMethod())) {
            // 进行我们定义的请求前，浏览器自动发起的options请求
            System.out.println("options");
            // 服务器正常接收，返回状态码，不响应其他内容
            response.setStatus(HttpStatus.ACCEPTED.value());
            return;
        } else {
            // 非options请求，放行
            chain.doFilter(request, response);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }
}
```

