function request(path, body) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    const baseUrl_dev = 'http://api-test.yingtaoclub.net/v1/' // 开发环境
    const baseUrl_pro = 'https://slb.yingtaoclub.net/v1/' // 生产环境

    request.open('post', baseUrl_dev + path);

    request.setRequestHeader('Authorization', body.token) // 设置请求头
    delete body.token

    request.send(JSON.stringify(body));

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status <= 400) {
          resolve.call(undefined, JSON.parse(request.responseText));//执行成功函数
        } else if (request.status >= 400) {
          reject.call(undefined, request);//执行失败函数
        }
      }
    }
  })
}


const payLoad = {
  type_id: 1,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2Mzk3Mjk0NzEsImlhdCI6MTYwNjM3NzMxOCwidWlkIjozNzk3NTA4LCJyb2xlX2lkIjowLCJ1c2VyX2RhdGEiOiJ7XCJ1aWRcIjowLFwiZGV2aWNlX2lkXCI6XCI0QTgzNTBCMi02NzZFLTQ1QjUtOTRFQi05QzBCNTI0MkM1RjlcIixcImxvZ2luX3BsYXRcIjoyfSJ9.DdWUZN-R3eiiCH9HlNrk-FnVuCjOP6riH__rOMLDqLQ'
}

request('/promote/annual-festival-list', payLoad).then(res => {
  console.log('res----', res);
})

