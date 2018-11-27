const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const {generateMessage} = require('./utils/message')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected')
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chatroom!'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user has joined the chatroom'))

  socket.on('createMessage', (message, callback) => {
    console.log('created message: ', message)
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback('Message from server:')
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Started on port ${port}`)
})
