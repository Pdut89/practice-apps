const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

Todo.findByIdAndDelete('5be2cb0428f154f06aebdfe8')
  .then(res => {
    console.log(res)
  })
