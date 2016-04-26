import React from 'react'

import 'whatwg-fetch'

export default class Welcome extends React.Component {
  constructor () {
    super()

    this.state = {
      updates: []
    }
  }

  async componentDidMount () {
    let data = await fetch('/updates')
    let json = await data.json()

    this.setState({
      updates: json
    })
  }

  render () {
    return (
      <div>
        {!this.state.updates.length
          ? <div className='spinner' />
          : this.state.updates.map((update, i) => {
          return (
            <div className='welcome-update' key={i}>
              <h4>{update.title}</h4>
              <span className='date'>{update.date}</span>
              <span className='author'>{update.author}</span>
              <p>{update.body}</p>
            </div>
            )
        })}
      </div>
      )
  }
}
