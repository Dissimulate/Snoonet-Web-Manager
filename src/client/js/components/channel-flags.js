import React from 'react'
import {Link} from 'react-router'

import client from '../irc'

export default class ChannelFlags extends React.Component {
  constructor () {
    super()

    this.state = {
      flags: []
    }
  }

  componentDidMount () {
    client.on('NOTICE', (sender, dest, message) => {
      if (sender[1] === 'ChanServ') {
        let match = /^\d+\s*(\S+)\s*(\S+)/.exec(message[0])

        if (!match) return

        this.state.flags.push([match[1], match[2]])

        this.setState({
          flags: this.state.flags
        })
      }
    })

    this.update()
  }

  update () {
    client.send(`CS FLAGS ${this.props.params.channel} LIST`)
  }

  componentWillUnmount () {
    client.removeAllListeners('NOTICE')
  }

  set (nick, flags) {

  }

  render () {
    return (
      <div>
        {!this.state.flags.length
          ? <div className='spinner' />
          : <table>
              <tbody>
              {this.state.flags.map((user, i) => {
                return (
                  <tr className='flags-item'>
                    <td>{user[0]}</td>
                    <td><input type='text' defaultValue={user[1]} /></td>
                    <td><div onClick={this.set.bind(this, user[0], user[1])} className='rm-button fa fa-floppy-o'></div></td>
                  </tr>
                  )
              })}
              </tbody>
            </table>
        }
      </div>
      )
  }
}
