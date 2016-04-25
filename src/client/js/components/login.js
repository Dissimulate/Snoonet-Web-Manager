import React from 'react'
import {browserHistory} from 'react-router'

import client from '../irc'

export default class Login extends React.Component {
  constructor () {
    super()

    this.state = {
      loading: false,
      user: {}
    }
  }

  componentDidMount () {

  }

  signin () {
    this.setState({
      loading: true,
      message: ''
    }, () => {
      client.connect(
        window.location.hostname,
        8080,
        0,
        this.refs.nick.value,
        this.refs.nick.value
        )

      client.once('396', () => {
        client.send('NS IDENTIFY', this.refs.nick.value, this.refs.pass.value)

        client.once('900', () => {
          client.user.identified = true

          this.setState({
            loading: false,
            message: ''
          }, () => {
            browserHistory.push(window.location.pathname)
          })
        })

        client.on('NOTICE', (sender, dest, message) => {
          if (message[0] === 'Password incorrect.') {
            client.send('QUIT')

            this.setState({
              loading: false,
              message: 'Password incorrect.'
            })
          } else if (/Nick .* isn't registered/.test(message[0])) {
            client.send('QUIT')

            this.setState({
              loading: false,
              message: 'Nick is not registered.'
            })
          }
        })
      })

      client.once('433', () => {
        this.setState({
          loading: false,
          message: ''
        })
      })
    })
  }

  componentWillUnmount () {
    client.removeAllListeners('443')
    client.removeAllListeners('NOTICE')
    client.removeAllListeners('900')
    client.removeAllListeners('396')
  }

  render () {
    return (
      <div className='login-page'>
        <div className='login-message'>
          {this.state.message}
        </div>
        <div className='login-box'>
          <input disabled={this.state.loading} ref='nick' placeholder='nickname' type='text' />
          <input disabled={this.state.loading} ref='pass' placeholder='password' type='password' />
          {this.state.loading
            ? <div className='spinner' />
            : <div onClick={this.signin.bind(this)} className='button'>sign in</div>
          }
        </div>
      </div>
    )
  }
}
