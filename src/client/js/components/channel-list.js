import React from 'react'
import {Link} from 'react-router'

import client from '../irc'

export default class ChannelList extends React.Component {
  constructor () {
    super()

    this.state = {
      channels: []
    }
  }

  componentDidMount () {
    client.on('NOTICE', (sender, dest, message) => {
      if (sender[1] === 'NickServ') {
        let match = /^\d+\s*(#\S+)\s*([a-zA-Z]+)/.exec(message[0])

        if (match) {
          if (match[2] === 'Founder' || match[2] === 'QOP') {
            match[2] = 'BFGHIKNOVbcfghikmostuv'
          }
          if (match[2] === 'SOP') {
            match[2] = 'BGHKNOVbcfghikmostuv'
          }
          if (match[2] === 'AOP') {
            match[2] = 'BGHNOVbcfghikostuv'
          }
          if (match[2] === 'HOP') {
            match[2] = 'HNVbcfhkuv'
          }
          if (match[2] === 'VOP') {
            match[2] = 'NVcfv'
          }

          client.flags[match[1]] = match[2]

          this.state.channels.push({
            name: match[1],
            flags: match[2]
          })

          this.setState({
            channels: this.state.channels
          })
        }
      }
    })

    client.send('NS ALIST')
  }

  componentWillUnmount () {
    client.removeAllListeners('NOTICE')
  }

  render () {
    return (
      <div>
        {!this.state.channels.length
          ? <div className='spinner' />
          : this.state.channels.map((channel, i) => {
            return (
              <Link
                to={`/channels/${encodeURIComponent(channel.name)}`}
                className='channel-item'
                key={i}>
                {channel.name}
                <div>{channel.flags}</div>
                {/* channel.flags.includes('o') && <div>o</div> */}
              </Link>
              )
          })
        }
      </div>
      )
  }
}
