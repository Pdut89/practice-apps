const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

const id = '5be1a38b05784856961530e5'
const userId = '5be1a40b61a21f57b1b9ba69'

if (!ObjectId.isValid(id)) {
  console.log('id not valid')
}

Todo.findById(id)
  .then(todo => {
    if (!todo) return console.log('Id not found')
    console.log('Todo: ', todo)
  }).catch(err => console.log(err))

User.findById(userId)
  .then(user => {
    if (!user) return console.log('Id not found')
    console.log('User: ', user)
  }).catch(err => console.log(err))
