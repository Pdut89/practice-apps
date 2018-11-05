const {MongoClient, ObjectID} = require('mongodb')

const obj = new ObjectID()

console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) return console.log('Unable to connect to mongodb server.')

  console.log('Connected to MongoDB server.')
  const db = client.db('TodoApp')

  db.collection('Todos')
  .find({_id: new ObjectID('5be01b5d25501e857c86b08b')})
  .toArray()
  .then(docs => {
    console.log('Todos')
    console.log(JSON.stringify(docs, undefined, 2))
  }, err => {
    console.log('Unable to fetch docs. ', err)
  })

  db.collection('Todos')
  .find()
  .count()
  .then(count => {
    console.log('Count: ', count)
  }, err => {
    console.log('Unable to fetch count. ', err)
  })

  db.collection('Users')
  .find({name:'Pieter Du Toit'})
  .toArray()
  .then(users => {
    console.log('Users')
    console.log(JSON.stringify(users, undefined, 2))
  }, err => {
    console.log('Unable to fetch users. ', err)
  })

  // client.close(() => {
  //   console.log('MongoDB connection closed')
  // })
})
