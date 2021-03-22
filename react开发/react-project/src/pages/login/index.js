import React from "react"
import './index.less'

import {getLoginData, postLoginData, postUuLoginData} from '../../api/login'

class Login extends React.Component {
  componentDidMount(){
    console.log('this.props.location',this.props.location);
    console.log('processprocessprocessprocess',process.env.NODE_ENV);

    // 测试二次封装axios
    getLoginData({name:'zs'})
    postLoginData({name:'ww'})

    // 测试反向代理
    const payLoad = {
      appId: "",
      channel_id: 4,
      marketChannel: "",
      osType: "1",
      packageName: "",
      phoneModel: "",
      product: "2",
      sign: "fd5ee6e8fdf61a8d258a2f6185070c47",
      sysVer: "",
      time: "1604309105",
      token: "5783a6ead5c99b2907bf8b84a1c5a166",
      udid: "",
      ver: "3.1.0"
    }
    postUuLoginData(payLoad)
  }


  loginClick () {
    console.log('点击了login传递的数据为:', );
    this.props.history.push({ pathname: '/user', state: { name: 'login页面传递过去的' } })
  }

  render () {
    return (
      <div className='login_container'>
        <h2>这是login页面</h2>
        <button className='login_btn' onClick={this.loginClick.bind(this)}>login页面的按钮</button>
      </div>
    )
  }
}

export default Login