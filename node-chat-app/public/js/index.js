const socket = io()

socket.on('connect', function() {
  console.log('Connected to server')

  socket.emit('createMessage', {
    to: 'pdut@gmail.com',
    text: 'Hi pdut',
    createdAt: new Date().toString()
  })
})

socket.on('disconnect', function() {
  console.log('Disconnected from server')
})

socket.on('newMessage', function(message) {
  console.log('new message: ', message)
})
