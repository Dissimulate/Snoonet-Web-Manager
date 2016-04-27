import React from 'react'

import client from '../irc'

export default class ChannelUsers extends React.Component {
  constructor () {
    super()

    this.state = {
      users: [],
      search: ''
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

  search (e) {
    this.setState({
      search: e.target.value
    })
  }

  render () {
    return (
      !this.state.users.length
        ? <div className='spinner' />
        : <div>
          <div className='top-bar'>
            <input onChange={this.search.bind(this)} type='text' placeholder='search' />
          </div>
          <table>
            <tbody>
              {this.state.users.map((user) => {
                let search = this.state.search
                let match = search ? user[0].includes(search) || user[1].includes(search) || user[2].includes(search) : true

                return match && (
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
        </div>
      )
  }
}
