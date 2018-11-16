require('./config/config')
const {authenticate} = require('./middleware/authenticate')

const express = require('express')
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose')
const {Todo} = require('./models/todo')
const {User} = require('./models/user')
const {ObjectId} = require('mongodb')

const app = express()
const port = process.env.PORT

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  })

  todo.save()
    .then(todo => {
      res.send(todo)
    })
    .catch(err => {
      res.status(400).send(err)
    })

})

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => {
      res.send({todos})
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

app.get('/todos/:id', (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  Todo.findById(id)
    .then(todo => {
      if(!todo) return res.status(400).send('No match found')
      res.send(todo)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

app.delete('/todos/:id', (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  Todo.findByIdAndDelete(id)
    .then(todo => {
      if(!todo) return res.status(400).send('No match found')
      res.send({todo})
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

app.patch('/todos/:id', (req, res) => {
  const {id} = req.params
  const {body} = req

  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  if(typeof body.completed === "boolean" && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) return res.status(400).send()
      res.send({todo})
    })
    .catch(err => {
      res.status(400).send()
    })
})

app.post('/users', (req, res) => {
  const {email, password, tokens} = req.body
  const user = new User({email, password})

  user.save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then(token => {
      res.header('x-auth', token)
      .send(user)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

app.post('/users/login', (req, res) => {
  const {email, password} = req.body

  User.findByCredentials(email, password)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token)
        .send(user)
      })
    })
    .catch(err => {
      res.status(401).send(err)
    })



})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
