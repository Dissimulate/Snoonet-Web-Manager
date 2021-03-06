'use strict'

const express = require('express')
const socket = require('socket.io')
const net = require('net')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = socket.listen(server)

/* ----- */

class IRC {
  constructor (client, host, port) {
    this.client = client
    this.host = host
    this.port = port

    this.buffer = new Buffer('')

    this.socket = null

    this.connect()
  }

  connect () {
    this.socket = net.createConnection({
      host: this.host,
      port: this.port
    })

    this.socket.addListener('data', (data) => {
      if (typeof data === 'string') {
        this.buffer += data
      } else {
        this.buffer = Buffer.concat([this.buffer, data])
      }

      let lines = this.buffer.toString().split(/\r\n|\r|\n/)

      if (lines.pop()) return

      this.buffer = new Buffer('')

      for (let i in lines) {
        this.client.emit('data', lines[i])
      }
    })
  }

  send (msg) {
    if (msg.startsWith('WHO ')) {
      this.socket.write(`PRIVMSG Sherlock :@ezchan ${msg}\r\n`)
    } else {
      this.socket.write(`${msg}\r\n`)
    }
  }
}

/* ----- */

let connections = []

/* ----- */

io.on('connection', (socket) => {
  const connection = socket.request.connection

  connections.push(socket)

  console.log(`CONNECT: ${connection.remoteAddress}:${connection.remotePort}`)

  socket.irc = new IRC(socket, 'irc.snoonet.org', 6667)

  socket.on('disconnect', () => {
    connections.splice(connections.indexOf(socket), 1)

    console.log(`DISCONNECT: ${connection.remoteAddress}:${connection.remotePort}`)
  })

  socket.on('data', socket.irc.send.bind(socket.irc))
})

/* ----- */

server.listen(8080, () => {
  console.log('Server started.')
})
