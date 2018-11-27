const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', socket => {
  console.log('New user connected')

  socket.emit('newMessage', {
    from: 'mike@gmail.com',
    text: 'Hey, what\'s up',
    createdAt: '19 Nov 2018'
  })

  socket.on('createMessage', message => {
    console.log('created message: ', message)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

server.listen(port, () => {
  console.log(`Started on port ${port}`)
})
