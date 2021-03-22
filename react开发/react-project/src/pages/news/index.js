import React from 'react'

import style from './index.module.scss'

class News extends React.Component{
  render(){
    return(
      <div className={style.container_news}>
        <h2>这是home里面的news页面</h2>
        <div className={style.boxx}>盒子</div>
      </div>
    )
  }
}

export default News