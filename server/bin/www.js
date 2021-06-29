#!/usr/bin/env node

import debugLib from 'debug'
import http from 'http'
import app from '../app.js'

const debug = debugLib('leaderboard:server')

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (Number.isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

const normalizedPort = normalizePort(process.env.PORT || '3000')
app.set('port', normalizedPort)

const server = http.createServer(app)

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof normalizedPort === 'string'
    ? `Pipe ${normalizedPort}`
    : `Port ${normalizedPort}`

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  debug(`Listening on ${bind}`)
  console.info(`Listening on ${bind}`)
}

server.listen(normalizedPort)
server.on('error', onError)
server.on('listening', onListening)
