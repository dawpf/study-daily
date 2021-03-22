import React from "react"

class Home extends React.Component {

  render () {
    return (
      <div>
        <h1>这是home页面</h1>
        {this.props.children}
      </div>
    )
  }
}

export default Home