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

app.post('/todos', authenticate, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  try {
    await todo.save()
    res.status(200).send(todo)
  } catch(err) {
    res.status(400).send(err)
  }
})

app.get('/todos', authenticate, async (req, res) => {

  try {
    const todos = await Todo.find({_creator: req.user._id})
    res.status(200).send({todos})
  } catch(err) {
    res.status(400).send(err)
  }
})

app.get('/todos/:id', authenticate, async (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  try {
    const todo = await Todo.findOne({_id: id,_creator: req.user._id})
    if(!todo) throw new Error('No match found')
    res.send(todo)
  } catch(err) {
    res.status(400).send(err)
  }
})

app.delete('/todos/:id', authenticate, async (req, res) => {
  const {id} = req.params
  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  try {
    const todo = await Todo.findOneAndDelete({_id: id,_creator: req.user._id})
    if (!todo) throw new Error('No match found')
    res.send({todo})
  } catch(err) {
    res.status(400).send(err)
  }
})

app.patch('/todos/:id', authenticate, async (req, res) => {
  const {id} = req.params
  const {body} = req

  if (!ObjectId.isValid(id)) return res.status(400).send('Invalid id')

  if(typeof body.completed === "boolean" && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  try {
    const todo = await Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id
    }, {$set: body}, {new: true})

    if (!todo) throw new Error('Item not found')
    res.send({todo})
  } catch(err) {
    res.status(400).send()
  }
})

app.post('/users', async (req, res) => {
  const {email, password} = req.body
  const user = new User({email, password})

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch(err) {
    res.status(400).send(err)
  }
})

app.post('/users/login', async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch(err) {
    res.status(401).send(err)
  }
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.delete('/users/me/token', authenticate, async (req,res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send()
  } catch (err) {
    res.status(400).send()
  }
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
