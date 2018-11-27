$(document).ready(function(){

  var socket = io()

  var $locationButton = $('#send-location')

  socket.on('connect', function() {
    console.log('Connected to server')
  })

  socket.on('disconnect', function() {
    console.log('Disconnected from server')
  })

  socket.on('newMessage', function(message) {
    console.log('new message: ', message)
    var li = $('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    $('#messages').append(li)
  })

  socket.on('newLocationMessage', function(message) {
    console.log('new location: ', message)
    var li = $('<li></li>')
    var a = $('<a target="_blank">My current location</a>')

    li.text(`${message.from}: `)
    a.attr('href', message.url)

    li.append(a)

    $('#messages').append(li)
  })

  $('#message-form').on('submit', function(event) {
    event.preventDefault()

    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function(data) {
      console.log(data, 'message sent')
    })
  })

 $locationButton.on('click', function() {
   if(!navigator.geolocation) return alert('Location not supported by browser')
   navigator.geolocation.getCurrentPosition(function(position) {
     socket.emit('createLocationMessage', {
       latitude: position.coords.latitude,
       longitude: position.coords.longitude
     })
   }, function() {
     alert('Unable to fetch location')
   })
 })
})
