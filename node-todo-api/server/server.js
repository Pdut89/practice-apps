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

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo.save()
    .then(todo => {
      res.send(todo)
    })
    .catch(err => {
      res.status(400).send(err)
    })

})

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  })
  .then(todos => {
    res.send({todos})
  })
  .catch(err => {
    res.status(400).send(err)
  })
})

app.get('/todos/:id', authenticate, (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
  .then(todo => {
    if(!todo) return res.status(400).send('No match found')
    res.send(todo)
  })
  .catch(err => {
    res.status(400).send(err)
  })
})

app.delete('/todos/:id', authenticate, (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  })
  .then(todo => {
    if(!todo) return res.status(400).send('No match found')
    res.send({todo})
  })
  .catch(err => {
    res.status(400).send(err)
  })
})

app.patch('/todos/:id', authenticate, (req, res) => {
  const {id} = req.params
  const {body} = req

  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  if(typeof body.completed === "boolean" && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true})
  .then(todo => {
    if (!todo) return res.status(400).send()
    res.send({todo})
  })
  .catch(err => {
    res.status(400).send()
  })
})

app.post('/users', (req, res) => {
  const {email, password} = req.body
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

app.delete('/users/me/token', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, () => {
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
