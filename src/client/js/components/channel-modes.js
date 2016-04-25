import React from 'react'

import client from '../irc'

export default class ChannelModes extends React.Component {
  constructor () {
    super()

    this.state = {
      set: '',
      modes: [
        {name: 'Allow invite', mode: 'A', value: '', value_req: false, desc: 'Allows anyone to invite anyone else to the channel.'},
        {name: 'Block Caps', mode: 'B', value: 't:fd', value_req: true, desc: 'Block all caps lines from the channel'},
        {name: 'Block Color', mode: 'c', value: '', value_req: false, desc: 'Blocks color lines from the channel'},
        {name: 'No CTCP', mode: 'C', value: '', value_req: false, desc: 'Blocks CTCPs, other than ACTION, from the channel'},
        {name: 'Delay Join', mode: 'D', value: '', value_req: false, desc: 'Hide JOINs until the user speaks'},
        {name: 'Delay Msg ', mode: 'd', value: '[sec]', value_req: true, desc: 'Prevent a user from speaking for [sec] seconds after joining'},
        {name: 'Message Flood', mode: 'f', value: '{*}[num]:[sec]', value_req: true, desc: 'Allow [num] messages every [sec]. If you add the *, it will ban the user if they go over this limit'},
        {name: 'Nick Flood', mode: 'F', value: '[num]:[sec]', value_req: true, desc: 'Allows only [num] nick changes every [sec]'},
        {name: 'Censor', mode: 'G', value: '', value_req: false, desc: 'Uses the network-wide replace based censor for messages in the chan'},
        {name: 'Chan history', mode: 'H', value: '[num]:[sec]', value_req: true, desc: 'On join, replays the last [num] lines from within the last [sec] seconds to the connecting user'},
        {name: 'Invite only users', mode: 'i', value: '', value_req: false, desc: 'Makes a channel invite only'},
        {name: 'Join Throttle', mode: 'j', value: '[num]:[sec]', value_req: true, desc: 'Allow only [num] joins every [sec] seconds'},
        {name: 'Kick Rejoin Delay', mode: 'J', value: '[sec]', value_req: true, desc: 'Disallows a user from rejoining the channel until [sec] seconds after a kick'},
        {name: 'Channel Key', mode: 'k', value: '[key]', value_req: true, desc: 'Sets the pass key required to join a channel'},
        {name: 'No Knock', mode: 'K', value: '', value_req: false, desc: 'Prevents KNOCK attempts against the channel'},
        {name: 'Channel Limit', mode: 'l', value: '[num]', value_req: true, desc: 'Prevents more than [num] users from joining the channel'},
        {name: 'Redirect when full', mode: 'L', value: '[#channel]', value_req: true, desc: 'Forwards users to [#channel] when the channel limit is reached'},
        {name: 'Moderated', mode: 'm', value: '', value_req: false, desc: 'Prevents non-voiced users from speaking'},
        {name: 'Registered only speech', mode: 'M', value: '', value_req: false, desc: 'Prevents non-registered users from speaking'},
        {name: 'No Nicks', mode: 'N', value: '', value_req: false, desc: 'Prevents Nick Changes for any user in the channel'},
        {name: 'No outside messages', mode: 'n', value: '', value_req: false, desc: 'Prevents users not on the channel from sending messages to the channel'},
        {name: 'Private', mode: 'p', value: '', value_req: false, desc: 'Channel will not show up in /LIST, but will show up in user\'s WHOIS'},
        {name: 'No Kicks', mode: 'Q', value: '', value_req: false, desc: 'Prevents any kicks. Does not affect services'},
        {name: 'Registered users only', mode: 'R', value: '', value_req: false, desc: ' Only registered users may join the channel'},
        {name: 'Secret', mode: 's', value: '', value_req: false, desc: 'Hides the channel from both /LIST and /WHOIS.'},
        {name: 'Strip Color', mode: 'S', value: '', value_req: false, desc: 'Strips color codes from messages in the channel, but allows the message through, sans colors'},
        {name: 'No Notices', mode: 'T', value: '', value_req: false, desc: 'Prevents any NOTICEs to be sent to the entire channel'},
        {name: 'Topiclock', mode: 't', value: '', value_req: false, desc: 'Prevents users without +h or +o from changing the topi'},
        {name: 'Auditorium', mode: 'u', value: '', value_req: false, desc: 'Users can only see their own nick and the nicks of operators in the nick list for the channel.'},
        {name: 'Rate Limit', mode: 'U', value: '[num]:[sec]', value_req: true, desc: 'Allow [num] messages every [sec]. Similar to +f, but only blocks messages when the rate is exceeded.'},
        {name: 'SSL users only', mode: 'z', value: '', value_req: false, desc: 'Prevents users who aren\'t connected to the network using SSL from joining'}
      ]
    }
  }

  update () {
    client.send(`MODE ${this.props.params.channel}`)
  }

  componentDidMount () {
    client.on('324', (sender, dest, message) => {
      console.log(message[2].replace(/[+-]/, ''))
      this.setState({
        set: message[2].replace(/[+-]/, '')
      })
    })

    this.update()
  }

  componentWillUnmount () {
    client.removeAllListeners('324')
  }

  toggle (mode, e) {
    client.send(`CS MODE ${this.props.params.channel} SET ${e.target.checked ? '+' : '-'}${mode} ${this.refs[mode].value}`)

    setTimeout(this.update.bind(this), 1000)
  }

  render () {
    return (
      <table>
        <tbody>
          {this.state.modes.map((mode) => {
            return (
              <tr key={mode.mode} className='mode-item'>
                <td><span>{mode.mode}</span></td>
                <td>
                  <input
                    type='checkbox'
                    onChange={this.toggle.bind(this, mode.mode)}
                    checked={this.state.set.includes(mode.mode)}/>
                </td>
                <td>
                  <input
                    ref={mode.mode}
                    type='text'
                    placeholder={mode.value}
                    disabled={!mode.value_req}/>
                </td>
                <td>{mode.desc}</td>
              </tr>
              )
          })}
        </tbody>
      </table>
      )
  }
}
