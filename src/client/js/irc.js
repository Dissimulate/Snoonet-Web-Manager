import events from 'events'
import client from 'socket.io-client'

class IRC extends events.EventEmitter {
  constructor (host, port) {
    super()

    this.connected = false
    this.flags = {}
    this.user = {
      identified: false
    }
  }

  connect (host, port, nick, ident, real) {
    this.host = host
    this.port = port
    this.nick = nick
    this.ident = ident
    this.real = real

    this.socket = client(`${this.host}:${this.port}`)

    this.socket.on('connect', () => {
      this.connected = true

      setTimeout(() => {
        this.send('NICK', nick)
        this.send('USER', ident, 8, '*', real)
      }, 2000)
    })

    this.socket.on('disconnect', () => {
      this.connected = false
    })

    this.socket.on('data', this.parse.bind(this))

    this.on('PING', (sender, dest, message) => {
      this.send('PONG', message[0])
    })
  }

  parse (line) {
    console.log(line)

    let parts = /^(?::(([^@! ]+)!?([^@ ]+)?@?([^ ]+)?))? ?([^ ]+) ?([^: ]*) :?(.*)?$/.exec(line)

    let sender = parts[1]
    let nick = parts[2]
    let ident = parts[3]
    let host = parts[4]
    let command = parts[5]
    let dest = parts[6]
    let message = parts[7]

    let params = message ? message.split(' ') : []

    params.unshift(message)

    this.emit(
      command,
      [sender, nick, ident, host],
      dest,
      params,
      line
    )
  }

  send () {
    this.socket.emit('data', Array.prototype.slice.call(arguments).join(' '))
  }
}

export default new IRC()
