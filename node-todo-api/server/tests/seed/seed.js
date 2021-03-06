const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

const secret = process.env.JWT_SECRET

const users = [{
  _id: userOneId,
  email: 'pdut@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, secret).toString()
  }]
}, {
  _id: userTwoId,
  email: 'hoskins@gmail.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, secret).toString()
  }]
}]

const todos = [
  {
    _id: new ObjectID(),
    text: 'Test todo text',
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: 'Do laundry',
    completed: true,
    completedAt: 1200,
    _creator: userTwoId
  },

]

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save()
      const userTwo = new User(users[1]).save()

      return Promise.all([userOne, userTwo])
    })
    .then(() => done())
}

const populateTodos = done => {
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos)
    })
    .then(() => done())
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
