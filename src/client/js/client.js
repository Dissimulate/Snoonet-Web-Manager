import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory, Router, Route, Link} from 'react-router'

import Login from './components/login'
import Welcome from './components/welcome'
import ChannelView from './components/channel-view'
import ChannelList from './components/channel-list'
import ChannelUsers from './components/channel-users'
import ChannelModes from './components/channel-modes'
import ChannelBans from './components/channel-bans'
import ChannelBansAdd from './components/channel-bans-add'
import ChannelFilter from './components/channel-filter'
import ChannelFilterAdd from './components/channel-filter-add'

import client from './irc'

class Dashboard extends React.Component {
  constructor () {
    super()

    this.state = {
      content: <div className='spinner' />
    }
  }

  componentDidMount () {
    let channel = this.props.params.channel

    if (channel && !client.flags[channel]) {
      client.on('NOTICE', (sender, dest, message) => {
        if (sender[1] === 'NickServ') {
          let match = /^\d+\s*(#\S+)\s*([a-zA-Z]+)/.exec(message[0])

          if (match && channel === match[1]) {
            if (match[2] === 'Founder' || match[2] === 'QOP') {
              match[2] = 'BFGHIKNOVbcfghikmostuv'
            } else if (match[2] === 'SOP') {
              match[2] = 'BGHKNOVbcfghikmostuv'
            } else if (match[2] === 'AOP') {
              match[2] = 'BGHNOVbcfghikostuv'
            } else if (match[2] === 'HOP') {
              match[2] = 'HNVbcfhkuv'
            } else if (match[2] === 'VOP') {
              match[2] = 'NVcfv'
            }

            client.flags[match[1]] = match[2]

            client.removeAllListeners('NOTICE')

            this.setState({
              content: null
            })
          }
        }
      })

      client.send('NS ALIST')
    } else {
      this.setState({
        content: null
      })
    }
  }

  render () {
    let channel = this.props.params.channel

    return (
      <table className='main-table'>
        <tbody>
          <tr>
            <td className='sidebar'>
              <img src='/img/snoonet.png' />
              <div>Welcome, {client.ident}.</div>
              <Link to='/channels'>Channels</Link>
              {window.location.pathname.startsWith('/channels/') && (
                <span>
                  <Link
                    className='sub'
                    to={`/channels/${encodeURIComponent(channel)}/users`}>
                    Users
                  </Link>
                  <Link
                    className='sub'
                    to={`/channels/${encodeURIComponent(channel)}/modes`}>
                    Modes
                  </Link>
                  <Link
                    className='sub'
                    to={`/channels/${encodeURIComponent(channel)}/bans`}>
                    Bans
                  </Link>
                  <Link
                    className='sub'
                    to={`/channels/${encodeURIComponent(channel)}/filter`}>
                    Filter
                  </Link>
                </span>
              )}
              <Link to='/'>Account</Link>
              {window.location.pathname.startsWith('/account') && (
                <Link className='sub' to='/'>Modes</Link>
              )}
            </td>
            <td className='main-wrapper'>
              {this.state.content || this.props.children || <Welcome />}
            </td>
          </tr>
        </tbody>
      </table>
      )
  }
}

class Main extends React.Component {
  render () {
    return client.user.identified
            ? <Dashboard params={this.props.params} children={this.props.children}/>
            : <Login />
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Main}>
      <Route path='/channels' component={ChannelList} />
      <Route path='/channels/:channel' component={ChannelView} />
      <Route path='/channels/:channel/users' component={ChannelUsers} />
      <Route path='/channels/:channel/modes' component={ChannelModes} />
      <Route path='/channels/:channel/bans' component={ChannelBans} />
      <Route path='/channels/:channel/bans/add' component={ChannelBansAdd} />
      <Route path='/channels/:channel/filter' component={ChannelFilter} />
      <Route path='/channels/:channel/filter/add' component={ChannelFilterAdd} />
    </Route>
  </Router>
), document.getElementById('app'))
