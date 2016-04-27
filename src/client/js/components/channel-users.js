import React from 'react'

import client from '../irc'

export default class ChannelUsers extends React.Component {
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

    this.update()
  }

  update () {
    client.send('WHO', this.props.params.channel)
  }

  componentWillUnmount () {
    client.removeAllListeners('PRIVMSG')
  }

  render () {
    return (
      !this.state.users.length
        ? <div className='spinner' />
        : <table>
          <tbody>
            {this.state.users.map((user) => {
              return (
                <tr key={user[0]}>
                  <td>
                    <div className='rm-button fa fa-sign-out'></div>
                    <div className='rm-button fa fa-ban'></div>
                  </td>
                  <td className='user-item'>
                    <span>{user[0]}</span>!
                    <span>{user[1]}</span>@
                    <span>{user[2]}</span>
                  </td>
                </tr>
                )
            })}
          </tbody>
        </table>
      )
  }
}
