import React from 'react'

import client from '../irc'

export default class ChannelFilterAdd extends React.Component {
  constructor () {
    super()

    this.state = {
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {  }

  change (e) {
    e.target.value = e.target.value.replace(/\s/g, '?')
  }

  render () {
    return (
      <div className='ban-add'>
        <span>Use * to match zero or more of any character.</span>
        <span>Use ? to match one occurrence of any character.</span>
        <span>Spaces are not allowed, use ? instead.</span>
        <br />
        <br />
        <input onChange={this.change.bind(this)} type='text' placeholder='*an?example*' />
        <br />
        <br />
        <div className='button'>Add Filter</div>
      </div>
      )
  }
}
