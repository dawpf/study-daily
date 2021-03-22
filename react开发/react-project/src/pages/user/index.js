import React from "react"
import './index.less'

import { connect } from 'react-redux'
import { addNum } from '../../actions/user'

class User extends React.Component {
  componentDidMount() {
    console.log('this.props.location',this.props.location);
    console.log('this.propsthis.propsthis.props',this.props);
  }
  userClick() {
    this.props.history.push({ pathname: '/login', state: { name: 'user页面传递过去的' } })
  }
  reduxClick(num) {
    this.props.dispatch(addNum(num))
  }
  render() {
    return (
      <div className='user_container'>
        <h2>这是home页面的子页面 user 页面</h2>
        <button className='user_btn' onClick={this.userClick.bind(this)}>login页面的按钮</button>
        <button className='redux_btn' onClick={this.reduxClick.bind(this,2)}>计数器：{this.props.userDataHandler.NUM}</button>
      </div>
    )
  }
}

// export default User

export default connect(
  state => ({
      userDataHandler: state.user
  })
)(User);