import React from 'react'
import {Link} from 'react-router'

import client from '../irc'

export default class ChannelFilter extends React.Component {
  constructor () {
    super()

    this.state = {
      bans: []
    }
  }

  componentDidMount () {
    let bans = []

    client.on('941', (sender, dest, message) => {
      bans.push({
        mask: message[2],
        setBy: message[3],
        time: message[4]
      })
    })

    client.on('940', (sender, dest, message) => {
      if (!bans.length) {
        bans.push(null)
      }

      this.setState({
        bans: bans
      })

      bans = []
    })

    this.update()
  }

  update () {
    client.send('MODE', this.props.params.channel, 'g')
  }

  componentWillUnmount () {
    client.removeAllListeners('941')
    client.removeAllListeners('940')
  }

  remove (masks) {
    client.send(`CS MODE ${this.props.params.channel} SET -${'g'.repeat(masks.length)} ${masks.join(' ')}`)

    setTimeout(this.update.bind(this), 1000)
  }

  toggle (mask) {
    if (this.state.masks.indexOf(mask) > -1) {
      this.state.masks.splice(this.state.masks.indexOf(mask), 1)
    } else {
      this.state.masks.push(mask)
    }

    this.setState({
      masks: this.state.masks
    })
  }

  removeSelected () {
    this.remove(this.state.masks)
  }

  render () {
    return (
      <div>
        <div className='top-bar'>
          <div onClick={this.removeSelected.bind(this)} className='button'>Remove Selected</div>
          <Link
            to={`/channels/${encodeURIComponent(this.props.params.channel)}/filter/add`}
            className='button'>
            Add Filter
          </Link>
        </div>
        {!this.state.bans.length
          ? <div className='spinner' />
          : <table>
            <tbody>
              {this.state.bans.map((ban, i) => {
                if (ban) {
                  return (
                    <tr key={i} className='ban-item'>
                      <td><input onChange={this.toggle.bind(this, ban.mask)} type='checkbox' /></td>
                      <td>{ban.mask}</td>
                      <td>{ban.setBy}</td>
                      <td>{ban.time}</td>
                      <td><div onClick={this.remove.bind(this, [ban.mask])} className='rm-button'>x</div></td>
                    </tr>
                    )
                }

                return <tr><td>Nothing here.</td></tr>
              })}
            </tbody>
          </table>
          }
      </div>
      )
  }
}
