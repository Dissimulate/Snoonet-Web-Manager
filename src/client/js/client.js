import React from 'react'
import ReactDOM from 'react-dom'
import {browserHistory, Router, Route, Link, IndexRoute} from 'react-router'

import Login from './components/login'
import ChannelList from './components/channel-list'
import ChannelModes from './components/channel-modes'

import client from './irc'

import 'whatwg-fetch'

class Welcome extends React.Component {
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
        {this.state.updates.map((update, i) => {
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

class Dash extends React.Component {
  constructor() {
    super()

    this.state = {
      content: <div><div className='spinner' /></div>
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
                    to={`/channels/${encodeURIComponent(channel)}/modes`}>
                    Modes
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
    return client.user.identified ? <Dash params={this.props.params} children={this.props.children}/> : <Login />
  }
}

class ChannelView extends React.Component {
  render () {
    return <div>{this.props.params.channel}</div>
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Main}>
      <Route path='/channels' component={ChannelList} />
      <Route path='/channels/:channel' component={ChannelView} />
      <Route path='/channels/:channel/modes' component={ChannelModes} />
    </Route>
  </Router>
), document.getElementById('app'))
