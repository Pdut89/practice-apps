const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const {generateMessage, generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const users = new Users()

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', socket => {

  socket.on('join', (params, callback) => {
    const {name, room} = params
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required')
    }

    socket.join(room)
    users.removeUser(socket.id)
    users.addUser(socket.id, name, room)

    io.to(room).emit('updateUserList', users.getUserList(room))

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'))
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined.`))
  })

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id)

    if(user && isRealString(message.text)) {
      const {room, name} = user
      io.to(room).emit('newMessage', generateMessage(name, message.text))
      callback()
    }
  })

  socket.on('createLocationMessage', coords => {
    const user = users.getUser(socket.id)

    if(user) {
      const {room, name} = user
      io.to(room).emit('newLocationMessage', generateLocationMessage(name, coords.latitude, coords.longitude))
    }
  })

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id)
    const {id, name, room} = user

    if(user) {
      io.to(room).emit('updateUserList', users.getUserList(room))
      io.to(room).emit('newMessage', generateMessage(`${name} has left the room.`))
    }
  })

})

server.listen(port, () => {
  console.log(`Started on port ${port}`)
})
