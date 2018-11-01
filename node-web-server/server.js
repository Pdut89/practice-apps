const express = require('express')

const app = express()

app.use(
  express.static(__dirname + '/public')
)

app.get('/', (req, res) => {
  res.send('<h1>Hello Express</h1>')
})

app.get('/about', (req, res) => {
  res.send({
    name: 'Pieter',
    likes: ['Planes', 'Cars', 'Bikes']
  })
})

app.get('/bad', (req, res) => {
  res.status(400).json({
    errorMessage: 'Something went wrong.'
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
