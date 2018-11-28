$(document).ready(function() {

  function scrollToBottom() {
    // Selectors
    var $messages = $('#messages')
    var $newMessage = $messages.children('li:last-child')
    // Heights
    var clientHeight = $messages.prop('clientHeight')
    var scrollTop = $messages.prop('scrollTop')
    var scrollHeight = $messages.prop('scrollHeight')
    var newMessageHeight = $newMessage.innerHeight()
    var lastMessageHeight = $newMessage.prev().innerHeight()

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      $messages.scrollTop(scrollHeight)
    }
  }

  var socket = io()

  var $locationButton = $('#send-location')

  socket.on('connect', function() {
    console.log('Connected to server')
  })

  socket.on('disconnect', function() {
    console.log('Disconnected from server')
  })

  socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html()
    var html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      text: message.text
    })

    $('#messages').append(html)
    scrollToBottom()
  })

  socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = $('#location-message-template').html()
    var html = Mustache.render(template, {
      createdAt: formattedTime,
      from: message.from,
      url: message.url
    })

    $('#messages').append(html)
    scrollToBottom()
  })

  $('#message-form').on('submit', function(event) {
    event.preventDefault()
    var $input = $('[name=message]')

    socket.emit('createMessage', {
      from: 'User',
      text: $input.val()
    }, function(data) {
      $input.val('')
    })
  })

 $locationButton.on('click', function() {
   if(!navigator.geolocation) return alert('Location not supported by browser')

   $locationButton.attr('disabled', 'disabled').text('Sending location...')

   navigator.geolocation.getCurrentPosition(function(position) {
     $locationButton.removeAttr('disabled').text('Send Location')
     socket.emit('createLocationMessage', {
       latitude: position.coords.latitude,
       longitude: position.coords.longitude
     })
   }, function() {
     alert('Unable to fetch location')
   })
 })
})
