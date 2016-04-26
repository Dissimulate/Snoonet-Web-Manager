import React from 'react'

import client from '../irc'

export default class ChannelBansAdd extends React.Component {
  constructor () {
    super()

    this.state = {
      users: []
    }
  }

  componentDidMount () {
    let collecting = false
    let str = ''

    client.on('PRIVMSG', (sender, dest, message) => {
      if (sender[1] === 'Sherlock') {
        if (/WHO \S+/.test(message[0])) {
          collecting = true
          str = ''
        } else if (message[0] === 'END') {
          collecting = false

          this.setState({
            users: str.split('|').map((user) => user.split(/[!@]/))
          })
        } else if (collecting) {
          str += message[0]
        }
      }
    })

    client.send('WHO', this.props.params.channel)
  }

  componentWillUnmount () {
    client.removeAllListeners('PRIVMSG')
  }

  render () {
    return (
      <div>
        {!this.state.users.length
          ? <div className='spinner' />
          : <div className='ban-add'>
            <select>
              {this.state.users.map((user) => {
                return <option key={user[0]} value={user[2]}>{user[0]}</option>
              })}
            </select>
            <br />
            <span>
              - OR -
            </span>
            <br />
            <input type='text' placeholder='n!u@h' />
            <br />
            <br />
            <div className='button'>Add Ban</div>
          </div>}
      </div>
      )
  }
}
