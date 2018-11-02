const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

const app = express()

// Handlebars
hbs.registerPartials(__dirname + '/views/partials')
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())
hbs.registerHelper('screamIt', (text) => text.toUpperCase())
app.set('view engine', 'hbs')

// Middleware
app.use(express.static(__dirname + '/public'))

app.use((req, res, next) => {
  const now = new Date().toString()
  const log = `${now}: ${req.method} ${req.url}`

  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log(err)
  })
  console.log(log)
  next()
})

// app.use((req, res) => {
//   res.render('maintenance.hbs')
// })

// Routing
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home',
    welcomeMessage: 'Node Express Course',
  })
})

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
})

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
